export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("crow", "assets/crow.png");
    this.load.image("jar", "assets/jar.png");
    this.load.image("stone", "assets/stone.png");
    this.load.image("intro_bg", "assets/intro_bg.png");
    this.load.image("bg", "assets/bg.png");
    this.load.image("play", "assets/play.png");
    this.load.audio("bg_music", "assets/sound/bg_music.mp3");
    this.load.audio("win", "assets/sound/win.mp3");
    this.load.audio("fail", "assets/sound/fail.wav");

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
  }

  create() {
    this.scene.start("main-menu");
  }
}
