import './style.css'
import Universe from './Universe/Universe'
import SplashScreen from './Universe/Utils/SplashScreen';

// Show splash screen
SplashScreen.show();

// Load the 3D world
const universe = new Universe(document.querySelector(".universe-canvas"))