export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("apple", "assets/apple.png");
    this.load.image("spinach", "assets/spinach.png");
    this.load.image("orange", "assets/orange.png");
    this.load.image("coconut", "assets/coconut.png");
    this.load.image("bread", "assets/bread.png");
    this.load.image("bomb", "assets/bomb.jpg");
    this.load.image("bg", "assets/bg.png");
    this.load.image("bg_flare", "assets/bg_flare.png");
    this.load.image("close", "assets/close.png");
    this.load.image("replay", "assets/replay.png");

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
  }

  create() {
    this.scene.start("game-scene");
  }
}
