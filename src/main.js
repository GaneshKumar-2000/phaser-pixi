import GameScene from "./scenes/GameScene.js";
import Preloader from "./scenes/PreLoader.js";
import MainMenu from "./scenes/MainMenu.js";
import WonScene from "./scenes/WonScene.js";
import LoseScene from "./scenes/LoseScene.js";

const ratio = window.devicePixelRatio;

const config = {
  width: 540,
  height: 960,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Preloader, MainMenu, GameScene, WonScene, LoseScene],
};

const game = new Phaser.Game(config);

// Global
game.debugMode = true;
game.embedded = false;

game.screenBaseSize = {
  width: window.innerWidth * ratio,
  height: window.innerHeight * ratio,
};

game.orientation = "portrait";
