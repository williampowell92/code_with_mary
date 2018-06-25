(function () {
  const Game = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    const screen = canvas.getContext('2d');
    const gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = createInvaders(this).concat(new Player(this, gameSize));

    const self = this;
    const tick = function () {
      self.update(gameSize);
      self.draw(screen, gameSize);
      requestAnimationFrame(tick);
    };

    tick();
  };

  Game.prototype = {
    update(gameSize) {
      const { bodies } = this;
      const notCollidingWithAnything = function (b1) {
        return bodies.filter(b2 => colliding(b1, b2)).length === 0;
      };

      this.bodies = this.bodies.filter(notCollidingWithAnything);

      this.bodies.forEach((body) => {
        body.update(gameSize);
      });
    },

    draw(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      this.bodies.forEach((body) => {
        drawRect(screen, body);
      });
    },

    addBody(body) {
      this.bodies.push(body);
    },

    invadersBelow(invader) {
      return this.bodies.filter(b => (
        b instanceof Invader
        && b.center.y > invader.center.y
        && b.center.x - invader.center.x < invader.size.x
      )).length > 0;
    }
  };

  const Player = function (game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y };
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    update(gameSize) {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)
    && this.center.x - this.size.x / 2 > 0) {
        this.center.x -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)
    && this.center.x + this.size.x / 2 < gameSize.x) {
        this.center.x += 2;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
        const bullet = new Bullet(
          { x: this.center.x, y: this.center.y - this.size.y / 2 - 2 },
          { x: 0, y: -6 }
        );
        this.game.addBody(bullet);
      }
    }
  };

  const Invader = function (game, center) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = center;
    this.patrolX = 0;
    this.speedX = 0.3;
  };

  Invader.prototype = {
    update() {
      if (this.patrolX < 0 || this.patrolX > 40) {
        this.speedX = -this.speedX;
      }

      this.center.x += this.speedX;
      this.patrolX += this.speedX;

      if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
        const bullet = new Bullet(
          { x: this.center.x, y: this.center.y + this.size.y / 2 + 2 },
          { x: Math.random() - 0.5, y: 2 }
        );
        this.game.addBody(bullet);
      }
    }
  };

  const Bullet = function (center, velocity) {
    this.size = { x: 3, y: 3 };
    this.center = center;
    this.velocity = velocity;
  };

  Bullet.prototype = {
    update() {
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;
    }
  };

  const drawRect = function (screen, body) {
    screen.fillRect(
      body.center.x - body.size.x / 2,
      body.center.y - body.size.y / 2,
      body.size.x,
      body.size.y
    );
  };

  const Keyboarder = function () {
    const keyState = {};

    window.onkeydown = function (e) {
      keyState[e.keyCode] = true;
    };

    window.onkeyup = function (e) {
      keyState[e.keyCode] = false;
    };

    this.isDown = function (keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
  };

  const createInvaders = function (game) {
    const invaders = [];
    for (let i = 0; i < 24; i++) {
      const x = 30 + (i % 8) * 30;
      const y = 30 + (i % 3) * 30;
      invaders.push(new Invader(game, { x, y }));
    }

    return invaders;
  };

  const colliding = function (b1, b2) {
    return !(
      b1 === b2
      || b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2
      || b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2
      || b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2
      || b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    );
  };

  window.onload = function () {
    new Game('screen');
  };
}());
