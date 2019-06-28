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
  },
  methods: {
    updateEventOffset(handler) {
      this.getBoundingClientRect.exec(([rect]) => {
        if(rect) {
          handler([rect.left, rect.top]);
        }
      });
    },
    onTouchStart(event) {
      this.updateEventOffset((eventOffset) => {
        this.scene.delegateEvent(event, eventOffset);
      });
    },
    onTouchMove(event) {
      this.updateEventOffset((eventOffset) => {
        this.scene.delegateEvent(event, eventOffset);
      });
    },
    onTouchEnd(event) {
      this.updateEventOffset((eventOffset) => {
        this.scene.delegateEvent(event, eventOffset);
      });
    },
    onTap(event) {
      this.updateEventOffset((eventOffset) => {
        this.scene.delegateEvent(event, eventOffset);
      });
    },
    onLongPress(event) {
      this.updateEventOffset((eventOffset) => {
        this.scene.delegateEvent(event, eventOffset);
      });
    },
  },
  ready() {
    this.getBoundingClientRect = wx.createSelectorQuery().in(this)
      .select('.chart-layout').boundingClientRect();
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