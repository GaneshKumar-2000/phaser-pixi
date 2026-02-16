import { dimensions } from "../utils/Constants.js";
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.score = 0;
    this.targetScore = 20;
    this.lives = 3;
    this.timeLeft = 30;
    this.isGameOver = false;

    this.superGroup = this.add.container();
    this.gameGroup = this.add.container();
    this.superGroup.add(this.gameGroup);

    this.bg = this.add.sprite(0, 0, "bg");
    this.bg.setOrigin(0.5);
    this.gameGroup.add(this.bg);

    this.crow = this.add.sprite(100, 100, "crow");
    this.crow.setOrigin(0.5);
    this.crow.setScale(0.5);
    this.gameGroup.add(this.crow);

    this.crowTween = this.tweens.add({
      targets: this.crow,
      x: { from: 100, to: dimensions.gameWidth - 100 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.player = this.add.container(0, 0);
    this.player.setSize(120, 100);
    this.gameGroup.add(this.player);

    const w = 120;
    const h = 100;

    // Hitbox for collision
    this.hitbox = this.add.rectangle(0, 0, w, h, 0xffff00, 0);
    this.player.add(this.hitbox);

    // Water
    this.water = this.add.graphics();
    this.player.add(this.water);

    // Container
    this.containerGraphics = this.add.graphics();
    this.containerGraphics.lineStyle(4, 0xffffff);
    this.containerGraphics.beginPath();
    const r = 20;
    const top = -h / 2;
    const bottom = h / 2;
    const left = -w / 2;
    const right = w / 2;

    this.containerGraphics.moveTo(left, top);
    this.containerGraphics.lineTo(left, bottom - r);
    this.containerGraphics.arc(
      left + r,
      bottom - r,
      r,
      Phaser.Math.DegToRad(180),
      Phaser.Math.DegToRad(90),
      true,
    );
    this.containerGraphics.lineTo(right - r, bottom);
    this.containerGraphics.arc(
      right - r,
      bottom - r,
      r,
      Phaser.Math.DegToRad(90),
      Phaser.Math.DegToRad(0),
      true,
    );
    this.containerGraphics.lineTo(right, top);
    this.containerGraphics.strokePath();

    this.player.add(this.containerGraphics);

    this.stones = this.physics.add.group();
    this.activeStones = [];

    this.scoreText = this.add
      .text(30, 50, "Stones: 0/20", {
        fontSize: "42px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5);

    this.gameGroup.add(this.scoreText);

    this.timerText = this.add
      .text(dimensions.gameWidth - 30, 50, "Time: 30", {
        fontSize: "42px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(1, 0.5);

    this.gameGroup.add(this.timerText);

    this.input.on("pointermove", (pointer) => {
      if (this.isGameOver) return;

      let localX = (pointer.x - this.gameGroup.x) / this.gameScale;

      this.player.x = Phaser.Math.Clamp(localX, 60, dimensions.gameWidth - 60);
    });

    this.spawnEvent = this.time.addEvent({
      delay: 1000,
      callback: this.spawnStone,
      callbackScope: this,
      loop: true,
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.updateWaterLevel();

    this.gameResized();
  }

  spawnStone() {
    if (this.isGameOver) return;

    const stone = this.stones.create(this.crow.x, this.crow.y + 30, "stone");

    stone.setScale(0.2);

    stone.speedY = Phaser.Math.Between(600, 700);

    const targetX = Phaser.Math.Between(50, dimensions.gameWidth - 50);
    const targetY = dimensions.gameHeight - 100;
    const duration = (targetY - stone.y) / stone.speedY;

    stone.speedX = (targetX - stone.x) / duration;

    stone.rotationSpeed = Phaser.Math.FloatBetween(-1, 1);

    stone.isCollected = false;
    this.stones.add(stone);
    this.gameGroup.add(stone);
    this.gameGroup.moveBelow(stone, this.player);
  }

  collectStone(stone) {
    if (this.isGameOver) return;

    if (!stone.active) return;

    stone.destroy();
    this.score++;
    this.scoreText.setText("Stones: " + this.score + "/20");

    this.updateWaterLevel();

    if (this.score >= this.targetScore) {
      this.wonGame();
    }
  }

  updateWaterLevel() {
    const initialPercent = 0.1;
    const percentPerStone = 0.045;
    const currentPercent = initialPercent + this.score * percentPerStone;

    const finalPercent = Math.min(currentPercent, 1.0);

    this.water.clear();
    this.water.fillStyle(0x33ccff);

    const waterHeight = 100 * finalPercent;

    if (waterHeight > 0) {
      this.water.fillRoundedRect(-59, 50 - waterHeight, 118, waterHeight, {
        tl: 0,
        tr: 0,
        bl: 19,
        br: 19,
      });
    }
  }

  wonGame() {
    this.isGameOver = true;
    this.spawnEvent.remove();
    this.timerEvent.remove();
    this.crowTween.stop();
    this.stones.clear(true, true);

    this.tweens.add({
      targets: this.crow,
      x: this.player.x,
      y: this.player.y - 120,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(500, () => {
          this.scene.start("won-scene", { score: this.score });
        });
      },
    });
  }

  loseGame() {
    this.isGameOver = true;
    this.spawnEvent.remove();
    this.timerEvent.remove();

    this.scene.start("lose-scene", { score: this.score });
  }

  updateTimer() {
    if (this.isGameOver) return;
    this.timeLeft--;
    this.timerText.setText("Time: " + this.timeLeft);
    if (this.timeLeft <= 0) {
      this.loseGame();
    }
  }

  gameResized() {
    let ratio = 1;

    if (
      window.screen.systemXDPI !== undefined &&
      window.screen.logicalXDPI !== undefined &&
      window.screen.systemXDPI > window.screen.logicalXDPI
    )
      ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
    else if (window.devicePixelRatio !== undefined)
      ratio = window.devicePixelRatio;

    try {
      let size = dapi.getScreenSize();

      dimensions.fullWidth = size.width;
      dimensions.fullHeight = size.height;
    } catch (e) {
      dimensions.fullWidth = Math.ceil(window.innerWidth * ratio);
      dimensions.fullHeight = Math.ceil(window.innerHeight * ratio);
    }

    dimensions.actualWidth = dimensions.fullWidth;
    dimensions.actualHeight = dimensions.fullHeight;

    dimensions.ratio = ratio;

    if (
      this.game.canvas.width !== dimensions.fullWidth ||
      this.game.canvas.height !== dimensions.fullHeight
    ) {
      if (
        dimensions.isPortrait !=
        dimensions.fullWidth < dimensions.fullHeight
      ) {
        this.switchMode(!dimensions.isPortrait);
      } else {
        this.switchMode(dimensions.isPortrait);
      }

      this.game.scale.setGameSize(dimensions.fullWidth, dimensions.fullHeight);

      this.game.canvas.style.width = dimensions.fullWidth + "px";
      this.game.canvas.style.height = dimensions.fullHeight + "px";
      this.game.scale.updateBounds();
      this.game.scale.refresh();
    }

    this.setGameScale();
    this.setPositions();
  }

  switchMode(isPortrait) {
    const portrait = {
      gameWidth: 540,
      gameHeight: 960,
    };
    const landscape = {
      gameWidth: 960,
      gameHeight: 540,
    };
    dimensions.isPortrait = isPortrait;
    dimensions.isLandscape = !isPortrait;

    let mode = portrait;

    if (dimensions.isLandscape) mode = landscape;

    dimensions.gameWidth = mode.gameWidth;
    dimensions.gameHeight = mode.gameHeight;
  }

  setGameScale() {
    let scaleX = dimensions.actualWidth / dimensions.gameWidth;
    let scaleY = dimensions.actualHeight / dimensions.gameHeight;
    this.gameScale = Math.min(scaleX, scaleY);
  }

  setPositions() {
    this.superGroup.scale = this.gameScale;
    this.gameGroup.x =
      (this.game.canvas.width / this.gameScale - dimensions.gameWidth) / 2;
    this.gameGroup.y =
      (this.game.canvas.height / this.gameScale - dimensions.gameHeight) / 2;

    this.bg.setPosition(dimensions.gameWidth / 2, dimensions.gameHeight / 2);

    let scaleX = dimensions.actualWidth / this.bg.width;
    let scaleY = dimensions.actualHeight / this.bg.height;

    this.bg.setScale(Math.max(scaleX, scaleY) / this.gameScale);

    this.crow.y = 100;
    if (this.crowTween) {
      this.crowTween.updateTo("x", dimensions.gameWidth - 100);
      this.crowTween.restart();
    }
    this.player.setPosition(
      dimensions.gameWidth / 2,
      dimensions.gameHeight - 100,
    );

    this.scoreText.setPosition(30, 50);
    this.timerText.setPosition(dimensions.gameWidth - 30, 50);
  }

  update(time, delta) {
    if (this.isGameOver) return;

    const dt = delta / 1000;
    const stones = this.stones.getChildren();

    for (let i = stones.length - 1; i >= 0; i--) {
      const stone = stones[i];

      stone.y += stone.speedY * dt;
      stone.x += stone.speedX * dt;
      stone.rotation += stone.rotationSpeed * dt;

      if (
        !stone.isCollected &&
        stone.y > dimensions.gameHeight - 200 &&
        Phaser.Geom.Intersects.RectangleToRectangle(
          stone.getBounds(),
          this.hitbox.getBounds(),
        )
      ) {
        stone.isCollected = true;
        this.collectStone(stone);
      } else if (stone.y > dimensions.gameHeight + 100) {
        stone.destroy();
      }
    }
  }
}
