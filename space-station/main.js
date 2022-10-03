import './style.css'
import Universe from './Universe/Universe'
import Modal from './Universe/Utils/Modal'

const universe = new Universe(document.querySelector(".universe-canvas"))
const modal = new Modal(document.querySelectorAll("[data-modal]"))