// Canvas & global vars setup
var canvas, context;
var PI2 = Math.PI*2;

var maxWidth = window.innerWidth,	
	 maxHeight = window.innerHeight;

var halfWidth = maxWidth / 2,
	 halfHeight = maxHeight / 2;

// Resize adjustments
function onResizeWindow() {
	maxWidth = window.innerWidth;
	maxHeight = window.innerHeight;
	halfWidth = maxWidth /2;
	halfHeight = maxHeight / 2;
}


var RAFrequest = undefined;

// Request Animation Frame (RAF) object to optimize performance adding all animations in and running a single RAF
var RAF = {
	status: false, // false means off
	switch: undefined,

    els: [],

    add: function(object) {
    	this.els.unshift(object);
    	object.init();
    },
    remove: function(object) {
    	var idx = this.els.indexOf(object);
    	this.els.splice(idx, 1);
    },

    init: function() {
		var _self = this;
		this.animate();
		window.addEventListener("resize", function() {
			_self.resize();
		}, false);
    },

    animate: function() {
        RAFrequest = requestAnimationFrame(RAF.animate);
        RAF.render();
    },
    stop: function(){
    	window.cancelAnimationFrame(RAFrequest);
    },

    render: function() {
        for (var i = 0; i < RAF.els.length; i++) {
            RAF.els[i].render();
        }
    },
	resize: function() {
		onResizeWindow();
		for (var i = 0; i < RAF.els.length; i++) {
			RAF.els[i].resize();
		}
	}
}

// Start RAF
RAF.init();




// Canvas
var Game_Canvas = {
	background: "#202020",

	reset: function(){
		RAF.stop();
		RAF.els = [Game_Canvas];
		RAF.animate();
	},
	
	init: function() {
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		document.body.appendChild(canvas);

		this.resize();
	},
	
	render: function() {
		// context.clearRect(0, 0, maxWidth, maxHeight);
		context.globalAlpha = 0.2;
		context.fillStyle= this.background;
		context.fillRect(0,0, maxWidth, maxHeight);
	},
	
	resize: function(){
		canvas.width = maxWidth;
		canvas.height = maxHeight;
	}
}

// Init game canvas
RAF.add(Game_Canvas);




// Game score: Time version
// var Time_Score = {
// 	text: 'Score:  ',
// 	score: 0,
// 	display: '',
// 	font: "24px GP, Helvetica",
// 	color: "#fff",
// 	clock: null,

// 	pos: {
// 		x: 0,
// 		y: 40,
// 		rightDist: 292
// 	},

// 	updateScore: function() {
// 		this.display = this.text + this.score + ' s';
// 	},

// 	startScoring: function(){
// 		var _self = this;

// 		this.clock = setInterval(function(){
// 			_self.score += 1;
// 			_self.updateScore();
// 		}, 1000);
// 	},

// 	stopScoring: function(){
// 		clearInterval(this.clock);
// 	},

// 	getScorePosition: function(){
// 		this.pos.x = maxWidth - this.pos.rightDist;
// 	},
	
// 	init: function(){
// 		this.getScorePosition();
// 		this.startScoring();
// 		this.updateScore();
// 	},

// 	render: function(){
// 		context.font = this.font;
// 		context.fillStyle = this.color;
// 		context.fillText(this.display, this.pos.x, this.pos.y);
// 	},

// 	resize: function(){
// 		this.getScorePosition();
// 	}
// }

// // Start score
// RAF.add(Time_Score);




// Game score: Points version
var Points_Score = {
	text: 'Score:  ',
	score: 0,
	display: '',
	font: "24px GP, Helvetica",
	color: "#fff",
	clock: null,

	pos: {
		x: 0,
		y: 40,
		rightDist: 292
	},

	updateScore: function() {
		this.display = this.text + this.score + ' dodged';
	},

	getScorePosition: function(){
		this.pos.x = maxWidth - this.pos.rightDist;
	},

	reset: function(){
		this.score = 0;
		RAF.add(Points_Score);
	},

	
	init: function(){
		this.getScorePosition();
		this.updateScore();
	},

	render: function(){
		context.font = this.font;
		context.fillStyle = this.color;
		context.fillText(this.display, this.pos.x, this.pos.y);
		this.updateScore();
	},

	resize: function(){
		this.getScorePosition();
	}
}

