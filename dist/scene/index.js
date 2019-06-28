const {Scene} = require('../index');
const info = wx.getSystemInfoSync();

/* globals Component: true */
Component({
  properties: {
    layers: {
      type: String,
      value: 'default',
      observer(newVal) {
        this.setData({
          _layers: newVal.split(',').map(v => v.trim()),
        });
      },
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
    const scene = new Scene(this.data.width, this.data.height);
    const args = {};
    this.data._layers.forEach((layer) => {
      args[layer] = scene.layer(layer, this);
    });
    this.triggerEvent('SceneCreated', args);
    this.scene = scene;
  },
});