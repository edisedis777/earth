# Immersive 3D Earth

![Immersive 3D Earth Preview](preview.gif)

A captivating 3D visualization of Earth with an orbiting moon, built using Three.js. This project features interactive controls for both desktop and mobile devices, complete with a starfield background, atmospheric effects, and cloud layer.

## Features

- **Interactive Earth**: Rotate the Earth by dragging (mouse or touch) and zoom with scroll or pinch gestures
- **Movable Moon**: Control the moon's orbit using WASD keys or on-screen buttons (↑↓←→)
- **Realistic Visuals**: Includes a textured Earth, cloud layer, atmospheric glow, and detailed moon
- **Mobile-Friendly**: Optimized for touch controls with an intuitive info panel for mobile users
- **Dynamic Environment**: Starfield background and subtle animations enhance the 3D experience

## Demo

[Live Demo](https://edisedis777.github.io/earth/)


#### Install:
No installation is required since Three.js is loaded via CDN.

### Usage
#### Desktop:
Drag with the mouse to rotate Earth
Scroll to zoom in/out
Use WASD keys to move the moon

#### Mobile:
Tap and drag to rotate Earth
Pinch to zoom
Use the on-screen buttons (↑↓←→) to move the moon
Check the info box at the top for controls

#### Project Structure

immersive-3d-earth/
├── assets/          # Texture files (not included)
│   ├── 3d-cute.jpg  # Earth texture
│   ├── clouds.png   # Cloud texture
│   └── moon.jpg     # Moon texture
├── index.html       # Main HTML file
├── script.js        # Three.js logic and controls
├── styles.css       # Styling for UI elements
└── README.md        # This file

#### Technologies
Three.js (r134) - 3D rendering library
HTML5 & CSS3 - Structure and styling
JavaScript - Interaction logic

#### Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-idea)
Commit your changes (git commit -m 'Add amazing idea')
Push to the branch (git push origin feature/amazing-idea)
Open a Pull Request


#### Suggestions for contributions:
Add more celestial bodies (e.g., Sun, other planets)
Implement texture customization
Add animation speed controls
Enhance mobile gestures

#### License
This project is licensed under the MIT License - see the LICENSE file for details.

#### Acknowledgments
Inspired by [3D earth visualization](https://jsdev.space/immersive-3d-earth/)
Texture resources: NASA, Solar System Scope

Happy exploring the cosmos! 🌍🌕✨
