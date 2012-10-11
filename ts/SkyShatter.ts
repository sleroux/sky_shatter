/// <reference path='main.ts' />

interface Event {
    touches: any[];
}

interface FrameRequestCallback {
    (time: Date): void;
}

module SkyShatter {
    export class Game {
        private projectilesIdCounter = 0;
        private enemyIdCounter = 0;
        private screenWidth: number;
        private renderer: Renderer;

        public enemies = {};
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
                bullet.ID = bulletId;
                this.projectiles[bulletId] = bullet;
            }, this);

            events.on('spawnEnemyPlane', function (enemy) {
                var enemyId = this.enemyIdCounter++;
                enemy.ID = enemyId;
                this.enemies[enemyId] = enemy;
            }, this);

            events.on('destroyBullet', function (bulletId) {
                delete this.projectiles[bulletId];
            }, this);

            events.on('destroyEnemey', function (enemyId) {
                delete this.enemies[enemyId];
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
            this.player = new Entities.Player({
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

        public spawnEnemyPlane() {
            // Between 40 and screenwidth - 40
            var spawnPointX = Math.floor(Math.random() * (this.screenWidth - 80)) + 40,
            // Spawn an enemy at a random location at the top of the field of play
                enemy = new Entities.Plane({
                        x: spawnPointX,
                        y: 20,
                        width: 25,
                        height: 35
                    },
                    'green'
                );

            enemy.yVelocity = 2;

            events.trigger('spawnEnemyPlane', [enemy]);
        }

        private collision(frame1, frame2): bool {
            // Check if these frames overlap in any way
            var left1 = frame1.x,
                left2 = frame2.x,
                right1 = frame1.x + frame1.width,
                right2 = frame2.x + frame2.width,
                top1 = frame1.y,
                top2 = frame2.y,
                bottom1 = frame1.y + frame1.height,
                bottom2 = frame2.y + frame2.height;

            if (bottom1 < top2 || top1 > bottom2 ||
                right1 < left2 || left1 > right2 ) {
                return false;
            } else {
                return true;
            }
        }

        private checkProjectileCollisionsAgainstEnemies() {
            utils.forEach(this.projectiles, function (projectile) {
                utils.forEach(this.enemies, function (enemy) {
                    // Check bounding boxes of frames of projectiles with enemies
                    if (this.collision(projectile.frame, enemy.frame)) {
                        console.log('hit');
                        events.trigger('destroyEnemey', [enemy.ID]);
                        events.trigger('destroyBullet', [projectile.ID]);
                    }
                }, this);
            }, this);
        }

        // Check if anything in the scene graph collides 
        public checkCollisions() {
            this.checkProjectileCollisionsAgainstEnemies();
        }

        public start() {            
            var tick = () => {
                this.checkProjectileCollisionsAgainstEnemies();
                this.update();
                this.renderer.draw();
                window.requestAnimationFrame(tick);
            };

            window.setInterval(this.spawnEnemyPlane.bind(this), 1000);
            tick();
        }
    }
}
