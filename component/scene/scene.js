const {Scene} = require('../index');

/* globals Component: true */
Component({
  properties: {
    sceneID: {
      type: String,
      value: 'scene-container',
    },
    layers: {
      type: String,
      value: 'default',
      observer(newVal) {
        this.setData({
          _layers: newVal.split(',').map(v => v.trim()),
        });
      },
    },
  },
  methods: {
    onTouchStart(event) {
      // console.log(event.changedTouches);
      this.scene.delegateEvent(event);
    },
    onTouchMove(event) {
      this.scene.delegateEvent(event);
    },
    onTouchEnd(event) {
      this.scene.delegateEvent(event);
    },
    onTap(event) {
      this.scene.delegateEvent(event);
    },
  },
  attached() {
    const scene = new Scene();
    const args = {};
    this.data._layers.forEach((layer) => {
      args[layer] = scene.layer(layer, this);
    });
    this.triggerEvent('SceneCreated', args);
    this.scene = scene;
  },
});