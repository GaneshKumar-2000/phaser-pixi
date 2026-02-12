import GameScene from "./scenes/GameScene.js";
import Preloader from "./scenes/PreLoader.js";

const config = {
  width: 500,
  height: 960,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Preloader, GameScene],
};

const game = new Phaser.Game(config);

// src/
// ├── assets/                  # Images, Sounds, Fonts
// │   ├── images/
// │   └── audio/
// ├── scenes/                  # Each "Screen" is a separate file
// │   ├── Preloader.js         # Loads assets, shows loading bar
// │   ├── MainMenu.js          # Start button, High scores
// │   ├── GameScene.js         # The actual gameplay (what main.js is now)
// │   └── GameOver.js          # Restart button, Final score
// ├── objects/                 # Game Entities (Classes)
// │   ├── Player.js            # Handles movement logic
// │   └── ObstacleManager.js   # Spawning logic
// ├── utils/                   # Helper functions
// │   └── Constants.js         # Global numbers (Screen size, Speeds)
// ├── main.js                  # Entry point (bootstraps the game)
// └── index.html               # HTML container
