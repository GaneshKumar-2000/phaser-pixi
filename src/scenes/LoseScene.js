export default class LoseScene extends Phaser.Scene {
  constructor() {
    super("lose-scene");
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
    const failMusic = this.sound.add("fail", { loop: false });
    failMusic.play();

    const title = this.add
      .text(0, 0, "GAME OVER", {
        fontSize: "42px",
        fontFamily: "Arial",
        color: "#ff0000",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(0, 80, "Replay", {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        failMusic.stop();
        this.scene.start("game-scene");
      });

    container.add([title, btn]);
  }
}
