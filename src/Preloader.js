var MODE = "SEQUENCE"; //SEQUENCE"; // vs. "SEQUENCE"
var CURRENT_LEVEL_INDEX;


BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () 
	{
		this.game.stage.backgroundColor = "#fff";

		loading = this.add.text(0, 0, "LOADING", { font: 'bold 44px sans-serif', fill: '#000'});
		loading.x = this.game.canvas.width/2 - loading.width/2;
		loading.y = this.game.canvas.height / 2 - loading.height;

		preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		preloadBar.x = this.game.canvas.width/2 - preloadBar.width/2;
		preloadBar.y = this.game.canvas.height/2 - preloadBar.height/2;

		this.load.setPreloadSprite(preloadBar);

		this.load.image('transparency_bg.png','assets/transparency_bg.png');
		this.load.image('black_pixel.png','assets/black_pixel.png');
		this.load.image('red_pixel.png','assets/red_pixel.png');
		this.load.image('default_particle.png','assets/default_particle.png');

		// this.load.json('gamesJSON','gameData.json' + '?' + Math.floor(Math.random()*1000),true);
		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.png' + '?' + Math.floor(Math.random()*1000),"atlas/gameAtlas.json" + '?' + Math.floor(Math.random()*1000),null);

		this.load.json('gamesJSON','gameData.json',true);
		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.png',"atlas/gameAtlas.json",null);
		this.load.atlasJSONHash('atlas1','assets/atlas1.png',"assets/atlas1.json",null);
		this.load.atlasJSONHash('atlas2','assets/atlas2.png',"assets/atlas2.json",null);
		this.load.atlasJSONHash('atlas3','assets/atlas3.png',"assets/atlas3.json",null);

	},

	create: function () {

		// this.preloadBar.cropEnabled = false;
	},

	update: function () {
		
		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		if (this.ready == false)
		{
			this.ready = true;
			if (MODE == "MENU")
			{
				this.state.start('MainMenu');
			}
			else 
			{
				CURRENT_LEVEL_INDEX = -1; // As in, this is the start
				this.state.start('Game');
			}
		}

	}

};
