var Game = Base();

// Public properties
Game.prototype.canvas = false;
Game.prototype.context = false;
Game.prototype.interval = false;
Game.prototype.layerManager = false;
Game.prototype.sprites = false;

/*
 * chars:128x56
 * char: 8x8
 * nes: 256x224
 * tv: 256x240
 */
Game.prototype.init = function() {
	// Game config
	var canvasWidth = 256;
	var canvasHeight = 224;
	var fpsTarget = 60;
	
	// Load sprites
	this.sprites = new Image();
	this.sprites.src = 'images/sprites.png';
	
	// Initialize canvas
	this.canvas = document.createElement("canvas");
	
	// Detect canvas support
	if (this.canvas === false || this.canvas === undefined) {
		alert("Your browser don't support canvas");
		return false;
	}
	
	// Canvas dimensions
	this.canvas.width = canvasWidth;
	this.canvas.height = canvasHeight;
	this.canvas.style.width = '256px';
	this.canvas.style.height = '224px';
	
	// Canvas interactions
	var _this = this;
	this.canvas.addEventListener('click', function(e) {
		// Convert click position to canvas resolution
		_this.fireEvent('click', { x : Math.round(((e.clientX-e.target.offsetLeft)*e.target.height)/e.target.clientHeight), y : Math.round(((e.clientY-e.target.offsetTop)*e.target.height)/e.target.clientHeight) });
	});

	// Add canvas to the document
	document.body.appendChild(this.canvas);
	
	// Get context
	this.context = this.canvas.getContext("2d");
	
	// Create LayerManager
	this.layerManager = new LayerManager();
	
	// Game loading
	var main = new MainScreen();
	main.addEventListener('choice', function(e) {
		main.remove();
		
		if (e.choice === 'A') {
			var swamp = new SwampScreen();
			swamp.init();
			swamp.start();
		}
	});
	main.insert();
	
	// Game Loop
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){ window.setTimeout(callback, 1000/fpsTarget);};
    })();
	
	var fpsCounter = 0;
	(function animloop(){
		requestAnimFrame(animloop);
		game.context.clearRect(0,0, game.canvas.width, game.canvas.height);
		game.layerManager.draw();
		fpsCounter++;
	})();

	var fpsDisplay = document.getElementById('fps-counter');
	var fpsInterval = setInterval(function() {
		fpsDisplay.innerHTML = fpsCounter+' fps';
		fpsCounter = 0;
	}, 1000);
};