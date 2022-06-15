
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		this.game.stage.backgroundColor = 0xFF00FF;

		gamesJSON = this.cache.getJSON('gamesJSON');

		buttonX = 0;
		buttonY = 0;
		buttonSize = 64;
		for (var i = 0; i < gamesJSON.data.length; i++)
		{
			button = this.add.sprite(buttonX,buttonY,'gameAtlas',gamesJSON.data[i].name + '/' + 'get_1.png');

			if (button.width > button.height)
			{
				button.scale.x = button.scale.y = (buttonSize / button.width);
			}
			else
			{
				button.scale.x = button.scale.y = (buttonSize / button.height);
			}

			button.x = button.x + buttonSize/2 - button.width/2;

			button.gameIndex = i;

			button.inputEnabled = true;
			button.events.onInputDown.add(this.startGame,this);

			buttonX += buttonSize;
			if (buttonX + buttonSize >= this.game.canvas.width)
			{
				buttonX = 0;
				buttonY += buttonSize;
			}
		}

	},


	startGame: function (b) {
		CURRENT_LEVEL_INDEX = b.gameIndex;
		b.game.state.start('Game');
	},

	update: function () {

		//	Do some nice funky main menu effect here

	}

};
