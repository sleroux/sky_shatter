/// <reference path='utils.ts' />
/// <reference path='SkyShatter.ts' />

class Renderer {
    private ctx: any;

    constructor (private canvas, private game: SkyShatter.Game) {        
        this.ctx = canvas.getContext('2d');
    }

    public draw() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.game.player.draw(this.ctx);

        utils.forEach(this.game.enemies, function (enemy) {
            enemy.draw(this.ctx);
        }, this);

        utils.forEach(this.game.projectiles, function (projectile) {
            projectile.draw(this.ctx);
        }, this);
    }
}