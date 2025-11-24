let sprite;
let sprite2;
const FRAMES = 6; // 精靈圖幀數（all 1.png）
const FRAMES2 = 16; // 精靈圖幀數（all 2.png）
const PLAY_FPS1 = 6;  // all 1.png 播放速率（幀/秒） — 基礎速度
const PLAY_FPS2 = 5;  // all 2.png 播放速率（幀/秒） — 基礎速度
let frameW, frameH;
let frameW2, frameH2;
let drawScale = 4; // 顯示放大倍率，可調

// 新增：音樂與振幅分析器
let song;
let amp; // p5.Amplitude
let isMusicOn = false;
const MUSIC_PATH = '音樂/bow-and-arrow--羽生結弦-yuzuru-hanyu-short-program-ver.mp3';

function preload() {
  sprite = loadImage('1/all 1.png');
  sprite2 = loadImage('2/all 2.png');

  // 載入音樂（需 p5.sound）
  song = loadSound(MUSIC_PATH);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);

  // 等待 preload 後可取得 sprite 的寬高
  frameW = sprite.width / FRAMES;
  frameH = sprite.height;

  frameW2 = sprite2.width / FRAMES2;
  frameH2 = sprite2.height;

  // 預設不建立 amp，按下滑鼠時建立並綁到正在播放的 song
}

function draw() {
  // 背景色（已改為 #fcd5ce）
  background('#fcd5ce');

  // 計算速度倍率：若音樂播放中，依振幅調整；否則使用 1
  let speedMultiplier = 1.0;
  if (isMusicOn && amp) {
    // 取得瞬時振幅（通常落在 0 ~ 0.3 範圍）
    let level = amp.getLevel();
    // 把振幅對應到速度倍率；調整映射範圍以符合需求
    speedMultiplier = map(level, 0, 0.25, 0.4, 1.8);
    speedMultiplier = constrain(speedMultiplier, 0.3, 2.0);
  }

  // 使用倍率計算當前要顯示的幀（第一張）
  let currentFps1 = PLAY_FPS1 * speedMultiplier;
  let playSpeed1 = currentFps1 / 60.0;
  let idx = floor((frameCount * playSpeed1) % FRAMES);
  let sx = idx * frameW;
  let sy = 0;

  // 第二張（使用同一倍率或可自訂不同映射）
  let currentFps2 = PLAY_FPS2 * speedMultiplier;
  let playSpeed2 = currentFps2 / 60.0;
  let idx2 = floor((frameCount * playSpeed2) % FRAMES2);
  let sx2 = idx2 * frameW2;
  let sy2 = 0;

  // 顯示大小
  let displayW = frameW * drawScale;
  let displayH = frameH * drawScale;
  let displayW2 = frameW2 * drawScale;
  let displayH2 = frameH2 * drawScale;

  // 在畫面中央水平排列，第一個在左、第二個在右
  let gap = 20; // 兩個動畫間距，可調
  let totalW = displayW + gap + displayW2;
  let x1 = width / 2 - totalW / 2 + displayW / 2;
  let x2 = x1 + displayW / 2 + gap + displayW2 / 2;
  let y = height / 2;

  // 繪製幀（使用 image 的 source 裁切參數）
  image(sprite, x1, y, displayW, displayH, sx, sy, frameW, frameH);
  image(sprite2, x2, y, displayW2, displayH2, sx2, sy2, frameW2, frameH2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 新增：滑鼠按下切換音樂與振幅控制
function mousePressed() {
  if (!song) return; // 若未載入音樂則忽略

  if (!isMusicOn) {
    // 開始播放並根據音量驅動速度
    if (!song.isPlaying()) {
      song.loop();
    }
    // 建立振幅分析器並輸入 song
    amp = new p5.Amplitude();
    amp.setInput(song);
    isMusicOn = true;
  } else {
    // 停止音樂並恢復預設速度
    if (song.isPlaying()) {
      song.stop();
    }
    if (amp) {
      amp.dispose && amp.dispose(); // 若有 dispose 方法則釋放
      amp = null;
    }
    isMusicOn = false;
  }
}
