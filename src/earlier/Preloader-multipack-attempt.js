var MODE = "SEQUENCE"; // vs. "SEQUENCE"
var CURRENT_LEVEL_INDEX;
var NUM_ATLASES = 24;

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

		// this.load.json('gamesJSON','gameData.json' + '?' + Math.floor(Math.random()*1000),true);
		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.png' + '?' + Math.floor(Math.random()*1000),"atlas/gameAtlas.json" + '?' + Math.floor(Math.random()*1000),null);

		this.load.json('gamesJSON','gameData.json',true);
		// this.load.atlasJSONHash('gameAtlas','atlas/gameAtlas.png',"atlas/gameAtlas.json",null);

		for (var i = 0; i <= NUM_ATLASES; i++)
		{
			this.load.json('gameAtlasJSON' + i,'atlas/gameAtlas-multipack-' + i + '.json',true);
			this.load.atlasJSONHash('gameAtlas' + i,'atlas/gameAtlas-multipack-' + i + '.png','atlas/gameAtlas-multipack-' + i + '.json',null);
		}

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
