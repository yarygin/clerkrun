var options = {
    gameWidth: 400,
    gameHeight: 490
};
var game = new Phaser.Game(options.gameWidth, options.gameHeight, Phaser.AUTO, 'gameDiv');
var mainState = { 
    preload: function preload(){
        game.stage.backgroundColor = '#87cefa';
        // game.load.image("background", "assets/background.png");
        game.load.spritesheet('player', 'assets/player_walk.png', 36, 64, 4);
        // game.load.image('block', 'assets/pipe.png');
        game.load.image('ground', 'assets/grass.png');
        game.load.image('bush', 'assets/bush.png');
        game.load.image('fatsheep', 'assets/fatsheep.png');
        game.load.image('smallsheep', 'assets/smallsheep.png');
        game.load.image('oldman', 'assets/oldman.png');
        game.load.image('dog', 'assets/dog44x32.png');
    },
    create: function create(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.backgroundInit();
        // this.platforms = game.add.group();
        // this.platforms.enableBody = true;

        // this.platforms.create(0, game.world.height-50, 'block').body.immovable = true;
        // this.platforms.create(100, game.world.height-150, 'block').body.immovable = true;

        this.player = new this.player(game.add.sprite(30, 500, 'player'));

        // this.cursors = game.input.keyboard.createCursorKeys();
    },
    player: function(sprite){
        var player = sprite;
        var walk = player.animations.add('walk');
        var that = this;
        player.init = function(){
            game.physics.arcade.enable(this);
            this.body.bounce.y = 0.2;
            this.body.gravity.y = 300;
            this.body.collideWorldBounds = true;
            this.anchor.setTo(.5, 1);
            this.stands = false;
            this.jumpCounter = 0;
            this.animations.play('walk', 6, true);
            this.scale.x = -1;
            // game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.walkRight, this);
            // game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.walkLeft, this);
            game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.jump, this);
            // game.input.keyboard.addCallbacks(this,function(){}, function(){player.stop();});
            return this;
        };
        player.walkRight = function(){
            this.animations.play('walk', 6, true);
            this.body.velocity.x = 100;
            this.scale.x = -1;
        };
        player.walkLeft = function(){
            this.animations.play('walk', 6, true);
            this.body.velocity.x = -100;
            this.scale.x = 1;
        };
        player.jump = function(){
            if(this.isStands() || this.jumpCounter < 2){
                this.body.velocity.y = this.body.velocity.y-150;
                this.jumpCounter ++ ;
                this.setStands(false);
            }
        };
        player.stop = function(){
            if(this.isStands()) {
                this.body.velocity.x = 0;
                if(this.body.velocity.x == 0 && !(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || 
                                                  this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || 
                                                  this.game.input.keyboard.isDown(Phaser.Keyboard.UP))) {
                    this.animations.stop(0,true);
                }
            }
        };
        player.isStands = function(){
            if(this.stands || this.body.onFloor()){
                this.jumpCounter = 0;
                return true;
            }
            return false;
        };
        player.setStands = function(value){
            this.stands = value;
        };
        return player.init();
    },
    update: function update(){
        // this.background.tilePosition.x -= this.player.body.velocity.x / 90;
        game.physics.arcade.overlap(this.smallsheep, this.player, function(){
            this.player.angle = 90;
            this.player.anchor.setTo(1, 0.5);
            this.player.animations.stop(0, true);
            this.player.alive = false;
        }, null, this);
        if(this.player.alive) {
            if(game.input.activePointer.isDown) this.player.jump();
            this.ground.tilePosition.x -= 1;
            if(!this.bush.inWorld && this.bush.body.x < 0) {
                this.bush.body.x = game.world.width+this.bush.width;
            }
            if(!this.fatsheep.inWorld && this.fatsheep.body.x < 0) {
                this.fatsheep.body.x = game.world.width+this.fatsheep.width;
            }
            if(!this.smallsheep.inWorld && this.smallsheep.body.x < 0) {
                this.smallsheep.body.x = game.world.width+this.smallsheep.width;
            }
        }
    },
    backgroundInit: function(){
        // this.background = game.add.tileSprite(0, 0, 1000, 600, 'background');
        this.bush = game.add.tileSprite(256, game.world.height-64, 64, 64, 'bush');
        game.physics.arcade.enable(this.bush);
        this.bush.body.velocity.x = -100;
        this.ground = game.add.tileSprite(0, game.world.height-32, game.world.width+64, 64, 'ground');

        this.fatsheep = game.add.tileSprite(128, game.world.height-64, 64, 64, 'fatsheep');
        game.physics.arcade.enable(this.fatsheep);
        this.fatsheep.body.velocity.x = -100;

        this.oldman = game.add.tileSprite(232, game.world.height-64, 64, 64, 'oldman');
        game.physics.arcade.enable(this.oldman);
        this.oldman.body.velocity.x = -100;

        this.dog = game.add.tileSprite(280, game.world.height-32, 44, 32, 'dog');
        game.physics.arcade.enable(this.dog);
        this.dog.body.velocity.x = -100;

        this.smallsheep = game.add.tileSprite(382, game.world.height-32, 32, 32, 'smallsheep');
        game.physics.arcade.enable(this.smallsheep);
        this.smallsheep.body.velocity.x = -100;
    }
};

game.state.add('main', mainState);  
game.state.start('main');  