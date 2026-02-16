import { dimensions } from "../utils/Constants.js";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("main-menu");
  }

  create() {
    this.superGroup = this.add.container();
    this.gameGroup = this.add.container();
    this.superGroup.add(this.gameGroup);

    this.bg = this.add.image(0, 0, "intro_bg");
    this.bg.setOrigin(0.5);
    this.gameGroup.add(this.bg);

    this.titleText = this.add.text(0, -200, "CROW & JAR", {
      fontSize: "80px",
      fontFamily: "Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      fontStyle: "bold",
    });
    this.titleText.setOrigin(0.5);
    this.gameGroup.add(this.titleText);

    this.playbtn = this.add.image(dimensions.gameWidth / 2, 200, "play");
    this.playbtn.setOrigin(0.5);
    this.playbtn.setDisplaySize(200, 200);
    this.gameGroup.add(this.playbtn);

    this.playbtn.setInteractive();

    this.playbtn.on("pointerup", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
    });

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start("game-scene");
      },
    );

    this.gameResized();

    const titleTargetY = dimensions.gameHeight / 2 - 150;
    const playbtnTargetY = dimensions.gameHeight / 2 + 150;

    this.titleText.y = -100;
    this.playbtn.y = dimensions.gameHeight + 200;
    this.titleText.alpha = 0;
    this.playbtn.alpha = 0;
    this.tweens.add({
      targets: this.titleText,
      y: titleTargetY,
      alpha: 1,
      duration: 1500,
      ease: "Bounce.easeOut",
    });
    this.tweens.add({
      targets: this.playbtn,
      y: playbtnTargetY,
      alpha: 1,
      duration: 1500,
      delay: 500,
      ease: "Power2",
    });

    if (!this.sound.get("bg_music")) {
      this.bg_music = this.sound.add("bg_music", { loop: true, volume: 0.5 });
      this.bg_music.play();
    } else if (!this.sound.get("bg_music").isPlaying) {
      this.sound.get("bg_music").play();
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

    this.titleText.x = dimensions.gameWidth / 2;
    this.playbtn.x = dimensions.gameWidth / 2;

    if (!this.tweens.isTweening(this.titleText)) {
      this.titleText.y = dimensions.gameHeight / 2 - 150;
    }
    if (!this.tweens.isTweening(this.playbtn)) {
      this.playbtn.y = dimensions.gameHeight / 2 + 150;
    }
  }
}
