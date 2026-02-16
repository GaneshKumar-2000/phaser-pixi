export default class WonScene extends Phaser.Scene {
  constructor() {
    super("won-scene");
  }

  create(data) {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    const bg = this.add.image(cx, cy, "bg").setOrigin(0.5);
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.5);

    const container = this.add.container(cx, cy);
    const designWidth = 540;
    const designHeight = 960;
    const uiScale = Math.min(width / designWidth, height / designHeight);
    container.setScale(uiScale);

    this.sound.stopAll();
    const winMusic = this.sound.add("win", { loop: false });
    winMusic.play();

    const title = this.add
      .text(0, 0, "YOU WON", {
        fontSize: "42px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(0, 80, "Main Menu", {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        winMusic.stop();
        this.scene.start("main-menu");
      });

    container.add([title, btn]);
  }
}
