/*window.onload = function () { //pardon my spaghetti code

    //TODO: clean all of this code up

    let menu = new Phaser.Scene("Menu");

    let play = new Phaser.Scene("Play");

    const config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 960,
        height: 600,
        render: {
            pixelArt: true
        },
        scene: [menu]
    }

    let game = new Phaser.Game(config);

    let current_level = 0;

    menu.preload = function () {
        this.load.json('menu', 'data/menu.json');

        this.load.image('spike', 'sprites/spikes.png');
        this.load.image('tiles', 'sprites/tilemap/tiles.png');
        this.load.image('player', 'sprites/joe.png');

        this.load.image('back0', 'sprites/back0.png');
        this.load.image('back1', 'sprites/back1.png');

        this.load.tilemapTiledJSON('map', 'sprites/tilemap/level1.json')

        this.load.bitmapFont('joefont', 'sprites/joefont.png', 'sprites/joefont.xml');
    };

    menu.create = function () {
        let _this = this;
        let level = this.cache.json.get('menu');


        this.make.image(level.background).setOrigin(0, 0);

        level.buttons.forEach(button => {
            let t = this.add.bitmapText(button.x, button.y, 'joefont', button.text).setOrigin(0.5, 0.5);
            t.action = button.action;
            t.setInteractive();
            t.on('pointerover', () => hover(t, true));
            t.on('pointerout', () => hover(t, false));
            t.on('pointerdown', () => click(t));

        });

        function hover(object, on) {
            switch (object.action) {
                case 'startgame':
                    if (on) {
                        object.fontSize = -36;
                    } else {
                        object.fontSize = -32;
                    }
                    break;
            }

            //let startBClicks = 0;
        }

        function click(object) {
            switch (object.action) {
                case 'startgame':
                    //object.setText(`Clicked ${++startBClicks} time${startBClicks == 1 ? '' : 's'}`);
                    //_this.scene.start(`level${++current_level}`);
                   // _this.scene.stop();
                    _this.scene.start('Play')
                    //startGame();
                    break;
            }
        }

        level.text.forEach(text => {
            this.add.bitmapText(text.x, text.y, 'joefont', text.text).setOrigin(0, 1);
        });

        function startGame() {
            let map = _this.make.tilemap({ key: `map` });
            let tileset = map.addTilesetImage('tiles', 'tiles');
            let platforms = map.createStaticLayer('Platforms', tileset, 0, 200)
        }
    };

    play.create = function () {
        this.make.image('back1').setOrigin(0, 0);
        let map = _this.make.tilemap({ key: `map` });
        let tileset = map.addTilesetImage('tiles', 'tiles');
        let platforms = map.createStaticLayer('Platforms', tileset, 0, 200)
    }
};
*/
// rewrite code stuffs

window.onload = function () {
    class Loader extends Phaser.Scene {
        constructor() {
            super({ key: 'loader', active: true });
        }

        preload() {
            this.load.json('menu', 'data/menu.json');

            this.load.image('spike', 'sprites/spikes.png');
            this.load.image('tiles', 'sprites/tilemap/tiles.png');
            this.load.image('player', 'sprites/joe.png');

            this.load.image('back0', 'sprites/back0.png');
            this.load.image('back1', 'sprites/back1.png');

            this.load.tilemapTiledJSON('map', 'sprites/tilemap/level1.json')

            this.load.bitmapFont('joefont', 'sprites/joefont.png', 'sprites/joefont.xml');
        }

        hover(object, on) {
            switch (object.action) {
                case 'startgame':
                    if (on) {
                        object.fontSize = -36;
                    } else {
                        object.fontSize = -32;
                    }
                    break;
            }
        }

        click(object) {
            switch (object.action) {
                case 'startgame':
                    //object.setText(`Clicked ${++startBClicks} time${startBClicks == 1 ? '' : 's'}`);
                    //_this.scene.start(`level${++current_level}`);
                    // _this.scene.stop();
                    this.scene.switch('play')
                    //startGame();
                    break;
            }
        }

        create() {
            let level = this.cache.json.get('menu');


            this.make.image(level.background).setOrigin(0, 0);

            level.buttons.forEach(button => {
                let t = this.add.bitmapText(button.x, button.y, 'joefont', button.text).setOrigin(0.5, 0.5);
                t.action = button.action;
                t.setInteractive();
                t.on('pointerover', () => this.hover(t, true));
                t.on('pointerout', () => this.hover(t, false));
                t.on('pointerdown', () => this.click(t));

            });

            level.text.forEach(text => {
                this.add.bitmapText(text.x, text.y, 'joefont', text.text).setOrigin(0, 1);
            });
        }
    }

    class Play extends Phaser.Scene {
        constructor() {
            super('play');
            this.controls = null;
        }

        create() {
            this.make.image('back1').setOrigin(0, 0);
            let map = this.make.tilemap({ key: `map` });
            let tileset = map.addTilesetImage('tiles', 'tiles');
            let platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
            platforms.scale = 1;

            let camera = this.cameras.main;

            let cursors = this.input.keyboard.createCursorKeys();
            this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
                camera,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                speed: 0.2
            });
            camera.setZoom(1).setOrigin(0, 200);
            //camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        }

        update(time, delta) {
            this.controls.update(delta);
        }
    }

    const config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 960,
        height: 600,
        render: {
            pixelArt: true
        },
        scene: [Loader, Play]
    }

    let game = new Phaser.Game(config);
}