import pandas as pd
import requests
from prophet import Prophet
import matplotlib.pyplot as plt
import warnings

import pickle

# Ignore FutureWarnings
warnings.simplefilter(action='ignore', category=FutureWarning)





flight_example = {
    "flightNumber": "1616",
    "origin": {"code": "DFW", "city": "Dallas-Fort Worth"},
    "destination": {"code": "PHL", "city": "Philadelphia"},
    "departureTime": "2022-05-14T02:32:32.307-05:00",
    "arrivalTime": "2022-05-14T06:48:32.307-04:00",
}



departure_time = pd.to_datetime(flight_example['departureTime']).tz_convert(None)
arrival_time = pd.to_datetime(flight_example['arrivalTime']).tz_convert(None)
arrival_hour = arrival_time.hour
cities = [
    "Dallas-Fort Worth", "New York City", "Los Angeles", "Chicago", "Greensboro",
    "Atlanta", "Denver", "Charlotte", "Phoenix", "Orlando", "Seattle", "Miami",
    "Houston", "Fort Lauderdale", "Baltimore", "San Francisco", "Newark",
    "Minneapolis", "Detroit", "Tampa", "Salt Lake City", "San Diego", "Philadelphia"
]





flight_df = pd.DataFrame({
    'ds': [departure_time],
    'arrival_hour': [arrival_hour],
    # Initialize one-hot encoded columns for cities
})



for city in cities:
    flight_df[f'origin_{city}'] = 0
    flight_df[f'destination_{city}'] = 0

# Set the flight's origin and destination cities to 1
flight_df[f'origin_{flight_example["origin"]["city"]}'] = 1
flight_df[f'destination_{flight_example["destination"]["city"]}'] = 1






# Define date range for data fetching
start_date = '2022-01-01'
end_date = '2022-01-05'
dates = pd.date_range(start=start_date, end=end_date)
base_url = "https://aaflightenginedb-5c259d62e9ab.herokuapp.com/flights?date="

# Fetch data
all_data = []
for date in dates:
    print(date)
    formatted_date = date.strftime('%Y-%m-%d')
    request_url = f"{base_url}{formatted_date}"
    response = requests.get(request_url)
    if response.status_code == 200:
        all_data.extend(response.json())
    else:
        print(f"Failed to retrieve data for {formatted_date}")

# Data Stratification, cause pulling all of it was taking too long
temp_df = pd.json_normalize(all_data)

temp_df['departureTime'] = pd.to_datetime(temp_df['departureTime'], errors='coerce')

nat_rows = temp_df[temp_df['departureTime'].isna()]
if not nat_rows.empty:
    print("Rows with NaT 'departureTime':")
    print(nat_rows)
# Ensure departureTime is a datetime type
temp_df = temp_df.dropna(subset=['departureTime'])

# Stratify data: Sample 15 flights per day
sampled_df = temp_df.groupby(temp_df['departureTime'].dt.date).apply(lambda x: x.sample(n=min(15, len(x)), random_state=1)).reset_index(drop=True)






# Normalize data and prepare for Prophet
# Normalize data and prepare for Prophet using sampled_df
df = pd.json_normalize(
    sampled_df.to_dict('records'),  # Convert sampled_df back to a list of dicts
    record_path=None,
    meta=[
        'flightNumber',
        ['origin', 'city'],
        ['destination', 'city'],
        'distance',
        ['duration', 'hours'],
        'departureTime',
        'arrivalTime',
        ['aircraft', 'model'],
        ['aircraft', 'passengerCapacity', 'total'],
        'standby'
    ],
    errors='ignore'
)   


df.rename(columns={'origin.city': 'origin_city', 'destination.city': 'destination_city'}, inplace=True)

df_encoded = pd.concat([
    df,
    pd.get_dummies(df['origin_city'], prefix='origin'),
    pd.get_dummies(df['destination_city'], prefix='destination')
], axis=1)

# Optionally, drop the original 'origin_city' and 'destination_city' columns
df_encoded.drop(['origin_city', 'destination_city'], axis=1, inplace=True)

# Prepare DataFrame for Prophet
prophet_df = df_encoded[['departureTime', 'standby']].rename(columns={'departureTime': 'ds', 'standby': 'y'})
prophet_df['ds'] = pd.to_datetime(prophet_df['ds'], utc=True).dt.tz_localize(None)

one_hot_columns = [col for col in df_encoded.columns if col.startswith('origin_') or col.startswith('destination_')]
prophet_df = pd.concat([prophet_df, df_encoded[one_hot_columns]], axis=1)

# Initialize Prophet and add extra regressors
model = Prophet()
for column in one_hot_columns:
    model.add_regressor(column)

# Fit the model
model.fit(prophet_df)

# Make future predictions
future_dates = model.make_future_dataframe(periods=10)
# TODO: Add logic to set the correct values for one-hot encoded columns in future_dates
for column in one_hot_columns:
    future_dates[column] = 0



forecast = model.predict(future_dates)



# Plot and save forecast
fig1 = model.plot(forecast)
plt.savefig('forecast.png')
plt.close(fig1)

# Plot and save forecast components
fig2 = model.plot_components(forecast)
plt.savefig('forecast_components.png')
plt.close(fig2)


# Assuming 'model' is your trained Prophet model
forecast = model.predict(flight_df)

# Access the predicted number of standby seats
predicted_standby_seats = forecast.loc[0, 'yhat']
print(f"Predicted standby seats for the flight on {flight_df.loc[0, 'ds'].date()}: {predicted_standby_seats}")



# Assuming 'model' is your trained Prophet model
with open('prophet_model.pkl', 'wb') as f:
    pickle.dump(model, f)