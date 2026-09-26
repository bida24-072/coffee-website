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

// 4. Lighting (Warm cafe lighting)
const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.5); // Warm white
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffd700, 3); // Gold directional
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

// 5. Create 3D Objects (Floating Coffee Beans)
const shapes = [];

function createCoffeeBean() {
    // A torus knot is a great abstract representation of a coffee bean or steam
    const geometry = new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8, 2, 3);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x6F4E37, // Coffee brown
        roughness: 0.4,
        metalness: 0.6
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position within a sphere
    const radius = 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
    mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
    mesh.position.z = (Math.random() - 0.5) * 5;
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Store random speed for animation
    mesh.userData.speed = 0.005 + Math.random() * 0.01;
    mesh.userData.floatOffset = Math.random() * 10;
    
    scene.add(mesh);
    shapes.push(mesh);
}

// Create different amounts of beans based on the page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
let beanCount = 15; // Default for home

if (currentPage === 'menu.html') beanCount = 25; // More beans for menu
if (currentPage === 'about.html') beanCount = 10; // Fewer beans for about
if (currentPage === 'contact.html') beanCount = 12; // Medium for contact

for(let i = 0; i < beanCount; i++) {
    createCoffeeBean();
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
    shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.speed;
        shape.rotation.y += shape.userData.speed * 1.5;
        
        // Gentle floating motion based on time and offset
        shape.position.y += Math.sin(elapsedTime + shape.userData.floatOffset) * 0.003;
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

// 9. Mobile Menu Toggle (for all pages)
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
document.querySelector('nav').appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});
