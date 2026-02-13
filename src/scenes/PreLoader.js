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
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("bg", "assets/bg.png");
    this.load.image("bg_flare", "assets/bg_flare.png");
    this.load.image("close", "assets/close.png");
    this.load.image("replay", "assets/replay.png");
    this.load.image("life", "assets/life.png");
    this.load.image("intro_bg", "assets/intro_bg.png");
    this.load.image("play", "assets/play.png");
    this.load.image("title", "assets/title.png");
    this.load.image("main_menu", "assets/main_menu.png");
    this.load.audio("bg_music", "assets/sound/bg_music.mp3");
    this.load.audio("slice", "assets/sound/slice.mp3");
    this.load.audio("bomb", "assets/sound/bomb.mp3");

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
  }

  create() {
    this.scene.start("main-menu");
  }
}
