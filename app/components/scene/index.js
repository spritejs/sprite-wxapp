const {Scene} = require('../../lib/sprite-wxapp');

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
      value: wx.getSystemInfoSync().windowHeight,
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
    const scene = new Scene(this.data.width, this.data.height);
    const args = {};
    this.data._layers.forEach((layer) => {
      args[layer] = scene.layer(layer, this);
    });
    this.triggerEvent('SceneCreated', args);
    this.scene = scene;
  },
});