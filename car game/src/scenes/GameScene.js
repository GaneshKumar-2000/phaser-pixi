export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    this.lanewidth = 540 / 3;
    // this.lanes = [this.lanewidth / 2, 540 / 2, 540 - this.lanewidth / 2];
    this.lanes = [165, 250, 335];

    this.currentLane = 1;

    this.road = this.add.tileSprite(250, 480, 500, 960, "road");
    const texture = this.textures.get("road").getSourceImage();
    // const originalWidth = texture.width;

    // const scaleNeeded = 500 / originalWidth;
    const scaleX = 500 / texture.width;
    const scaleY = 960 / texture.height;

    this.road.setTileScale(scaleX, scaleY);

    this.player = this.physics.add.sprite(
      this.lanes[this.currentLane],
      800,
      "car",
    );
    this.player.setScale(0.5);

    this.player.body.setSize(this.player.width * 0.4, this.player.height * 0.5);
    this.player.body.setOffset(
      this.player.width * 0.3,
      this.player.height * 0.2,
    );

    this.physics.add.existing(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    //move left
    this.input.keyboard.on("keydown-LEFT", () => {
      if (!this.isGameOver && this.currentLane > 0) {
        this.currentLane--;
        this.tweens.add({
          targets: this.player,
          x: this.lanes[this.currentLane],
          duration: 100,
          ease: "Power1",
        });
      }
    });

    //move right
    this.input.keyboard.on("keydown-RIGHT", () => {
      if (!this.isGameOver && this.currentLane < 2) {
        this.currentLane++;
        this.tweens.add({
          targets: this.player,
          x: this.lanes[this.currentLane],
          duration: 100,
          ease: "Power1",
        });
      }
    });

    //Obstacles
    this.obstacles = this.physics.add.group();

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.handleCollision,
      null,
      this,
    );

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: "Arial",
      fontWeight: "bold",
    });
  }

  update() {
    this.obstacles.children.iterate((obstacle) => {
      if (!obstacle || this.isGameOver) return;

      if (!obstacle.scored && obstacle.y > this.player.y) {
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        obstacle.scored = true;
      }

      obstacle.setScale(0.45);

      if (obstacle.y > 1000) {
        obstacle.destroy();
      }
    });
  }

  spawnObstacle() {
    const lane = Phaser.Math.Between(0, 2);
    const obstacle = this.physics.add.sprite(
      this.lanes[lane],
      -100,
      "obstacle",
    );

    obstacle.setScale(0.45);
    obstacle.body.setSize(obstacle.width * 0.4, obstacle.height * 0.4);

    this.obstacles.add(obstacle);
    obstacle.body.setVelocityY(400);
  }

  handleCollision(player, obstacle) {
    this.isGameOver = true;
    this.physics.pause();
    const gameOverText = this.add
      .text(250, 400, "GAME OVER", {
        fontSize: "64px",
        fill: "#ff0000",
        stroke: "#000000",
        strokeThickness: 6,
        fontFamily: "Arial",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setDepth(100);

    const restartButton = this.add
      .rectangle(250, 550, 300, 80, 0x00ff00)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100);

    const restartText = this.add
      .text(250, 550, "RESTART", {
        fontSize: "48px",
        fill: "#000000",
        fontFamily: "Arial",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setDepth(101);

    restartButton.on("pointerdown", () => {
      this.scene.restart();
    });

    restartButton.on("pointerover", () => {
      restartButton.setFillStyle(0x00cc00);
    });

    restartButton.on("pointerout", () => {
      restartButton.setFillStyle(0x00ff00);
    });
  }
}
