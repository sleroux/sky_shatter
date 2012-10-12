/// <reference path='events.ts' />

interface IFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

module Entities {
    export enum Types {
        ENEMY_PLANE,
        PLAYER_PROJECTILE,
        ENEMY_PROJECTILE
    }

    export class Entity {
        public ID: number;
        public fillStyle: string;
        public type: number;

        public draw(ctx: any): void {}
        public update(): void {}

        constructor(public frame: IFrame,) {}
    }

    export class Projectile extends Entity {

        constructor(frame: IFrame, fillStyle: string, public speed: number) {
            super(frame);

            this.fillStyle = fillStyle;
        }

        private moveProjectile() {
           // Update the y position based on the projectile's speed
           this.frame.y -= this.speed;

           if (this.frame.y <= 0) {
                if (this.type === Types.ENEMY_PROJECTILE) {
                    events.trigger('destroyEnemyBullet', [this.ID]);
                } else if (this.type === Types.PLAYER_PROJECTILE) {
                    events.trigger('destroyBullet', [this.ID]);
                }
           } 
        }

        public update() {
            this.moveProjectile();
        }

        public draw(ctx) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.frame.x,
                         this.frame.y,
                         this.frame.width,
                         this.frame.height);
        }
    }

    export class Plane extends Entity {
        public firingRates = {
            FAST: 100,
            SLOW: 400,
            NORMAL: 200
        };

        public yVelocity: number;

        public firing: bool;
        public firingRate: number;
        public firingIntervalId = null;

        constructor(frame: IFrame, fillStyle: string) {
            super(frame);
            this.fillStyle = fillStyle;

        }

        public draw(ctx) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.frame.x,
                         this.frame.y,
                         this.frame.width,
                         this.frame.height);
        }
        
        public move() {
            this.frame.y += this.yVelocity;
        }
        
        public update() {
            this.move();
        }
    }

    export class MIG extends Plane {
        private burstAmount: number;
        private burstBreak: number;
        private isDead: bool;
        private firingTimeoutId;

        constructor(public frame: IFrame, 
                    public fillStyle: string) {
            super(frame, fillStyle);

            this.firing = true;

            this.burstBreak = 2000;
            this.burstAmount = Math.floor(Math.random() * 3);

            events.on('destroyEnemy', function (enemyId) {
                if (enemyId === this.ID) {
                    this.firing = false;

                    if (this.firingIntervalId) {
                        clearInterval(this.firingIntervalId);
                    }

                    if (this.firingTimeoutId) {
                        clearTimeout(this.firingTimeoutId);
                    }
                }
            }, this);
        }

        public fire() {
            // Spawn a new projectile bullet infront of the player
            var bullet = new Projectile({
                    x: this.frame.x + (this.frame.width / 2),
                    y: this.frame.y + this.frame.height,
                    width: 3,
                    height: 9
                },
                'white',
                -5
            );

            events.trigger('spawnEnemyBullet', [bullet]);

            this.burstAmount--;

            if (this.burstAmount === 0) {
                this.firing = false;

                // After a short break, resume firing!
                this.firingTimeoutId = setTimeout(() => {
                    this.firing = true;
                    this.burstAmount = Math.floor(Math.random() * 3);
                }, this.burstBreak)
            }
        }

        public update() {
            super.move();

            if (this.firing && this.firingIntervalId === null) {


                this.fire();
                this.firingIntervalId = setInterval(this.fire.bind(this), this.firingRate || this.firingRates.NORMAL);


            } else if (!this.firing) {
                clearInterval(this.firingIntervalId);
                this.firingIntervalId = null;
            }
        }
    }

    export class Player extends Plane {

        constructor(public frame: IFrame, 
                    public fillStyle: string) {
            super(frame, fillStyle);

            this.firing = true;

            // Never move the player vertically
            this.yVelocity = 0;

            events.on('onDragControllerMove', function (xPosition) {
                this.frame.x = xPosition;
            }, this);
        }

        public fire() {
            // Spawn a new projectile bullet infront of the player
            var bullet = new Projectile({
                    x: this.frame.x + (this.frame.width / 2),
                    y: this.frame.y,
                    width: 3,
                    height: 9
                },
                'white',
                5
            );

            events.trigger('spawnPlayerBullet', [bullet]);
        }

        public update() {
            if (this.firing && this.firingIntervalId === null) {
                this.fire();
                this.firingIntervalId = setInterval(this.fire.bind(this), this.firingRate || this.firingRates.NORMAL);
            } else if (!this.firing && this.firingIntervalId !== null) {
                clearInterval(this.firingIntervalId);
                this.firingIntervalId = null;
            }
        }
    }
}