// Start score
RAF.add(Points_Score);





// Player object
var Player = {
	initialized: false,
	played: false,
	color: "#05f",
	width: 62,
	height: 88,
	floorDistance: 30,

	speed: 30,

	pos: {
		x: 0,
		y: 0
	},

	collisionX: {
		start: 0,
		end: 0
	},

	collisionY: {
		start: 0,
		end: 0
	},
	
	updateCollision: function(){
		this.collisionX.start = this.pos.x;
		this.collisionX.end = this.pos.x + this.width;


		this.collisionY.start = this.pos.y;
		this.collisionY.end = this.pos.y + this.height;
	},

	addListeners: function(){
		var _self = this;

		document.addEventListener('keydown', function(event){
			if(event.keyCode == 37){
				// console.log("arrow left pressed")
				if(!_self.played) _self.played = true;

				_self.pos.x -= _self.speed;
				if(_self.pos.x < 0) _self.pos.x = 0;
			} else if (event.keyCode == 39){
				// console.log("arrow right pressed")
				if(!_self.played) _self.played = true;

				_self.pos.x += _self.speed;
				if(_self.pos.x > (canvas.width - _self.width)) _self.pos.x = canvas.width - _self.width;
			}
			
			_self.updateCollision();
		});
	},

	reset: function(){
		RAF.add(Player);
	},

	init: function(){
		this.pos.x = halfWidth - (this.width/2);
		this.pos.y = maxHeight - this.height - this.floorDistance;
		this.updateCollision();
		
		if (!this.initialized) {
			this.initialized = true;
			this.addListeners();
		}
	},

	render: function(){
		context.globalAlpha = 1;
		context.fillStyle= this.color;
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	},

	resize: function(){
		if(this.pos.x > (canvas.width - this.width) && this.played) {
			this.pos.x = canvas.width - this.width;
		} else if(!this.played) {
			this.pos.x = halfWidth - (this.width/2);
		}
	}
}

// Initialize Player
RAF.add(Player);




// Falling objects Class
var Four = function(args) {
	if (args === undefined) var args = {};
	
	this.color = "#ff0000";
	this.width = 78;
	this.height = 105;
	
	this.speed = 12;
	this.maxSpeed = 10;
	this.minSpeed = 5;

	this.pos = {
		x: 0,
		y: 0
	};
	
	this.collisionX = {
		start: 0,
		end: 0
	};
	
	this.collisionY = {
		start: 0,
		end: 0
	};
	
	this.updateCollision = function(){
		this.collisionX.start = this.pos.x;
		this.collisionX.end = this.pos.x + this.width;


		this.collisionY.start = this.pos.y;
		this.collisionY.end = this.pos.y + this.height;
	};

	this.detectCollision = function(){
		if(this.collisionX.end > Player.collisionX.start &&
			this.collisionY.end > Player.collisionY.start &&
			this.collisionX.end < Player.collisionX.end &&
			this.collisionY.end < Player.collisionY.end) {
			this.collisioned();

		} else if (this.collisionX.start > Player.collisionX.start &&
					this.collisionY.end > Player.collisionY.start &&
					this.collisionX.start < Player.collisionX.end &&
					this.collisionY.end < Player.collisionY.end) {
			this.collisioned();

		} else if (this.collisionX.end > Player.collisionX.start &&
					this.collisionY.start > Player.collisionY.start &&
					this.collisionX.end < Player.collisionX.end &&
					this.collisionY.start < Player.collisionY.end) {
			this.collisioned();

		} else if (this.collisionX.start > Player.collisionX.start &&
					this.collisionY.start > Player.collisionY.start &&
					this.collisionX.start < Player.collisionX.end &&
					this.collisionY.start < Player.collisionY.end) {
			this.collisioned();

		} else if (Player.collisionX.end > this.collisionX.start &&
					Player.collisionY.end > this.collisionY.start &&
					Player.collisionX.end < this.collisionX.end &&
					Player.collisionY.end < this.collisionY.end) {
			this.collisioned();

		} else if (Player.collisionX.start > this.collisionX.start &&
					Player.collisionY.end > this.collisionY.start &&
					Player.collisionX.start < this.collisionX.end &&
					Player.collisionY.end < this.collisionY.end) {
			this.collisioned();

		} else if (Player.collisionX.end > this.collisionX.start &&
					Player.collisionY.start > this.collisionY.start &&
					Player.collisionX.end < this.collisionX.end &&
					Player.collisionY.start < this.collisionY.end) {
			this.collisioned();

		} else if (Player.collisionX.start > this.collisionX.start &&
					Player.collisionY.start > this.collisionY.start &&
					Player.collisionX.start < this.collisionX.end &&
					Player.collisionY.start < this.collisionY.end) {
			this.collisioned();

		} else {
			this.color = "#f00";
		}
	};

	this.collisioned = function(){
		this.color = "#05f";
		RAF.stop();
	};
	
	this.fall = function(){
		this.pos.y += this.speed;
		if (this.pos.y > maxHeight) {
			this.reset();
			Points_Score.score += 1;	// Special setup for point scoring
		}
	};
	
	this.reset = function(){
		this.pos.y = 0 - this.height;
		this.pos.x = (Math.random() * canvas.width) - this.width;
		this.speed = (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed);
	};
	
	this.init = function(){
		this.reset();
	};
	
	this.render = function(){
		context.globalAlpha = 1;
		context.fillStyle= this.color;
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		
		this.fall();

		this.updateCollision();
		this.detectCollision();
	};
	
	this.resize = function(){};
}




