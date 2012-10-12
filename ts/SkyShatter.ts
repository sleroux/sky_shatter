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
        private screenHeight: number;
        private gameCtx: any;
        private hudCtx: any;
        private score: number;
        private health: number;

        public enemies = {};
        public player: Entities.Entity;
        public projectiles = {};
        public enemyProjectiles = {};

        constructor (private gameCanvas, private hudCanvas) {
            this.gameCtx = gameCanvas.getContext('2d');
            this.hudCtx = hudCanvas.getContext('2d');

            this.screenWidth = 320;
            this.screenHeight = 568;
            this.score = 0;
            this.health = 100;

            this.bindEventHandlers();
            this.setupSceneGraph();
        }

        private bindEventHandlers() {
            events.on('spawnPlayerBullet', function (bullet) {
                var bulletId = this.projectilesIdCounter++;
                bullet.ID = bulletId;
                bullet.type = Entities.Types.PLAYER_PROJECTILE;
                this.projectiles[bulletId] = bullet;
            }, this);

            events.on('spawnEnemyBullet', function (bullet) {
                var bulletId = this.projectilesIdCounter++;
                bullet.ID = bulletId;
                bullet.type = Entities.Types.ENEMY_PROJECTILE;
                this.enemyProjectiles[bulletId] = bullet;
            }, this);

            events.on('spawnEnemyPlane', function (enemy) {
                var enemyId = this.enemyIdCounter++;
                enemy.ID = enemyId;
                this.enemies[enemyId] = enemy;
            }, this);

            events.on('destroyBullet', function (bulletId) {
                delete this.projectiles[bulletId];
            }, this);

            events.on('destroyEnemyBullet', function (bulletId) {
                delete this.enemyProjectiles[bulletId];
            }, this);

            events.on('destroyEnemy', function (enemyId) {
                delete this.enemies[enemyId];
                this.score += 10;
            }, this);

            events.on('playerHit', function (entity) {
                this.health -= 10;

                if (entity.type === Entities.Types.ENEMY_PLANE) {
                    delete this.enemies[entity.ID];
                }

                if (this.health === 0) {
                    // Game over!
                }
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
                    y: 500,
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

            utils.forEach(this.enemyProjectiles, function (projectile) {
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
                enemy = new Entities.MIG({
                        x: spawnPointX,
                        y: 20,
                        width: 25,
                        height: 35
                    },
                    'green'
                );

            enemy.yVelocity = 2;
            enemy.type = Entities.Types.ENEMY_PLANE;
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
                        events.trigger('destroyEnemy', [enemy.ID]);
                        events.trigger('destroyBullet', [projectile.ID]);
                    }
                }, this);
            }, this);
        }

        private checkEnemyCollidingWithPlayer() {
            utils.forEach(this.enemies, function (enemy) {
                if (this.collision(this.player.frame, enemy.frame)) {
                    events.trigger('playerHit', [enemy]);
                }
            }, this);
        }

        private drawGame() {
            this.gameCtx.fillStyle = 'blue';
            this.gameCtx.fillRect(0, 0, this.screenWidth, this.screenHeight);

            this.player.draw(this.gameCtx);

            utils.forEach(this.enemies, function (enemy) {
                enemy.draw(this.gameCtx);
            }, this);

            utils.forEach(this.projectiles, function (projectile) {
                projectile.draw(this.gameCtx);
            }, this);

            utils.forEach(this.enemyProjectiles, function (projectile) {
                projectile.draw(this.gameCtx);
            }, this);
        }

        private drawHUD() {
            this.hudCtx.fillStyle = 'grey';
            this.hudCtx.fillRect(0, 0, this.screenWidth, 60);
            this.hudCtx.fillStyle = 'white';
            this.hudCtx.font = '20pt Arial';
            this.hudCtx.fillText('Score: ' + this.score, 10, 20);
            this.hudCtx.fillText('Health: ' + this.health, 10, 50);
        }

        // Check if anything in the scene graph collides 
        public checkCollisions() {
            this.checkProjectileCollisionsAgainstEnemies();
        }

        public start() {            
            var tick = () => {
                this.checkProjectileCollisionsAgainstEnemies();
                this.checkEnemyCollidingWithPlayer();
                this.update();
                this.drawGame();
                this.drawHUD();

                window.requestAnimationFrame(tick);
            };

            window.setInterval(this.spawnEnemyPlane.bind(this), 1000);
            tick();
        }
    }
}
