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

  },
  created() {
    console.log(this.data.layers);
  },
  attached() {
    console.log(this.data.layers);
  },
});