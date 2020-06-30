window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 960,
        height: 600,
        scene: {
            preload,
            create
        }
    }

    let game = new Phaser.Game(config);

    function preload() {
        //this.game.load.image('background', 'images/background.png'); //unused
        this.load.json('level:1', 'data/level01.json');
        this.load.image('ground', 'sprites/ground.png');
        this.load.image('platform16x16', 'sprites/platform16x16.png');
    };

    //this.game.add.image(0, 0, 'background');
    function create() {
        let level = this.cache.json.get('level:1');

        this.physics.world.setBoundsCollision(true, true, true, true);

        level.platforms.forEach(platform => {
            this.make.sprite(platform);
        });
    };
};