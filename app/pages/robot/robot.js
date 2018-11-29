// const app = getApp()
const spritejs = require('../../lib/sprite-wxapp');
const {init} = require('../../lib/sprite-component');

const {Scene, Layer, Sprite, Label} = spritejs;

Page({
  data: {
    layers: ['fglayer'],
  },
  onReady() {
    const scene = new Scene();
    // console.log(scene.attributes.__attributesSet)
    init(spritejs, scene);
    // const width = 750,
    //   height = 1344

    // const layer = scene.layer('fglayer')
    // const label = new Label('Hello SpriteJS')
    // label.attr({
    //   font: '42px Arial',
    //   fillColor: '#29AB63',
    //   anchor: 0.5,
    //   pos: [width / 2, 120],
    //   border: [5, 'red'],
    //   borderRadius: 10,
    // })
    // layer.append(label)

    // const s = new Sprite()
    // s.attr({
    //   anchor: 0.5,
    //   pos: [width / 2, height / 2],
    //   size: [100, 100],
    //   bgcolor: 'red',
    // })
    // layer.append(s)
  },
});