/// <reference path='main.ts' />

module SkyShatter {
    export class Game {
        private projectilesIdCounter = 0;
        private screenWidth: number;
        private renderer: Renderer;

        public enemies = [];
        public player: IEntity;
        public projectiles = {};

        constructor (private canvas) {
            this.renderer = new Renderer(canvas, this);
            this.screenWidth = 320;
            this.bindEventHandlers();
            this.setupSceneGraph();
        }

        private bindEventHandlers() {
            events.on('spawnPlayerBullet', function (bullet) {
                var bulletId = this.projectilesIdCounter++;
                bullet.projectileId = bulletId;
                this.projectiles[bulletId] = bullet;
            }, this);

            events.on('destroyBullet', function (bulletId) {
                delete this.projectiles[bulletId];
            }, this);

            document.addEventListener('touchstart', (e) => {
                this.player.frame.x = e.touches[0].pageX - (this.player.frame.width / 2);
            });

            document.addEventListener('touchmove', (e) => {
                var planePosition = e.touches[0].pageX - (this.player.frame.width / 2);

                if (planePosition >= 0 &&
                    planePosition <= this.screenWidth - this.player.frame.width) {
                    this.player.frame.x = planePosition;        
                } else if (planePosition < 0) {
                    this.player.frame.x = 0;
                } else if (planePosition > this.screenWidth) {
                    this.player.frame.x = this.screenWidth - this.player.frame.width;
                }
            });
        }

        private setupSceneGraph() {
            this.player = new Entities.Plane({
                    x: 10,
                    y: 400,
                    width: 25,
                    height: 35
                },
                'red'
            );
        }

        private update() {
            this.player.update();

            utils.forEach(this.projectiles, function (projectile) {
                projectile.update();
            }, this);

            utils.forEach(this.enemies, function (enemy) {
                enemy.update();
            }, this);
        }

        public start() {            
            var tick = () => {
                this.update();
                this.renderer.draw();
                window.requestAnimationFrame(tick);
            };

            tick();
        }
    }
}
