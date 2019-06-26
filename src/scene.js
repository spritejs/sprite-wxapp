import {BaseNode} from 'sprite-core';
import Layer from './layer';
import Resource from './resource';

const _layerMap = Symbol('layerMap');
const _attr = Symbol('attr');

export default class extends BaseNode {
  constructor({resolution, viewport} = {}) {
    super();
    this[_layerMap] = {};
    this[_attr] = {};

    Object.defineProperty(this[_attr], '__attributesSet', {
      get() {
        return new Set(Object.keys(this));
      },
    });

    if(!viewport && !resolution) {
      const {windowWidth, windowHeight} = wx.getSystemInfoSync();
      viewport = [windowWidth, windowHeight];
    }
    if(!resolution) {
      resolution = [750, viewport[1] * 750 / viewport[0]];
    } else if(!viewport) {
      const {windowWidth} = wx.getSystemInfoSync();
      const rate = windowWidth / 750;
      viewport = [resolution[0] * rate, resolution[1] * rate];
    }

    this[_attr].viewport = viewport;
    this[_attr].resolution = resolution;
  }

  get attributes() {
    return this[_attr];
  }

  get viewport() {
    return this[_attr].viewport;
  }

  get resolution() {
    return this[_attr].resolution;
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

  get children() {
    return Object.values(this[_layerMap]);
  }

  get childNodes() {
    return this.children;
  }

  toGlobalPos(x, y) {
    return [x * this.viewport[0] / this.resolution[0], y * this.viewport[1] / this.resolution[1]];
  }
  toLocalPos(x, y) {
    return [x * this.resolution[0] / this.viewport[0], y * this.resolution[1] / this.viewport[1]];
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
    if(this[_layerMap][id]) {
      this.removeLayer(id);
    }
    layer.connect(this);
    this[_layerMap][id] = layer;
  }

  insertBefore(newChild, refChild) {
    if(this[_layerMap][refChild.id] === refChild) {
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
      newChild.connect(this);
    } else {
      this.appendChild(newChild);
    }
  }

  replaceChild(newChild, oldChild) {
    if(this[_layerMap][oldChild.id] === oldChild) {
      const layers = Object.entries(this[_layerMap]);
      this[_layerMap] = {};
      layers.forEach(([id, value]) => {
        if(value === oldChild) {
          this[_layerMap][newChild.id] = newChild;
        } else {
          this[_layerMap][id] = value;
        }
      });
      oldChild.disconnect(this);
      newChild.connect(this);
    }
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
    const layer = this[_layerMap][id];
    if(layer) {
      layer.disconnect(this);
      delete this[_layerMap][id];
    }
  }
}
