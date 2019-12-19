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



// Request Animation Frame (RAF) object to optimize performance adding all animations in and running a single RAF
var RAF = {
    els: [],
    add: function(object) {
    	this.els.push(object);
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
        requestAnimationFrame(RAF.animate);
        RAF.render();
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




// Game score
var Game_Score = {
	text: 'Score: ',
	score: 0,
	display: '',
	
	init: function(){},
	render: function(){},
	resize: function(){}
}





// Player object
var Player = {
	started: false,
	color: "#ff6600",
	width: 20,
	height: 30,
	floorDistance: 30,
	
	speed: 10,

	pos: {
		x: 0,
		y: 0
	},
	
	collisionX: {
		start: 0,
		end: 0
	},
	
	collisionY: 0,
	
	updateCollision: function(){
		this.collisionX.start = this.pos.x;
		this.collisionX.end = this.pos.x + this.width;
		
		
		this.collisionY = this.pos.y;
	},
	
	addListeners: function(){
		var _self = this;
		document.addEventListener('keydown', function(event){
			if(event.keyCode == 37){
				// console.log("arrow left pressed")
				if(!_self.started) _self.started = true;

				_self.pos.x -= _self.speed;
				if(_self.pos.x < 0) _self.pos.x = 0;
			} else if (event.keyCode == 39){
				// console.log("arrow right pressed")
				if(!_self.started) _self.started = true;

				_self.pos.x += _self.speed;
				if(_self.pos.x > (canvas.width - _self.width)) _self.pos.x = canvas.width - _self.width;
			}
			
			_self.updateCollision();
		})
	},
	
	init: function(){
		this.pos.x = halfWidth - (this.width/2);
		this.pos.y = maxHeight - this.height - this.floorDistance;
		this.updateCollision();
		
		this.addListeners();
	},
	
	render: function(){
		context.globalAlpha = 1;
		context.fillStyle= this.color;
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	},
	
	resize: function(){
		if(this.pos.x > (canvas.width - this.width) && this.started) {
			this.pos.x = canvas.width - this.width;
		} else if(!this.started) {
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
	this.width = 15;
	this.height = 15;
	
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
	
	this.collisionY = 0;
	
	this.updateCollision = function(){
		this.collisionX.start = this.pos.x;
		this.collisionX.end = this.pos.x + this.width;


		this.collisionY = this.pos.y + this.height;
	};
	
	this.fall = function(){
		this.pos.y += this.speed;
		if (this.pos.y > maxHeight) this.reset();
	};
	
	this.reset = function(){
		this.pos.y = 0;
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
	};
	
	this.resize = function(){};
}


var _enemyTest = new Four();
var _enemyTest2 = new Four();
RAF.add(_enemyTest);
RAF.add(_enemyTest2);
