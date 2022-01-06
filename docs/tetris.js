/* eslint-env browser */
let ctx;
const W = 9;
const H = 14;
let field;
let block;
let nextBlock;
let keyEvents = [];
let interval = 40;
let count;
let score;
let timer;
const colors = ['#1F2430', '#F28779', '#73D0FF',
  '#5CCFE6', '#BAE67E', '#D4BFFF',
  '#FFCC66', '#FF3333', '#CBCCC6'];
const blocks = [
  [
    [0, 0, 1,
      1, 1, 1,
      0, 0, 0],
    [0, 1, 0,
      0, 1, 0,
      0, 1, 1],
    [0, 0, 0,
      1, 1, 1,
      1, 0, 0],
    [1, 1, 0,
      0, 1, 0,
      0, 1, 0],
  ],
  [
    [2, 0, 0,
      2, 2, 2,
      0, 0, 0],
    [0, 2, 2,
      0, 2, 0,
      0, 2, 0],
    [0, 0, 0,
      2, 2, 2,
      0, 0, 2],
    [0, 2, 0,
      0, 2, 0,
      2, 2, 0],
  ],
  [
    [0, 3, 0,
      3, 3, 3,
      0, 0, 0],
    [0, 3, 0,
      0, 3, 3,
      0, 3, 0],
    [0, 0, 0,
      3, 3, 3,
      0, 3, 0],
    [0, 3, 0,
      3, 3, 0,
      0, 3, 0],
  ],
  [
    [4, 4, 0,
      0, 4, 4,
      0, 0, 0],
    [0, 0, 4,
      0, 4, 4,
      0, 4, 0],
    [0, 0, 0,
      4, 4, 0,
      0, 4, 4],
    [0, 4, 0,
      4, 4, 0,
      4, 0, 0],
  ],
  [
    [0, 5, 5,
      5, 5, 0,
      0, 0, 0],
    [0, 5, 0,
      0, 5, 5,
      0, 0, 5],
    [0, 0, 0,
      0, 5, 5,
      5, 5, 0],
    [5, 0, 0,
      5, 5, 0,
      0, 5, 0],
  ],
  [
    [6, 6,
      6, 6],
    [6, 6,
      6, 6],
    [6, 6,
      6, 6],
    [6, 6,
      6, 6],
  ],
  [
    [0, 7, 0, 0,
      0, 7, 0, 0,
      0, 7, 0, 0,
      0, 7, 0, 0],
    [0, 0, 0, 0,
      7, 7, 7, 7,
      0, 0, 0, 0,
      0, 0, 0, 0],
    [0, 0, 7, 0,
      0, 0, 7, 0,
      0, 0, 7, 0,
      0, 0, 7, 0],
    [0, 0, 0, 0,
      0, 0, 0, 0,
      7, 7, 7, 7,
      0, 0, 0, 0],
  ],
];
const rand = r => Math.floor(Math.random() * r);
function isHit(x, y, r) {
  const data = block.type[r];
  for (let i = 0; i < block.w; i++) {
    for (let j = 0; j < block.w; j++) {
      if (i + y >= 0 && j + x >= 0
        && i + y < H && j + x < W
        && field[i + y][j + x] !== 0
        && data[i * block.w + j] !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}
function processBlockCells(func) {
  for (let i = 0; i < block.data.length; i++) {
    const x = i % block.w;
    const y = Math.floor(i / block.w);
    const v = block.data[i];
    if (y + block.y >= 0
      && y + block.y < H
      && x + block.x >= 0
      && x + block.x < W
      && v !== 0
    ) {
      func(x + block.x, y + block.y, v);
    }
  }
}
function eraseLine() {
  let erased = 0;
  for (let y = 12; y >= 0; y--) {
    if (field[y].every((v) => v !== 0)) {
      erased++;
      field.splice(y, 1);
      field.unshift(new Array(W));
      for (let i = 0; i < W; i++) {
        field[0][i] = (i === 0 || i === W - 1) ? 8 : 0;
      }
      y++;
    }
  }
  return erased;
}
function goNextBlock() {
  // eslint-disable-next-line no-use-before-define
  block = nextBlock || new Block();
  // eslint-disable-next-line no-use-before-define
  nextBlock = new Block();
}
class Block {
  constructor() {
    this.turn = rand(4);
    this.type = blocks[rand(blocks.length)];
    this.data = this.type[this.turn];
    this.w = Math.sqrt(this.data.length);
    this.x = rand(6 - this.w) + 2;
    this.y = 1 - this.w;
    this.fire = interval + count;
    this.update = () => {
      if (isHit(this.x, this.y + 1, this.turn)) {
        processBlockCells((x, y, value) => {
          field[y][x] = value;
        });
        const erased = eraseLine();
        if (erased > 0) {
          score += 2 ** erased * 8;
        }
        keyEvents = [];
        goNextBlock();
      }
      if (this.fire < count) {
        this.fire = count + interval;
        this.y++;
      }
      while (keyEvents.length > 0) {
        const code = keyEvents.shift();
        let dx = 0;
        let dy = 0;
        let nd = this.turn;
        switch (code) {
        case 32: nd = (nd + 1) % 4; break;
        case 37: dx = -1; break;
        case 39: dx = +1; break;
        case 40: dy = +1; break;
        // eslint-disable-next-line no-continue
        default: continue;
        }
        if (!isHit(this.x + dx, this.y + dy, nd)) {
          this.x += dx;
          this.y += dy;
          this.turn = nd;
          this.data = this.type[this.turn];
        }
      }
      document.getElementById('rotate').onclick = () => {
        const dx = 0; const dy = 0; let
          nd = this.turn;
        nd = (nd + 1) % 4;
        if (!isHit(this.x + dx, this.y + dy, nd)) {
          this.x += dx;
          this.y += dy;
          this.turn = nd;
          this.data = this.type[this.turn];
        }
      };
      document.getElementById('down').onclick = () => {
        const dx = 0; let dy = 0; const
          nd = this.turn;
        dy = +1;
        if (!isHit(this.x + dx, this.y + dy, nd)) {
          this.x += dx;
          this.y += dy;
          this.turn = nd;
          this.data = this.type[this.turn];
        }
      };
      document.getElementById('right').onclick = () => {
        let dx = 0; const dy = 0; const
          nd = this.turn;
        dx = +1;
        if (!isHit(this.x + dx, this.y + dy, nd)) {
          this.x += dx;
          this.y += dy;
          this.turn = nd;
          this.data = this.type[this.turn];
        }
      };
      document.getElementById('left').onclick = () => {
        let dx = 0; const dy = 0; const
          nd = this.turn;
        dx = -1;
        if (!isHit(this.x + dx, this.y + dy, nd)) {
          this.x += dx;
          this.y += dy;
          this.turn = nd;
          this.data = this.type[this.turn];
        }
      };
    };
    this.draw = tx => {
      processBlockCells((x, y, value) => {
        tx.fillStyle = colors[value];
        tx.fillRect(20 + x * 20, 20 + y * 20, 16, 16);
      });
    };
  }
}
function isGameOver() {
  let filled = 0;
  field[0].forEach((c) => {
    if (c !== 0) { filled++; }
  });
  return filled > 2;
}
function draw() {
  ctx.fillStyle = '#101521';
  ctx.fillRect(0, 0, 320, 320);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = field[y][x];
      ctx.fillStyle = colors[v];
      ctx.fillRect(20 + x * 20, 20 + y * 20, 16, 16);
    }
  }
  block.draw(ctx);
  nextBlock.data.forEach((v, i, data) => {
    const w = Math.sqrt(data.length);
    const x = i % w;
    const y = Math.floor(i / w);
    ctx.fillStyle = colors[v];
    ctx.fillRect(235 + x * 16, 160 + y * 16, 14, 14);
  });
  ctx.fillStyle = '#A6CC70';
  ctx.fillText('score:', 215, 110);
  ctx.fillText('next', 245, 140);
  ctx.fillText((`0000000${score}`).slice(-7), 255, 110);
  if (Number.isNaN(timer)) {
    ctx.fillText('GAME OVER', 212, 40);
  }
}
function mainLoop() {
  count++;
  if (count % 1000 === 0) {
    interval = Math.max(1, interval - 1);
  }
  block.update();
  if (isGameOver()) {
    clearInterval(timer);
    timer = NaN;
  }
  draw();
}
function init() {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  ctx.font = "15px 'YuMincho'";
  document.addEventListener('keydown', (e) => {
    keyEvents.push(e.keyCode);
  });
  count = 0;
  score = 0;
  field = new Array(H);
  for (let y = 0; y < H; y++) {
    field[y] = new Array(W);
    for (let x = 0; x < W; x++) {
      field[y][x] = (x === 0 || x === W - 1) ? 8 : 0;
    }
  }
  for (let i = 0; i < W; i++) {
    field[H - 1][i] = 8;
  }
  goNextBlock();
  timer = setInterval(mainLoop, 10);
}
window.addEventListener('DOMContentLoaded', init);
