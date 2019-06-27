const spritejs = require('../../lib/sprite-wxapp'); // eslint-disable-line no-unused-vars
const {Chart} = require('../../lib/q-charts');
const info = wx.getSystemInfoSync();

/* globals Component: true */
Component({
  properties: {
    chartId: {
      type: String,
      value: 'q-chart',
    },
    width: {
      type: Number,
      value: 750,
    },
    height: {
      type: Number,
      value: 750 * info.windowHeight / info.windowWidth,
    },
    eventOffset: {
      type: Array,
      value: null,
    },
  },
  methods: {
    updateEventOffset() {
      const query = wx.createSelectorQuery().in(this);
      query.select('.scene-layout').boundingClientRect().exec(([rect]) => {
        if(rect) {
          this.setData({
            eventOffset: [rect.left, rect.top],
          });
        }
      });
    },
    onTouchStart(event) {
      this.scene.delegateEvent(event, this.data.eventOffset);
    },
    onTouchMove(event) {
      this.scene.delegateEvent(event, this.data.eventOffset);
    },
    onTouchEnd(event) {
      this.scene.delegateEvent(event, this.data.eventOffset);
    },
    onTap(event) {
      this.scene.delegateEvent(event, this.data.eventOffset);
    },
    onLongPress(event) {
      this.scene.delegateEvent(event, this.data.eventOffset);
    },
  },
  ready() {
    if(!this.data.eventOffset) this.updateEventOffset();

    const chart = new Chart({
      container: '#app',
      component: this,
      layer: this.data.chartId,
      size: [this.data.width, this.data.height],
    });
    this.triggerEvent('ChartCreated', {chart});
    this.chart = chart;
    this.scene = chart.layer.parent;
  },
});