// Game difficulty (that means enemies and how much are there)
var Game_Difficulty = {
	totalEnemies: 1,
	enemiesArray: [],
	crazyMode: null,
	crazySpeed: 2000,
	crazyAccel: 1,
	crazySpeedLimit: 1000,

	font: "24px GP, Helvetica",
	color: "#fff",
	text: "Current enemies: ",
	display: "",
	pos: {
		x: 0,
		y: 100,
		rightDist: 292
	},

	createEnemies: function(){
		var _self = this;

		for (var i = 0; i < _self.totalEnemies; i++) {
			var _newEnemy = new Four();
			_self.enemiesArray.push(_newEnemy);
		}

		for (var i = 0; i < _self.enemiesArray.length; i++) {
			RAF.add(_self.enemiesArray[i]);
		}
	},

	increaseDifficulty: function(){
		var _self = this;

		this.crazySpeed -= this.crazyAccel;
		if (this.crazySpeed <= this.crazySpeedLimit ) {
			this.crazySpeed = this.crazySpeedLimit
		} else {
			this.crazyAccel += this.crazyAccel;
		}

		this.crazyMode = setInterval(function(){
			var _enemy = new Four();
			RAF.add(_enemy);

			_self.totalEnemies += 1;

		}, this.crazySpeed);
	},

	stop: function(){
		clearInterval(this.crazyMode);
	},

	updateDifficultyDisplay: function(){
		this.display = this.text + this.totalEnemies;
	},

	getPosition: function(){
		this.pos.x = maxWidth - this.pos.rightDist;
	},

	reset: function(){
		// Difficulty reset
		this.stop();
		this.totalEnemies = 1;
		this.enemiesArray = [];
		this.crazySpeed = 2000;
		this.crazyAccel = 1;
		RAF.add(Game_Difficulty);
	},


	init: function(){
		var _self = this;
		this.getPosition();
		this.createEnemies();
		this.increaseDifficulty();
	},

	render: function(){
		context.font = this.font;
		context.fillStyle = this.color;
		context.fillText(this.display, this.pos.x, this.pos.y);
		this.updateDifficultyDisplay();
	},

	resize: function(){
		this.getPosition();
	}
}

// Trigger game difficulty
RAF.add(Game_Difficulty);



// Reset Game
function resetGame(){
	// RAF & Game reset
	// RAF.els = [Game_Canvas];
	// RAF.animate();
	Game_Canvas.reset();


	// Score reset
	// Points_Score.score = 0;
	// RAF.add(Points_Score);
	Points_Score.reset();

	// Player reset
	// RAF.add(Player);
	Player.reset();

	// Difficulty reset
	// Game_Difficulty.stop();
	// Game_Difficulty.totalEnemies = 1;
	// Game_Difficulty.enemiesArray = [];
	// Game_Difficulty.crazySpeed = 2000;
	// Game_Difficulty.crazyAccel = 1;
	// RAF.add(Game_Difficulty);
	Game_Difficulty.reset();

}


window.addEventListener('click', function(){
	resetGame();
})


