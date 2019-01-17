import {BaseNode} from 'sprite-core';
import Layer from './layer';
import Resource from './resource';

const _layerMap = Symbol('layerMap');
const _attr = Symbol('attr');

export default class extends BaseNode {
  constructor(vwr = 1) { // 默认宽度 750，即 1rpx = 1
    super();
    this[_layerMap] = {};
    this[_attr] = {};

    Object.defineProperty(this[_attr], '__attributesSet', {
      get() {
        return new Set(Object.keys(this));
      },
    });

    if(vwr > 0) {
      this[_attr].rpx = wx.getSystemInfoSync().windowWidth * vwr / 750;
    } else {
      this[_attr].rpx = 1;
    }
  }

  get attributes() {
    return this[_attr];
  }

  setAttribute(key, value) {
    if(value == null) this.removeAttribute(key);
    else this.attributes[key] = value;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  removeAttribute(key) {
    delete this.attributes[key];
  }

  get rpx() {
    return this[_attr].rpx;
  }

  get children() {
    return Object.values(this[_layerMap]);
  }

  get childNodes() {
    return this.children();
  }

  toGlobalPos(x, y) {
    return [x * this.rpx, y * this.rpx];
  }
  toLocalPos(x, y) {
    return [x / this.rpx, y / this.rpx];
  }

  preload(...resources) {
    resources.forEach((res) => {
      if(Array.isArray(res)) {
        Resource.loadFrames(...res);
      } else {
        Resource.loadTexture(res);
      }
    });
  }

  appendChild(layer) {
    const id = layer.id;
    if(this[_layerMap][id]) delete this[_layerMap][id];
    this[_layerMap][id] = layer;
  }

  insertBefore(newChild, refChild) {
    const layers = Object.entries(this[_layerMap]);
    this[_layerMap] = {};
    layers.forEach(([id, value]) => {
      if(value === refChild) {
        this[_layerMap][newChild.id] = newChild;
        this[_layerMap][refChild.id] = refChild;
      } else {
        this[_layerMap][id] = value;
      }
    });
  }

  replaceChild(newChild, oldChild) {
    const layers = Object.entries(this[_layerMap]);
    this[_layerMap] = {};
    layers.forEach(([id, value]) => {
      if(value === oldChild) {
        this[_layerMap][newChild.id] = newChild;
      } else {
        this[_layerMap][id] = value;
      }
    });
  }

  removeChild(layer) {
    return this.removeLayer(layer.id);
  }

  layer(id = 'default', componentInstance = null) {
    let layer = this[_layerMap][id];
    if(!layer) {
      layer = new Layer(id, {componentInstance});
      if(wx.createCanvas) {
        // 小游戏
        if(this.firstLayer) {
          // 多个 canvas，需要非主动渲染
          this.firstLayer.autoRender = false;
          layer.autoRender = false;
          if(this.ticker == null) {
            const ticker = () => {
              const layers = this.children;
              this.firstLayer.clearContext();
              for(let i = layers.length - 1; i > 0; i--) {
                const layer = layers[i];
                layer.draw();
                this.firstLayer.outputContext.drawImage(layer.canvas, 0, 0, layer.canvas.width, layer.canvas.height);
              }
              this.firstLayer.draw(false);
              this.ticker = requestAnimationFrame(ticker);
            };
            this.ticker = requestAnimationFrame(ticker);
          }
        } else {
          this.firstLayer = layer;
        }
      }
      layer.connect(this);
      this[_layerMap][id] = layer;
    }
    return layer;
  }
  removeLayer(id) {
    delete this[_layerMap][id];
  }
}
