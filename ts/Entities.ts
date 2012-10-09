/// <reference path='events.ts' />

module Entities {
    export class Projectile implements IEntity {
        public ID: number;
        private projectileSpeed: number;

        constructor (public frame: IFrame, 
                     public fillStyle: string, 
                     public speed: number) {
            this.ID = 1;
            this.projectileSpeed = 10;
        }

        private moveProjectile() {
           // Update the y position based on the projectile's speed
           this.frame.y -= this.projectileSpeed;

           if (this.frame.y <= 0) {
               events.trigger('destroyBullet', [this.ID]);
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

    export class Plane implements IEntity {
        private firingRates = {
            FAST: 100,
            SLOW: 400,
            NORMAL: 200
        };

        public ID: number;
        private firing: bool;
        private firingRate: number;
        private firingIntervalId = null;

        constructor (public frame: IFrame, 
                     public fillStyle: string) {

            this.firing = true;

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

        public move() {
            
        }

        public update() {
            if (this.firing && this.firingIntervalId === null) {
                this.fire();
                this.firingIntervalId = setInterval(this.fire, this.firingRate || this.firingRates.NORMAL);
            } else if (!this.firing && this.firingIntervalId !== null) {
                clearInterval(this.firingIntervalId);
                this.firingIntervalId = null;
            }
        }

        public draw(ctx) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.frame.x,
                         this.frame.y,
                         this.frame.width,
                         this.frame.height);
        }
    }
}
