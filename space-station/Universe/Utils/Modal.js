import Universe from '../Universe';

export default class Modal {
  constructor(){    
    // Show Modal
    const openModalButton = document.getElementById("open-modal");
    const modalWindowOverlay = document.getElementById("modal-overlay");
    const showModalWindow = () => {
      modalWindowOverlay.style.display = 'flex';
    }
    openModalButton.addEventListener("click", showModalWindow); //NOTE: change to when component is selected

    // Hide Modal
    const closeModalButton = document.getElementById("close-modal");
    const hideModalWindow = () => {
        modalWindowOverlay.style.display = 'none';
    }
    closeModalButton.addEventListener("click", hideModalWindow);


    // Hide On Blur
    const hideModalWindowOnBlur = (e) => {

        if(e.target === e.currentTarget) {
          console.log(e.target === e.currentTarget)
            hideModalWindow();
        }
    }
    modalWindowOverlay.addEventListener("click", hideModalWindowOnBlur)

    }
}
