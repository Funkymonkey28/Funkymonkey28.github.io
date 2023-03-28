export default class SplashScreen {
	constructor() {
        
	}

	static show() {
        this.view = document.querySelector('#splash-screen');
        this.view.style.display = 'flex';
	}

	static hide() {
        this.view = document.querySelector('#splash-screen');
        this.view.style.display = 'none';
	}
}
