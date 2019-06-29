const {Scene} = require('../index');

/* globals Component: true */
Component({
  properties: {
    layers: {
      type: String,
      value: 'default',
      observer(newVal) {
        const salt = Math.random().toString(16).slice(2, 14);
        this.setData({
          _layers: newVal.split(',').map(v => `${v.trim()}:${salt}`),
        });
      },
    },
    pixelUnit: {
      type: String,
      value: 'rpx',
    },
  },
  methods: {
    updateEventOffset(callback) {
      this.getBoundingClientRect.exec(([rect]) => {
        if(rect) {
          callback([rect.left, rect.top]);
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
      .select('.scene-layout').boundingClientRect();
    this.getBoundingClientRect.exec(([rect]) => {
      const scene = new Scene(rect.width, rect.height, this.data.pixelUnit);
      const args = {};
      this.data._layers.forEach((layer) => {
        args[layer.replace(/:[0-9a-f]+$/ig, '')] = scene.layer(layer, this);
      });
      this.scene = scene;

      this.triggerEvent('SceneCreated', args);
    });
  },
});