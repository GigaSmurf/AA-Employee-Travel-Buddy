import React, { useRef, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MathUtils } from 'three';
import '../css/Startup.css';

function ThreeDModel() {
    const ref = useRef();
    useGLTF.preload('/plane/source/1837.gltf');
    const rotationDirection = useRef(1); 
    useFrame((state, delta) => {
        // Rotate the model
        ref.current.rotation.z += delta * rotationDirection.current * 0.3;
        // Check if the rotation exceeds 45 degrees (in radians) and reverse the direction
        if (Math.abs(ref.current.rotation.z) > MathUtils.degToRad(40)) {
            rotationDirection.current *= -1; // Flip the rotation direction
            // ref.current.rotation.z = MathUtils.degToRad(45) * rotationDirection.current; // Correct overshoot
        }

        // Move the model forward
        ref.current.position.y += delta * 5; // Adjust speed as needed
        ref.current.position.x += delta * -50;

        // Reset position after moving a certain distance
        if (ref.current.position.y > 90) { // Adjust the reset threshold as needed
            ref.current.position.y = -60; // Adjust the reset position as needed
            // ref.current.rotation.z = 15;
        }
        if (ref.current.position.x < 90) { // Adjust the reset threshold as needed
            ref.current.position.x = 30; // Adjust the reset position as needed
            // ref.current.rotation.z = 15;
        }
    });

    return (
        <Suspense fallback={null}>
            <primitive 
                ref={ref} 
                object={useGLTF('/plane/source/1837.gltf', true).scene} 
                scale={0.04} // Adjust scale as needed
            />
        </Suspense>
    );
}


function Startup() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 7000); // 7 seconds delay

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <Canvas 
                style={{ background: '#afc4da' }}
                camera={{ position: [50, 75, 50], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} />
                <ThreeDModel />
                <OrbitControls target={[55, 45, 0]} /> {/* Camera will orbit around [0, 0, 0] */}
            </Canvas>
            <div className="centered-text">
                Transporting you to Home...
            </div>
        </div>
    );
}

export default Startup;
