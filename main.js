import * as THREE from 'three';

// 1. Scene Setup
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();

// 2. Camera Setup
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background so video shows through
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

// 5. Create 3D Objects (Floating Coffee Beans / Abstract Shapes)
const shapes = [];

function createShape() {
    // Creating a torus knot to represent coffee/steam abstractly
    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xf5c542, // Coffee gold
        roughness: 0.3,
        metalness: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 5;
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Store random speed for animation
    mesh.userData.speed = 0.01 + Math.random() * 0.02;
    
    scene.add(mesh);
    shapes.push(mesh);
}

// Create 15 floating shapes
for(let i = 0; i < 15; i++) {
    createShape();
}

// 6. Mouse Interaction (Parallax)
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / sizes.width) - 0.5;
    mouseY = (event.clientY / sizes.height) - 0.5;
});

// 7. Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate and float shapes
    shapes.forEach((shape, index) => {
        shape.rotation.x += shape.userData.speed;
        shape.rotation.y += shape.userData.speed;
        
        // Gentle floating motion
        shape.position.y += Math.sin(elapsedTime + index) * 0.005;
    });

    // Parallax effect based on mouse
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// 8. Handle Window Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
