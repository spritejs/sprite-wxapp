import {BaseNode} from 'sprite-core';
import Layer from './layer';
import Resource from './resource';

const _layerMap = Symbol('layerMap');
const _attr = Symbol('attr');

export default class extends BaseNode {
  constructor(width, height) {
    super();
    this[_layerMap] = {};
    this[_attr] = {};

    Object.defineProperty(this[_attr], '__attributesSet', {
      get() {
        return new Set(Object.keys(this));
      },
    });

    const {windowWidth, windowHeight} = wx.getSystemInfoSync();
    const ratio = 750 / windowWidth;

    if(width == null) width = 750;
    if(height == null) height = windowHeight * ratio;

    this[_attr].viewport = [width / ratio, height / ratio];
    this[_attr].resolution = [width, height];
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

  delegateEvent(event, [offsetLeft, offsetTop] = [0, 0]) {
    const type = event.type;
    const pointers = event.changedTouches;
    const originalCoordinates = [];
    for(let i = 0; i < pointers.length; i++) {
      const pointer = pointers[i];
      const identifier = pointer.identifier;
      const {clientX, clientY} = pointer;
      originalCoordinates.push({
        x: Math.round((clientX | 0) - offsetLeft),
        y: Math.round((clientY | 0) - offsetTop),
        identifier,
      });
    }

    const layers = this.children;
    originalCoordinates.forEach((originalCoordinate) => {
      for(let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if(layer.handleEvent !== false) {
          const [x, y] = layer.toLocalPos(originalCoordinate.x, originalCoordinate.y);
          let evt = Object.assign({}, {
            originalEvent: event,
            type,
            layerX: x,
            layerY: y,
            originalX: originalCoordinate.x,
            originalY: originalCoordinate.y,
            x,
            y,
            identifier: originalCoordinate.identifier,
          });
          layer.dispatchEvent(type, evt);
          let secondType;
          if(i === 0 && type === 'tap') secondType = 'click';
          if(i === 0 && type === 'touchstart') secondType = 'mousedown';
          if(i === 0 && type === 'touchmove') secondType = 'mousemove';
          if(i === 0 && type === 'touchend') secondType = 'mouseup';
          if(secondType) {
            evt = Object.assign({}, evt);
            evt.type = secondType;
            layer.dispatchEvent(secondType, evt);
          }
        }
      }
    });
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
