// Madness value to increase mixing of levels
var MADNESS = 0;
var MADNESS_MIN_LEVELS = 8;
var MADNESS_INCREMENT = 0.1;

// "Enum" to store set array positions of frame numbers and frame rates
var BG = 0;
var FG = 1;
var GET = 2;
var AVOID = 3;
var GET_PARTICLE = 4;
var AVOID_PARTICLE = 5;

// Tracking levels
var THIS_LEVEL;
var LEVELS_SEEN = 0;

// Amout of time
var TIME = 8;

// "Object" constants
var NUM_GET = 8;
var NUM_AVOID = 8;
var SEED_INCREMENT = 0.005;
var MAX_VELOCITY = 5;
var EMITTER_SPEED = 300;

// Game state tracking
var STATE;
var getCount = 0;
var avoidCount = 0;
var gameTimer;

// Data
var gamesData; // The data for all possible levels

// Currently set "level indexes" for each type [e.g. a BG can index to a different level than the current]
var bgIndex;
var fgIndex;
var getIndex;
var avoidIndex;
var getParticleIndex;
var avoidParticleIndex;

// Current set "type indexes" for each type [e.g. a BG can index to a GET]
var bgTypeStringIndex;
var fgTypeStringIndex;
var getTypeStringIndex;
var avoidTypeStringIndex;
var getParticleTypeStringIndex;
var avoidParticleTypeStringIndex;

// The complete set of levels to use
var LEVELS = [];



BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

    // create
    //
    // Guess what? This sets up the game screen and everything!

    create: function () 
    {

        this.initGameState();
        this.initLevelData();

        this.selectLevel();

        this.setupMadness();
        this.setupBG();
        this.setupUI();
        this.setupAgents();
        this.setupEmitters();
        this.setupFG();

    },


    // initGameState
    //
    // Just initializes various values to their defaults so that each
    // level starts on a clean slate.

    initGameState: function () 
    {

        // Should never see the background colour
        this.game.stage.backgroundColor = 0xFFFF00;

        // Turn off smoothing to preserve hard pixels when scaling
        // this.game.stage.smoothed = false;

        // Initialize the game state and counts and Perlin
        STATE = "INTRO";
        getCount = 0;
        avoidCount = 0;
        perlin = new ClassicalNoise();

    },


    // initLevelData
    //
    // Pulls the level information out of the JSON and initializes
    // the LEVELS array if needed, so that we have a random sorted
    // array of levels to proceed through in the game.

    initLevelData: function () 
    {

        // Don't bother if we already have a set of LEVELS
        if (LEVELS.length != 0) return;

        // Get the JSON data for all the levels
        gamesJSON = this.cache.getJSON('gamesJSON');
        gamesData = gamesJSON.data;

        // Check if this is out first time playing
        // (or we've gone through all levels!)
        // in which case the LEVELS array will be empty
        if (LEVELS.length == 0)
        {
            // Store indices of each level into the LEVELS array for lookup
            for (var i = 1; i < gamesData.length; i++)
            {
                LEVELS.push(i);
            }

            // Randomize the levels
            LEVELS.sort(function() { return 0.5 - Math.random() });

            console.log(LEVELS);
        }

    },


    // selectLevel
    //
    // If we're playing the "normal" game then this just chooses the next
    // level index to play in the game (or notices that this is the first time
    // and so chooses the 0th level).
    //
    // If we're playing the menu driven game then it just uses whatever the menu
    // selection was.

    selectLevel: function () 
    {

        // Work out what level we're going to play
        if (MODE == "SEQUENCE")
        {
            // If we're in the normal play mode then
            // if the current level isn't set, we play level 0
            if (CURRENT_LEVEL_INDEX == -1)
            {
                THIS_LEVEL = 0;
            }
            else
            {
                // Otherwise we just play the level indicated
                THIS_LEVEL = LEVELS[CURRENT_LEVEL_INDEX];
            }
        }
        else
        {
            // Otherwise we're in the menu mode and we just play
            // the level set by the player.
            THIS_LEVEL = CURRENT_LEVEL_INDEX;
        }

    },


    // setupMadness
    //
    // UNDER CONSTRUCTION

    setupMadness: function () 
    {

        // Choose which "level" to take each asset from 
        bgIndex = (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();
        fgIndex = (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();
        avoidIndex =  (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();
        getIndex =  (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();
        getParticleIndex =  (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();
        avoidParticleIndex =  (Math.random() > MADNESS) ? THIS_LEVEL : this.getRandomLevelIndex();

        imageTypeStrings = ['bg','fg','get','avoid','get_particle','avoid_particle'];

        // Choose which "image type" to take each asset from
        // I guess these could also be randomized right?
        bgTypeStringIndex = (Math.random() > MADNESS) ? BG : this.getRandomTypeIndex(bgIndex);
        fgTypeStringIndex = (Math.random() > MADNESS) ? FG : this.getRandomTypeIndex(fgIndex);
        getTypeStringIndex = (Math.random() > MADNESS) ? GET : this.getRandomTypeIndex(getIndex);
        avoidTypeStringIndex = (Math.random() > MADNESS) ? AVOID : this.getRandomTypeIndex(avoidIndex);
        getParticleTypeStringIndex = (Math.random() > MADNESS) ? GET_PARTICLE : this.getRandomTypeIndex(getParticleIndex);
        avoidParticleTypeStringIndex = (Math.random() > MADNESS) ? AVOID_PARTICLE : this.getRandomTypeIndex(avoidParticleIndex);

    },


    // setupBG
    //
    // Puts background elements in place, sets a BG colour if there's one
    // specified and otherwise adds the specified sprites.

    setupBG: function () 
    {

        bgGroup = this.add.group();

        // If there's a bgColour set then we just use that.
        if (gamesData[bgIndex].bgColour != undefined)
        {
            this.game.stage.backgroundColor = gamesData[bgIndex].bgColour;  
        }
        else
        {
            // Otherwise we'll be using a sprite

            // So add the "transparent background" sprite first
            bg_trans = bgGroup.create(0,0,'transparency_bg');

            // Then add the designated BG sprite
            bg = this.makeSprite(
                this.game.canvas.width/2,
                this.game.canvas.height/2,
                bgIndex,
                bgTypeStringIndex,
                bgGroup);

            // And scale it to fit (as it could be from anywhere)
            // bg.smoothed = false;
            bg.scale.x = (this.game.canvas.width / bg.width);
            bg.scale.y = (this.game.canvas.height / bg.height);
        }

    },


    // setupFG
    //
    // If the FG index points to a legit foreground, this adds it to the game

    setupFG: function () 
    {

        fgGroup = this.add.group();

        // If the level the FG is to be taken from has a legitimate
        // FG frame (or frames) then add it to the game, otherwise,
        // not.
        //
        // This is the only time we hard-code that an FG can only use
        // FG-specific sprites because otherwise it's too easy to
        // cover the entire game with a BG sprite for example and that's
        // not all that interesting is it?
        if (gamesData[fgIndex].frames[FG] > 0)
        {
            fg = this.makeSprite(
                this.game.canvas.width/2,
                this.game.canvas.height/2,
                fgIndex,
                FG,
                fgGroup);

            // fg.smoothed = false;
            fg.scale.x = (this.game.canvas.width / fg.width);
            fg.scale.y = (this.game.canvas.height / fg.height);
        }

        // Make it invisible until the game starts
        fgGroup.visible = false;

    },


    // setupEmitters
    //
    // Creates emitters for the gets and avoids

    setupEmitters: function () 
    {

        getEmitter = this.setupEmitter(getParticleIndex,getParticleTypeStringIndex);
        avoidEmitter = this.setupEmitter(avoidParticleIndex,avoidParticleTypeStringIndex);

    },


    // setupEmitter
    //
    // Sets up an emitter as specified by the parameters and loads the specified
    // particles into them - including multiple frames if they were
    // animated or multi-frame.
    //
    // Note we can't use makeSprite in this instance - because particles aren't
    // animated - so we have to handle it specifically

    setupEmitter: function (particleIndex,particleTypeStringIndex)
    {
        // Get the name of the current level for filenames
        theName = gamesData[particleIndex].name;

        // Add the basic emitter
        emitter = this.game.add.emitter(0, 0, 200);
        emitter.setYSpeed(-EMITTER_SPEED, EMITTER_SPEED);
        emitter.setXSpeed(-EMITTER_SPEED, EMITTER_SPEED);

        // Now collect up the names of all the frames to be used as particle types
        // by iterating on the number of frames specified for this type of particle...
        frameNames = [];
        for (var j = 1; j <= gamesData[particleIndex].frames[particleTypeStringIndex]; j++)
        {
            frameNames.push(imageTypeStrings[particleTypeStringIndex] + '_' + j + '.png')
        }

        // Handle the case in which there are no particles specified at all
        if (frameNames.length == 0) frameNames = ['default_particle.png'];

        // Now add the particles to the emitter
        emitter.makeParticles(theName,frameNames);      

        // And remove gravity
        emitter.gravity = 0;

        return emitter;

    },


    // makeSprite
    //
    // Creates a sprite according to the parameters given, which is to say that it
    // collects the relevant frames from the indices specified and turns them into
    // an appropriate sprite, including animation where specified.

    makeSprite: function (theX,theY,theGameIndex,theImageTypeIndex,theGroup,forceFrameRate) 
    {

        theName = gamesData[theGameIndex].name;

        // Create the base-level sprite out of the first image
        // NOTE : This currently assumes there is *always* a frame specified...

        theSprite = theGroup.create(0,0,theName,imageTypeStrings[theImageTypeIndex] + '_1.png');

        // console.log("theSprite = " + theName + " / " + imageTypeStrings[theImageTypeIndex] + '_1.png');

        // Now collect up the potential animation frames (may just be 1)
        // NOTE : Again this is assuming a minimum of one frame...

        frameNames = [];
        for (var j = 1; j <= gamesData[theGameIndex].frames[theImageTypeIndex]; j++)
        {
            frameNames.push(imageTypeStrings[theImageTypeIndex] + '_' + j + '.png')
        }
        frameNames.sort(function() { return 0.5 - Math.random() });

        theSprite.animations.add('anim',frameNames);

        // Now play the animation
        //
        // 1/ By forcing a 1 second framerate for the menu system - in the case of sprites
        // with multiple frames but that are not animated, so that we can show all the possible
        // elements to collect
        // or
        // 2/ By setting the framerate according to the one specified in the JSON, including 0

        if (gamesData[theGameIndex].frames[theImageTypeIndex] > 1)
        {
            if (!forceFrameRate)
            {
                theSprite.animations.play('anim',gamesData[theGameIndex].framerates[theImageTypeIndex],true);
            }
            else
            {
                theSprite.animations.play('anim',forceFrameRate,true);              
            }
        }

        // Finish up with positioning and physics.

        theSprite.anchor.x = theSprite.anchor.y = 0.5;

        this.game.physics.enable(theSprite,Phaser.Physics.ARCADE_PHYSICS);

        theSprite.x = theX;
        theSprite.y = theY;

        // And return the sprite to whoever wanted it

        return theSprite;

    },


    // setupUI
    //
    // Adds the GET and AVOID texts, adds images of what will be hunted,
    // adds the start button

    setupUI: function () 
    {

        uiGroup = this.add.group();
        // uiGroup.smoothed = false;

        // GET INDICATOR //

        // Create the text that says GET and position it centered on 1/4 of the width

        getText = new Phaser.Text(
            this.game,
            0,
            0,
            "GET",
            { font: 'bold 48px sans-serif', fill: gamesData[bgIndex].textColour }
            );
        getText.anchor.x = getText.anchor.y = 0.5;
        getText.x = this.game.canvas.width * 1/4;
        getText.y = this.game.canvas.height/3;
        uiGroup.add(getText);

        // Create the sprite that shows what you are "getting", including forcing
        // an animation speed if it is multiple frames with no animation

        if (gamesData[getIndex].frames[getTypeStringIndex] > 1 &&
            gamesData[getIndex].framerates[getTypeStringIndex] == 0)
        {
            getSprite = this.makeSprite(0,0,getIndex,getTypeStringIndex,uiGroup,2);
        }
        else
        {
            getSprite = this.makeSprite(0,0,getIndex,getTypeStringIndex,uiGroup);
        }

        // Position the sprite under the text

        getSprite.anchor.y = 0;
        getSprite.x = getText.x;
        // getSprite.y = getText.y + getText.height + getSprite.height/2;
        getSprite.y = getText.y + getText.height + 0;


        // AVOID INDICATOR //

        // Do exactly the same thing positioning the avoid text and sprite to the right
        // of the get text and sprite (positioned at 3/4 of width)

        avoidText = new Phaser.Text(
            this.game,
            0,
            0,
            "AVOID",
            { font: 'bold 48px sans-serif', fill: gamesData[bgIndex].textColour }
            );
        avoidText.anchor.x = avoidText.anchor.y = 0.5;
        avoidText.x = this.game.canvas.width * 3/4
        avoidText.y = this.game.canvas.height/3;
        uiGroup.add(avoidText);

        if (gamesData[avoidIndex].frames[avoidTypeStringIndex] > 1 && 
            gamesData[avoidIndex].framerates[avoidTypeStringIndex] == 0)
        {
            avoidSprite = this.makeSprite(0,0,avoidIndex,avoidTypeStringIndex,uiGroup,2);
        }
        else
        {
            avoidSprite = this.makeSprite(0,0,avoidIndex,avoidTypeStringIndex,uiGroup);
        }

        avoidSprite.anchor.y = 0;
        avoidSprite.x = avoidText.x;
        // avoidSprite.y = avoidText.y + avoidText.height + avoidSprite.height/2;
        avoidSprite.y = avoidText.y + avoidText.height + 0;


        // START BUTTON //

        // Create the sprite of the start button (just a black pixel)

        startBG = uiGroup.create(0,0,'black_pixel');
        startBG.anchor.x = startBG.anchor.y = 0.5;
        // startBG.smoothed = false;

        // Create the text saying START

        startText = new Phaser.Text(
            this.game,
            0,0,
            "START",
            { font: 'bold 48px sans-serif', fill: '#fff' }
            );
        uiGroup.add(startText);
        startText.anchor.x = startText.anchor.y = 0.5;
        startText.x = this.game.canvas.width/2;
        startText.y = this.game.canvas.height * 7/8;

        // Now scale the BG sprite so it fills underneath the text

        startBG.scale.x = this.game.canvas.width + 10;
        startBG.scale.y = startText.height * 1.5;
        startBG.x = startText.x;
        startBG.y = startText.y;

        // And enable the button to start the game

        startBG.inputEnabled = true;
        startBG.events.onInputDown.add(this.startTheGame,this);

    },


    // setupAgents
    //
    // Just add as many agents as specified at the top
    // Make them invisible to start with

    setupAgents: function () 
    {

        getGroup = this.add.group();
        avoidGroup = this.add.group();

        for (var i = 0; i < NUM_GET; i++)
        {
            this.addItem(getGroup,getIndex,getTypeStringIndex,'get');
        }

        for (var i = 0; i < NUM_AVOID; i++)
        {
            this.addItem(avoidGroup,avoidIndex,avoidTypeStringIndex,'avoid');
        }

        getGroup.visible = false;
        avoidGroup.visible = false;

    },


    // startTheGame
    //
    // Switch state, make things visible and invisible
    // start the timer and add the timer bar

    startTheGame: function () 
    {

        STATE = "PLAY";

        uiGroup.visible = false;

        fgGroup.visible = true;
        getGroup.visible = true;
        avoidGroup.visible = true;

        gameTimer = this.game.time.events.add(Phaser.Timer.SECOND * TIME, this.endTheGame, this);
        timerBar = this.game.add.sprite(0,0,'red_pixel');
        timerBar.scale.y = 10;

    },


    // addItem
    //
    // Makes a sprite corresponding to the parameters,
    // positions it somewhere random on the screen,
    // anchors it to 0.5, sets up its Perlin values,
    // and makes it interactive on click (pixel perfect)

    addItem: function (typeGroup,typeIndex,typeStringIndex,typeString) 
    {

        // Make the appropriate sprite

        item = this.makeSprite(0,0,typeIndex,typeStringIndex,typeGroup);

        // Choose a starting location and anchor

        item.x = Math.random() * this.game.canvas.width;
        item.y = Math.random() * this.game.canvas.height;
        item.anchor.x = item.anchor.y = 0.5;

        // Setup Perlin
        item.kind = typeString;
        item.xSeed = Math.random() * 1000;
        item.ySeed = Math.random() * 1000;
        this.game.physics.enable(item, Phaser.Physics.ARCADE);

        // Setup input
        item.inputEnabled = true;
        item.input.pixelPerfectAlpha = 1;
        item.input.pixelPerfectClick = true;
        item.events.onInputDown.add(this.tapped);

    },


    // nextGame
    //
    // Called to switch from a game over (when NEXT button is clicked)
    // just chooses the next level

    nextGame: function (b) 
    {

        // Increment LEVELS SEEN so we can increase madness
        LEVELS_SEEN++;

        // Check if we need to make the game madder
        // and do it if we do
        if (LEVELS_SEEN > MADNESS_MIN_LEVELS)
        {
            MADNESS += MADNESS_INCREMENT;
        }

        // In menu mode we just go back to the menu
        if (MODE == "MENU")
        {
            this.state.start('MainMenu');
        }
        // In sequence mode we have to choose the next level
        // including looping back around as needed, and re-randomizing
        // the levels if so
        else
        {
            CURRENT_LEVEL_INDEX = (CURRENT_LEVEL_INDEX + 1) % LEVELS.length;
            if (CURRENT_LEVEL_INDEX == 0) LEVELS.sort(function() {return 0.5 - Math.random()});

            this.state.start('Game');
        }

    },


    // update
    //
    // Really not much to do here - increase the timer bar, update the movement
    // of the agents, and check whether the game is over!

    update: function () 
    {

        if (STATE == "INTRO")
        {
        }
        else if (STATE == "PLAY")
        {
            timerBar.scale.x = this.game.canvas.width * (1-(gameTimer.timer.duration / (TIME*1000)));

            getGroup.forEach(this.updateMovement);
            avoidGroup.forEach(this.updateMovement);

            if (getGroup.getFirstAlive() == null)
            {
                this.endTheGame();
            }
        }
        else if (STATE == "GAME OVER")
        {
        }

    },


    // updateMovement
    //
    // Applies Perlin noise to the specified agent
    // wraps around the screen as needed

    updateMovement: function (item) 
    {

        // Update Perlin seeds
        item.xSeed += SEED_INCREMENT;
        item.ySeed += SEED_INCREMENT;

        // Set velocities according to Perlin
        item.body.velocity.x = MAX_VELOCITY*2*(0.5-perlin.noise(item.xSeed,0,0)*10);
        item.body.velocity.y = MAX_VELOCITY*2*(0.5-perlin.noise(0,item.ySeed,0)*10);

        // Set angle facing based on velocity (e.g. "face" the direction of movement)
        item.angle = Math.atan(item.body.velocity.y / item.body.velocity.x) * 180/Math.PI;

        // Handle screen wrap

        if (item.x > 480) item.x = 0;
        if (item.x < 0) item.x = 480;
        if (item.y > 640) item.y = 0;
        if (item.y < 0) item.y = 640;

    },


    // endTheGame
    //
    // Called when the timer runs out (or the last GET is clicked)
    // Switches visibilities and shows the menu with tallies
    // and the NEXT button

    endTheGame: function () 
    {
        STATE = "GAME OVER";

        fgGroup.visible = false;
        timerBar.visible = false;
        getGroup.visible = false;
        avoidGroup.visible = false;

        uiGroup.visible = true;

        this.game.time.events.remove(gameTimer);

        startText.text = "NEXT";
        startBG.events.onInputDown.remove(this.startTheGame,this);
        startBG.events.onInputDown.add(this.nextGame,this);

        getText.text = getCount;
        avoidText.text = avoidCount;

    },


    // quitGame
    //
    // As far as I know this is never used.

    quitGame: function (pointer) 
    {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },


    // tapped
    //
    // Called when a get or an avoid is successfully tapped
    // Updates the count, moves and triggers the appropriate emitter
    // and kills the tapped item

    tapped: function (item) 
    {

        if (STATE != "PLAY")
        {
            return;
        }

        if (item.kind == 'get')
        {
            getCount++;
            getEmitter.x = item.game.input.activePointer.x;
            getEmitter.y = item.game.input.activePointer.y;
            getEmitter.start(true, 2000, null, 10);
        }
        else if (item.kind == 'avoid')
        {
            avoidCount++;
            avoidEmitter.x = item.game.input.activePointer.x;
            avoidEmitter.y = item.game.input.activePointer.y;
            avoidEmitter.start(true, 2000, null, 10);           
        }

        item.kill();

    },


    // getRandomLevelIndex
    //
    // Just returns a random level index in the LEVELS array

    getRandomLevelIndex: function () 
    {

        return (Math.floor(Math.random() * LEVELS.length));

    },


    // getRandomTypeIndex
    //
    // Returns a random type index (for a given level), but only
    // returns one that has at least one frame (e.g. a sprite)
    // (This is why things don't blow up in makeSprite)

    getRandomTypeIndex: function (theLevel) 
    {

        index = Math.floor(Math.random() * imageTypeStrings.length);    

        while (gamesData[theLevel].frames[index] == 0)
        {
            index = Math.floor(Math.random() * imageTypeStrings.length);
        }

        return index;

    },
};


function wrapper (context) {


};
