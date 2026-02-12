export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("road", "assets/bkg.png");
    this.load.image("car", "assets/car.png");
    this.load.image("obstacle", "assets/obstacle.png");
  }

  create() {
    this.scene.start("game-scene");
  }
}
