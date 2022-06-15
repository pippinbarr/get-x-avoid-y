var MODE = "SEQUENCE"; // vs. "SEQUENCE"
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


		// this.load.json('gamesJSON','gameData.json',true);

		this.load.image('transparency_bg.png','images/transparency_bg.png');
		this.load.image('black_pixel.png','images/black_pixel.png');
		this.load.image('red_pixel.png','images/red_pixel.png');
		this.load.image('default_particle.png','images/default_particle.png');

		assetsJSON = this.game.cache.getJSON('gamesJSON');
		for (var i = 0; i < assetsJSON.data.length; i++)
		{
			// Load BG
			for (var j = 1; j <= assetsJSON.data[i].frames[0]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'bg_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'bg_' + j + '.png');
			}

			// Load FG
			for (var j = 1; j <= assetsJSON.data[i].frames[1]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'fg_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'fg_' + j + '.png');
			}

			// Load get
			for (var j = 1; j <= assetsJSON.data[i].frames[2]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'get_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'get_' + j + '.png');
			}

			// Load avoid
			for (var j = 1; j <= assetsJSON.data[i].frames[3]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'avoid_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'avoid_' + j + '.png');
			}	

			// Load get particle
			for (var j = 1; j <= assetsJSON.data[i].frames[4]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'get_particle_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'get_particle_' + j + '.png');
			}	

			// Load avoid particle
			for (var j = 1; j <= assetsJSON.data[i].frames[5]; j++)
			{
				this.load.image(assetsJSON.data[i].name + '/' + 'avoid_particle_' + j + '.png','images/' + assetsJSON.data[i].name + '/' + 'avoid_particle_' + j + '.png');
			}				
		}

		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.png',"atlas/gameAtlas.json",null);
		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.jpg',"atlas/gameAtlas.json",null);

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
