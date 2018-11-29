// index.js
// 获取应用实例
const app = getApp();
const spritejs = require('../../lib/sprite-wxapp');
const {Scene, Layer, Sprite, Label, Path} = spritejs;

class WaterDrop extends Sprite {
  constructor(pos) {
    super();
    this.attr({
      anchor: [0.5, 0.5],
      pos,
    });
    this.n = 0;
  }
  set n(val) {
    this._n = val;
    if(val > 0) {
      this.textures = [`bubble${val}.png`];
      // this.forceUpdate()
    } else {
      this.textures = [];
    }
  }
  get n() {
    return this._n;
  }
}

Page({
  data: {
    bonus: 0,
    layers: ['fglayer'],
    drops: 10, // 剩余水滴数量
    score: 0, // 分数
    initDrops: 80, // 初始化在面板上的水滴
    handleEvent: true,
    dropBoard: [[], [], [], [], [], [], []],
    shooters: 0, // 正在移动的水滴数量
    canPlayAudio: true, // 避免声音播放太频繁
  },
  onTouchStart(event) {
    if(!this.data.handleEvent || this.data.shooters) return;
    const {x, y} = event.touches[0];
    const [layerX, layerY] = this.scene.toLocalPos(x, y);
    // console.log(layerX, layerY)
    this.scene.layer('fglayer').dispatchEvent('touchstart', {originEvent: event, layerX, layerY});
  },
  noop() {

  },
  onReady() {
    const explodeAudio = wx.createInnerAudioContext();
    explodeAudio.src = 'https://s4.ssl.qhres.com/static/c63abb58a484b813.mp3';
    const growAudio = wx.createInnerAudioContext();
    growAudio.src = 'https://s2.ssl.qhres.com/static/48865af85f84976f.mp3';

    const scene = new Scene();
    this.scene = scene;
    const width = 750,
      height = 1344;

    scene.preload(
      ['../../assets/img/water.png',
        require('../../assets/img/water.json.js')],
      ['../../assets/img/birds.png',
        require('../../assets/img/birds.json.js')]
    );

    const layer = scene.layer('fglayer');

    const board = new Sprite();
    board.attr({
      anchor: [0.5, 0.5],
      pos: [width / 2, height / 2 - 20],
      textures: [{id: 'water_board.png'}],
    });
    layer.append(board);
    this.board = board;

    const score = String(this.data.score).padStart(6, '0');
    const labelScore = new Label(`分数：${score}`);
    labelScore.attr({
      pos: [60, 80],
      font: '36px Arial',
    });
    layer.append(labelScore);
    this.labelScore = labelScore;
    // this.addScore(1000)

    const dropCountPos = [width - 150, 120];
    const dropBubble = new Sprite('big_bubble.png');
    dropBubble.attr({
      anchor: [0.5, 0.5],
      pos: dropCountPos,
    });
    layer.append(dropBubble);

    const dropCount = new Label(this.data.drops);
    dropCount.attr({
      anchor: [0.5, 0.5],
      pos: dropCountPos,
      font: '48px Arial',
    });
    layer.append(dropCount);
    this.dropCount = dropCount;
    this.dropCountPos = dropCountPos;
    // this.updateDrops(3)

    for(let row = 0; row < 7; row++) {
      for(let col = 0; col < 6; col++) {
        const wd = new WaterDrop(this.getPos(row, col));
        this.data.dropBoard[row][col] = wd;
        layer.appendChild(wd);
      }
    }

    board.on('touchstart', (evt) => {
      const [left, top, width, height] = board.renderRect;
      const [x, y] = [evt.offsetX + width / 2, evt.offsetY + height / 2];
      // console.log(x, y)
      const i = Math.floor((x - 45) / 105),
        j = Math.floor((y - 65) / 110);

      // console.log(i, j)
      if(i >= 0 && i < 6 && j >= 0 && j < 7) {
        const drop = this.data.drops;
        if(drop > 0) {
          this.updateDrops(drop - 1);
          this.data.bonus = 0;
          const currentDrop = this.data.dropBoard[j][i];
          if(currentDrop.n === 3) {
            explodeAudio.play();
          } else {
            growAudio.play();
          }
          this.hit(j, i);
        }
      }
    });
    this.initDrops(true).then((dropBoard) => {
      console.log(dropBoard);
    });
    // //console.log(this.data.dropBoard)
  },
  getPos(row, col) {
    const board = this.board;
    const [x, y] = [col * 105 + 75, row * 110 + 75];
    const [left, top] = board.renderRect;
    return [left + 45 + x, top + 60 + y];
  },
  hit(row, col) {
    const shooters = this.data.shooters;

    if(row > 6 || row < 0 || col > 5 || col < 0) {
      if(shooters === 0) {
        const drops = this.getRestDrops();
        if(drops === 0) {
          this.updateDrops(this.data.drops + 3);
          this.data.initDrops = Math.max(this.data.initDrops - 5, 35);
          this.initDrops();
        }
      }
      return;
    }

    const dropBoard = this.data.dropBoard;
    const drop = dropBoard[row][col];
    // console.log(drop)
    if(drop.n < 3) {
      if(shooters === 0) {
        const drops = this.getRestDrops();
        if(drops === 0) {
          this.updateDrops(this.data.drops + 3);
          this.data.initDrops = Math.max(this.data.initDrops - 5, 35);
          this.initDrops();
        }
      }
      drop.n++;
    } else {
      drop.n = 0;
      this.addScore(10 + this.data.bonus * 5);
      this.shoot(row, col);
      this.data.bonus++;
      if(this.data.bonus % 9 === 0) {
        this.updateDrops(this.data.drops + 1);
      }
    }
  },
  moveTo(s, from, to) {
    const [x0, y0] = this.getPos(...from);
    let [x, y] = this.getPos(...to);
    if(x < x0) x += 69;
    if(x > x0) x -= 69;
    if(y < y0) y += 69;
    if(y > y0) y -= 69;
    return s.animate([
      {pos: [x0, y0]},
      {pos: [x, y]},
    ], {
      duration: 100 * Math.max(
        Math.abs(from[0] - to[0])
        , Math.abs(from[1] - to[1])
      ),
      fill: 'forwards',
    }).finished;
  },
  shootDown(shooter, row, col) {
    const dropBoard = this.data.dropBoard;
    let i;
    for(i = row; i < 7; i++) {
      const drop = dropBoard[i][col];
      if(drop.n > 0) {
        break;
      }
    }
    this.moveTo(shooter, [row, col], [i, col])
      .then(() => {
        const drop = i < 7 ? dropBoard[i][col] : null;
        if(!drop || drop.n > 0) {
          shooter.remove();
          this.data.shooters--;
          this.hit(i, col);
        } else {
          this.shootDown(shooter, i, col);
        }
      });
  },
  shootUp(shooter, row, col) {
    const dropBoard = this.data.dropBoard;
    let i;
    for(i = row; i >= 0; i--) {
      const drop = dropBoard[i][col];
      if(drop.n > 0) {
        break;
      }
    }
    this.moveTo(shooter, [row, col], [i, col])
      .then(() => {
        const drop = i >= 0 ? dropBoard[i][col] : null;
        if(!drop || drop.n > 0) {
          shooter.remove();
          this.data.shooters--;
          this.hit(i, col);
        } else {
          this.shootUp(shooter, i, col);
        }
      });
  },
  shootRight(shooter, row, col) {
    const dropBoard = this.data.dropBoard;
    let i;
    for(i = col; i < 6; i++) {
      const drop = dropBoard[row][i];
      if(drop.n > 0) {
        break;
      }
    }
    this.moveTo(shooter, [row, col], [row, i])
      .then(() => {
        const drop = dropBoard[row][i];
        if(!drop || drop.n > 0) {
          shooter.remove();
          this.data.shooters--;
          this.hit(row, i);
        } else {
          this.shootRight(shooter, row, i);
        }
      });
  },
  shootLeft(shooter, row, col) {
    const dropBoard = this.data.dropBoard;
    let i;
    for(i = col; i >= 0; i--) {
      const drop = dropBoard[row][i];
      if(drop.n > 0) {
        break;
      }
    }
    this.moveTo(shooter, [row, col], [row, i])
      .then(() => {
        const drop = dropBoard[row][i];
        if(!drop || drop.n > 0) {
          shooter.remove();
          this.data.shooters--;
          this.hit(row, i);
        } else {
          this.shootLeft(shooter, row, i);
        }
      });
  },
  shoot(row, col) {
    this.data.shooters += 4;

    const dropBoard = this.data.dropBoard;
    const pos = this.getPos(row, col);
    const layer = this.scene.layer('fglayer');
    const s1 = new Sprite('drop.png');
    s1.attr({
      anchor: [0.5, 1],
      pos,
    });
    const s2 = new Sprite('drop.png');
    s2.attr({
      anchor: [0.5, 1],
      pos,
      rotate: 90,
    });
    const s3 = new Sprite('drop.png');
    s3.attr({
      anchor: [0.5, 1],
      pos,
      rotate: 180,
    });
    const s4 = new Sprite('drop.png');
    s4.attr({
      anchor: [0.5, 1],
      pos,
      rotate: 270,
    });
    layer.append(s1, s2, s3, s4);

    // down
    this.shootDown(s3, row, col);

    // up
    this.shootUp(s1, row, col);

    // right
    this.shootRight(s2, row, col);

    // left
    this.shootLeft(s4, row, col);
  },
  getRestDrops() {
    const board = this.data.dropBoard;
    let count = 0;
    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
        count += board[i][j].n;
      }
    }
    return count;
  },
  initDrops(reset = false) {
    if(reset) {
      this.updateDrops(10);
      this.data.score = 0;
      this.addScore(0);
    }
    // this.playAudio('https://s4.ssl.qhres.com/static/ccbe73ef11db3986.mp3')
    this.data.handleEvent = false;
    // 初始化水滴
    let dropCount = this.data.initDrops;
    let size = 42;
    const drops = Array.from({length: size}).fill(0);
    const scene = this.scene,
      layer = this.scene.layer('fglayer'),
      Sprite = spritejs.Sprite;

    while(dropCount > 0) {
      dropCount--;
      const idx = Math.floor(size * Math.random());
      drops[idx]++;
      if(drops[idx] === 3) {
        [drops[size - 1], drops[idx]] = [drops[idx], drops[size - 1]];
        size--;
      }
    }
    const dropBoard = this.data.dropBoard;
    let added = 0,
      k = 0;
    return new Promise((resolve) => {
      for(let i = drops.length - 1; i >= 0; i--) {
        const idx = Math.floor(i * Math.random());
        if(idx !== i) { [drops[idx], drops[i]] = [drops[i], drops[idx]] }

        const n = drops[i];

        const row = Math.floor(i / 6),
          col = i % 6;

        const waterDrop = dropBoard[row][col];

        if(n > 0) {
          setTimeout(() => {
            added += n;

            waterDrop.n = n;

            if(added === this.data.initDrops) {
              this.data.handleEvent = true;
              resolve(dropBoard);
            }
          }, 50 * k++);
        }
      }
    });
  },
  updateDrops(drops) {
    this.dropCount.attr({
      pos: this.dropCountPos,
      text: drops,
      color: drops > 3 ? '#000' : '#f00',
    });
    this.data.drops = drops;
  },
  addScore(score) {
    this.data.score += score;
    const scoreStr = String(this.data.score).padStart(6, '0');
    this.labelScore.text = `分数：${scoreStr}`;
  },
});
