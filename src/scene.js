import Layer from './layer'
import Resource from './resource'
import BaseNode from './basenode'

const _layerMap = Symbol('layerMap')
const _rpx = Symbol('rpx')

export default class extends BaseNode {
  /* eslint-disable no-undef */
  constructor(vwr = 1) { // 默认宽度 750，即 1rpx = 1
    super()
    this[_layerMap] = {}
    if(vwr > 0) {
      this[_rpx] = wx.getSystemInfoSync().windowWidth * vwr / 750
    } else {
      this[_rpx] = 1
    }
  }
  /* eslint-enable no-undef */

  get rpx() {
    return this[_rpx]
  }

  toGlobalPos(x, y) {
    return [x * this[_rpx], y * this[_rpx]]
  }
  toLocalPos(x, y) {
    return [x / this[_rpx], y / this[_rpx]]
  }

  preload(...resources) {
    resources.forEach((res) => {
      if(Array.isArray(res)) {
        Resource.loadFrames(...res)
      } else {
        Resource.loadTexture(res)
      }
    })
  }

  layer(id = 'default') {
    let layer = this[_layerMap][id]
    if(!layer) {
      layer = new Layer(id)
      layer.parent = this
      this[_layerMap][id] = layer
    }
    return layer
  }
  removeLayer(id) {
    delete this[_layerMap][id]
  }
}
