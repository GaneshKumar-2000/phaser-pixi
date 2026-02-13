import { dimensions } from "../utils/Constants.js";
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.score = 0;
    this.lives = 3;
    this.timeLeft = 30;
    this.gameOver = false;

    this.superGroup = this.add.container();
    this.gameGroup = this.add.container();
    this.superGroup.add(this.gameGroup);

    this.bg = this.add.sprite(0, 0, "bg");
    this.bg.setOrigin(0.5);
    this.gameGroup.add(this.bg);

    this.bgFlare = this.add.sprite(0, 0, "bg_flare");
    this.bgFlare.setOrigin(0.5);
    this.gameGroup.add(this.bgFlare);

    this.fruitGroup = this.physics.add.group();

    this.spawnTimer = this.time.addEvent({
      delay: 800,
      callback: this.spawnFruit,
      callbackScope: this,
      loop: true,
    });

    this.gameResized();
    this.createHUD();
  }

  spawnFruit() {
    const fruits = ["apple", "spinach", "orange", "bomb"];

    const texture = Phaser.Utils.Array.GetRandom(fruits);

    const startX = Phaser.Math.Between(50, dimensions.gameWidth - 50);
    const startY = dimensions.gameHeight + 50;

    const fruit = this.fruitGroup.create(startX, startY, texture);

    fruit.setInteractive();

    fruit.on("pointerdown", () => {
      this.hitObject(fruit, texture);
    });

    const velocityY = Phaser.Math.Between(-600, -1000);
    const velocityX = Phaser.Math.Between(-200, 200);
    fruit.setVelocity(velocityX, velocityY);

    fruit.setGravityY(1000);

    this.gameGroup.add(fruit);
  }

  hitObject(fruit, texture) {
    if (this.gameOver) return;
    fruit.disableInteractive();

    if (texture == "bomb") {
      this.lives--;
      const hearts = this.lifegroup.getChildren();
      const heartToRemove = hearts[this.lives];

      if (heartToRemove) {
        heartToRemove.destroy();
      }
      fruit.destroy();

      if (this.lives <= 0) {
        this.handleGameOver(false);
      }

      this.sound.play("bomb");
    } else {
      fruit.destroy();
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
    }

    this.sound.play("slice");
  }

  handleGameOver(victory) {
    this.gameOver = true;
    this.timeEvent.remove();
    this.spawnTimer.remove();

    this.fruitGroup.children.iterate((child) => {
      if (child) {
        child.setVelocity(0, 0);
        child.body.allowGravity = false;
        child.disableInteractive();
      }
    });

    const resultsContainer = this.add.container();
    this.gameGroup.add(resultsContainer);

    const overlay = this.add.rectangle(
      dimensions.gameWidth / 2,
      dimensions.gameHeight / 2,
      dimensions.gameWidth,
      dimensions.gameHeight,
      0x000000,
      0.7,
    );

    resultsContainer.add(overlay);

    const Text = victory ? "You WON!" : "Game Over";

    const resultText = this.add.text(
      dimensions.gameWidth / 2,
      dimensions.gameHeight / 2 - 100,
      Text,
      {
        font: "64px Arial",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
        align: "center",
      },
    );

    resultText.setOrigin(0.5);
    resultsContainer.add(resultText);

    const style = {
      font: "32px Arial",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    };

    this.scoreText = this.add.text(
      dimensions.gameWidth / 2,
      dimensions.gameHeight / 2 - 50,
      `${this.score > 0 ? "Score: " + this.score : "At what cost 😂. Try to get a score."}`,
      style,
    );

    this.scoreText.setOrigin(0.5);
    resultsContainer.add(this.scoreText);

    const replayButton = this.add.sprite(
      dimensions.gameWidth / 2,
      dimensions.gameHeight / 2 + 50,
      "replay",
    );

    const mainMenuButton = this.add.sprite(
      dimensions.gameWidth / 2,
      dimensions.gameHeight / 2 + 50,
      "main_menu",
    );

    replayButton.setInteractive();
    mainMenuButton.setInteractive();

    if (victory) {
      resultsContainer.add(mainMenuButton);
      replayButton.destroy();
    } else {
      resultsContainer.add(replayButton);
      mainMenuButton.destroy();
      this.scoreText.destroy();
    }

    replayButton.on("pointerup", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.restart();
        },
      );
    });

    mainMenuButton.on("pointerup", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("main-menu");
        },
      );
    });

    resultsContainer.setScale(0);

    this.tweens.add({
      targets: resultsContainer,
      scale: 1,
      duration: 500,
      ease: "Back.easeOut",
    });
  }

  gameOver() {
    this.scene.restart();
  }

  createHUD() {
    const style = {
      font: "32px Arial",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    };

    const timerStyle = {
      font: "80px Arial",
      fill: "#ffcc00",
      stroke: "#000000",
      strokeThickness: 6,
      fontStyle: "bold",
    };

    //Score
    this.scoreText = this.add.text(20, 20, "Score: " + this.score, style);

    //Lives
    this.lifegroup = this.add.group();
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(
        dimensions.gameWidth - 50 - i * 40,
        40,
        "life",
      );
      heart.setDisplaySize(30, 30);
      this.lifegroup.add(heart);
      this.gameGroup.add(heart);
    }

    //Timer
    this.timeText = this.add.text(
      dimensions.gameWidth / 2,
      0,
      this.timeLeft,
      timerStyle,
    );
    this.timeText.setOrigin(0.5, 0);

    this.gameGroup.add(this.scoreText);
    // this.gameGroup.add(this.lifegroup);
    this.gameGroup.add(this.timeText);

    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  updateTimer() {
    if (this.gameOver) return;

    this.timeLeft--;
    this.timeText.setText(this.timeLeft);

    if (this.timeLeft <= 0) {
      this.handleGameOver(true);
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

    this.bg.setScale(1);

    let scaleX = dimensions.actualWidth / this.bg.displayWidth;
    let scaleY = dimensions.actualHeight / this.bg.displayHeight;

    let scale = Math.max(scaleX, scaleY);

    this.bg.setScale(scale);

    this.bg.x = dimensions.gameWidth / 2;
    this.bg.y = dimensions.gameHeight / 2;

    this.bgFlare.x = dimensions.gameWidth / 2;
    this.bgFlare.y = dimensions.gameHeight / 2;
  }

  update() {
    this.fruitGroup.children.iterate((fruit) => {
      if (fruit && fruit.y > dimensions.gameHeight + 100) {
        this.fruitGroup.killAndHide(fruit);
        this.fruitGroup.remove(fruit);
      }
    });
  }
}
