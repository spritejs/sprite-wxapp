const {Sprite} = require('../../lib/sprite-wxapp');

Page({
  data: {
    width: 400,
    height: 400,
  },
  onSceneCreated({detail: layers}) {
    const {bglayer, fglayer} = layers;
    const s = new Sprite({
      size: [100, 100],
      pos: [300, 300],
      bgcolor: 'red',
    });
    fglayer.append(s);

    const s2 = new Sprite({
      size: [300, 300],
      pos: [200, 200],
      bgcolor: 'blue',
    });
    bglayer.append(s2);

    s.on('touchstart', () => {
      s.attr('bgcolor', 'green');
    });
    s.on('touchmove', () => {
      s.attr('bgcolor', 'yellow');
    });
    s.on('touchend', () => {
      s.attr('bgcolor', 'red');
    });
    s.on('longpress', () => {
      s.attr('bgcolor', 'black');
    });

    setTimeout(() => {
      this.setData({
        width: 500,
        height: 500,
      });
      console.log('resized');
    }, 2000);
  },
});