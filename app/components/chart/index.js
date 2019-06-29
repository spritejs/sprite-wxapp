const spritejs = require('../../lib/sprite-wxapp'); // eslint-disable-line no-unused-vars
const {Chart} = require('../../lib/q-charts');

/* globals Component: true */
Component({
  properties: {
    chartId: {
      type: String,
      value: 'q-chart',
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

    this.getBoundingClientRect.exec(([rect]) => {
      const chart = new Chart({
        container: '#app',
        component: this,
        layer: this.data.chartId,
        size: [rect.width, rect.height],
      });
      this.chart = chart;
      this.scene = chart.layer.parent;

      this.triggerEvent('ChartCreated', {chart});
    });
  },
});