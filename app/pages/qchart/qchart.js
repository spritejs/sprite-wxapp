// const app = getApp()
const spritejs = require('../../lib/sprite-wxapp');
// const shapes = require('../../lib/sprite-extend-shapes');
const qcharts = require('../../lib/q-charts');

// const {Scene, Sprite} = spritejs;

Page({
  data: {
    layers: ['fglayer'],
  },
  onReady() {
    console.log(qcharts);
    global.qcharts = qcharts;
    const data = [
      { label: '分类一', category: '类别一', value: 19 },
      { label: '分类二', category: '类别一', value: 74 },
      { label: '分类三', category: '类别一', value: 40 },
      { label: '分类四', category: '类别一', value: 46 },
      { label: '分类五', category: '类别一', value: 30 },
      { label: '分类六', category: '类别一', value: 62 },

      { label: '分类一', category: '类别二', value: 69 },
      { label: '分类二', category: '类别二', value: 14 },
      { label: '分类三', category: '类别二', value: 70 },
      { label: '分类四', category: '类别二', value: 26 },
      { label: '分类五', category: '类别二', value: 50 },
      { label: '分类六', category: '类别二', value: 52 }
    ]

    const { Chart, Radar, Tooltip, Legend } = qcharts
    const info = wx.getSystemInfoSync();
    const chart = new Chart({
      container: '#app',
      layer: 'fglayer',
      viewport: [info.windowWidth, info.windowHeight * 0.8],
    })
    chart.source(data, {
      row: 'category',
      value: 'value',
      text: 'label'
    })

    const radar = new Radar()

    radar.style('point', false)

    const legend = new Legend({ align: ['center', 'bottom'] })
    chart.add([radar, legend])
    chart.render()
  },
});