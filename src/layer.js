import {Layer} from 'sprite-core';

const _id = Symbol('id');

class ExLayer extends Layer {
  constructor(id, options = {}) {
    if(typeof id === 'object') {
      options = id;
      id = options.id || `id_${Math.random().toString().slice(2, 10)}`;
    }
    if(!options.context) {
      if(wx.createCanvasContext) { // 小程序
        options.context = wx.createCanvasContext(id, options.componentInstance);
      } else if(wx.createCanvas) { // 小游戏
        options.context = wx.createCanvas().getContext('2d');
      }
    }
    super(options);
    this[_id] = id;
  }
  get id() {
    return this[_id];
  }
  get resolution() {
    return this.parent.resolution;
  }
  get viewport() {
    return this.parent.viewport;
  }
  toLocalPos(x, y) {
    return this.parent && this.parent.toLocalPos(x, y);
  }
  toGlobalPos(x, y) {
    return this.parent && this.parent.toGlobalPos(x, y);
  }
  drawSprites(renderEls, t) {
    const context = this.outputContext;
    context.save();
    context.scale(this.viewport[0] / this.resolution[0], this.viewport[1] / this.resolution[1]);
    super.drawSprites(renderEls, t);
    context.restore();
    if(context.draw) {
      context.draw();
    }
  }
}

export default ExLayer;
