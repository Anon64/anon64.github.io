window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 960,
        height: 600,
        render: {
            pixelArt: true
        },
        scene: {
            preload,
            create
        }
    }

    let game = new Phaser.Game(config);

    function preload() {
        this.load.json('menu', 'data/menu.json');

        this.load.image('ground', 'sprites/ground.png');
        this.load.image('platform16x16', 'sprites/platform16x16.png');
        this.load.image('back0', 'sprites/back0.png');
        this.load.image('back1', 'sprites/back1.png');

        this.load.bitmapFont('joefont', 'sprites/joefont.png', 'sprites/joefont.xml');
    };

    function create() {
        let level = this.cache.json.get('menu');

        this.make.image(level.background);

        level.buttons.forEach(button => {
            let t = this.add.bitmapText(button.x, button.y, 'joefont', button.text).setOrigin(0.5, 0.5);
            t.action = button.action;
            t.setInteractive();
            t.on('pointerover', () => hover(t, true));
            t.on('pointerout', () => hover(t, false));
            t.on('pointerdown', () => click(t));

        });

        function hover(object, on) {
            console.log(object);
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

        let startBClicks = 0;

        function click(object) {
            switch (object.action) {
                case 'startgame':
                    object.setText(`Clicked ${++startBClicks} time${startBClicks == 1 ? '' : 's'}`);
                    break;
            }
        }
        level.text.forEach(text => {
            this.add.bitmapText(text.x, text.y, 'joefont', text.text).setOrigin(0, 1);
        })
    };
};