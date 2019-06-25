// const app = getApp()
const spritejs = require('../../lib/sprite-wxapp');

const {Scene, Sprite} = spritejs;

Page({
  data: {
    layers: ['fglayer'],
  },
  onReady() {
    const scene = new Scene();
    const width = 750,
      height = 1344;

    const layer = scene.layer('fglayer');
    console.log(layer.outputContext);
    layer.append(new Sprite({
      pos: [0, 0],
      size: [100, 100],
      bgcolor: 'red',
      fillColor: '#29AB63',
      borderRadius: 0.2,
    }));
    console.log(layer.context);
    const s = new Sprite();
    s.attr({
      anchor: 0.5,
      pos: [width / 2, height / 2],
      size: [100, 100],
      bgcolor: 'red',
    });
    layer.append(s);
  },
});