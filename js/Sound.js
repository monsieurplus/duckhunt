var Sound = Base();

// Configuration
Sound.prototype.folder = './sounds/'; // Folder the sounds
Sound.prototype.files = ['bark', 'blast', 'drop', 'duck', 'end_duck_round', 'high_score', 'hit_2', 'laugh', 'lose', 'miss', 'next_round', 'pause', 'point', 'point_2', 'skeet_1', 'skeet_2', 'start', 'start_game', 'start_round', 'win']; // List of filenames without extension

// Private objects
Sound.prototype.elements = {}; // Contains every <audio> tags references
Sound.prototype.repetitions = {}; // For each sound, register how many time it has to be replayed
Sound.prototype.loaded = {}; // For each, register if it's loaded and ready to play
Sound.prototype.muted = false;

/**
 * Creates <audio> for sounds
 */
Sound.prototype.init = function() {
	// Check if audio tag is enabled
	var audio = document.createElement('audio');
	if (!audio) {
		return false
	}
	
	// Repeat handler generator
	var _this = this;
	var repeatHandler = function(name) {
		return function() {
			// No repetition if value is 0, false or undefined
			if (!_this.repetitions[name]) {
				return false
			}
			
			if (_this.repetitions[name] !== true ) {
				_this.repetitions[name]--;
			}
			
			_this.play(name);
		};
	};
	var loadingHandler = function(name) {
		return function() {
			_this.loaded[name] = true;
		};
	};
	
	var container = document.createElement('div');
	
	for (var i=0; i < this.files.length; i++) {		
		var audio = document.createElement('audio');
		
		// Insert sources
		var formats = ['mp3'];
		for (var j=0; j < formats.length; j++) {
			var source = document.createElement('source');
			source.src = this.folder+this.files[i]+'.'+formats[j];
			audio.appendChild(source);
		}
		
		// Add the repeatHandler
		audio.addEventListener('ended', repeatHandler(this.files[i]));
		
		// Add the loadingHandler
		this.loaded[this.files[i]] = false;
		audio.addEventListener('canPlay', loadingHandler(this.files[i]));
		
		// Add the <audio> reference to the object
		this.elements[this.files[i]] = audio;
		
		// Set repetitions to 0
		this.repetitions[this.files[i]] = 0;
		
		// Add the <audio> tag to the container
		container.appendChild(audio);
	}
	
	document.body.appendChild(container);
}

/**
 * Plays a sound
 * @param name Name of the sound to play
 * @param repeat Number of repetition of the sound
 *  - 0 means the sound plays one
 *  - 1 means it will play and then repeat once (it plays twice)
 *  - true means it will repeat forever (until stopped with the "stop" method)
 */
Sound.prototype.play = function(name, repeat) {
	console.info('Sound.play '+name);
	if (!this.elements[name]) {
		return false;
	}
	
	if (this.muted === true) {
		return false;
	}
	
	if (!!repeat) {
		if (repeat === true) {
			this.repetitions[name] = true;
		}
		else {
			// Increase the number of repetition if the sound is already playing
			this.repetitions[name] += repeat;
		}
	}
	
	if (this.loaded[name] === true) {
		this.elements[name].play();
	}
};

/**
 * Stops playing a sound
 */
Sound.prototype.stop = function(name) {
	if (!this.elements[name]) {
		return false;
	}
	
	if (this.loaded[name] === true) {
		this.repetitions[name] = 0; // Stop programmed repetitions too	
		this.elements[name].pause();
		this.elements[name].currentTime = 0;
	}
};

/**
 * Stops playing all sounds
 */
Sound.prototype.stopAll = function() {
	for (var i=0; i < this.files.length; i++) {
		this.stop(this.files[i]);
	}
};

Sound.prototype.mute = function() {
	this.muted = true;
	this.stopAll();
}

Sound.prototype.unmute = function() {
	this.muted = false;
}
