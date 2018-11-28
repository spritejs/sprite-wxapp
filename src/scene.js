import Layer from './layer'
import Resource from './resource'
import {BaseNode} from 'sprite-core'

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

  get children() {
    return Object.values(this[_layerMap])
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

  layer(id = 'default', componentInstance = null) {
    let layer = this[_layerMap][id]
    if(!layer) {
      if(wx.createCanvasContext) {
        // 小程序
        const context = wx.createCanvasContext(id, componentInstance)
        layer = new Layer({context})
      } else if(wx.createCanvas) {
        // 小游戏
        const context = wx.createCanvas().getContext('2d')
        layer = new Layer({context})
        if(this.firstLayer) {
          // 多个 canvas，需要非主动渲染
          this.firstLayer.autoRender = false
          layer.autoRender = false
          if(this.ticker == null) {
            const ticker = () => {
              const layers = this.children
              this.firstLayer.clearContext()
              for(let i = layers.length - 1; i > 0; i--) {
                const layer = layers[i]
                layer.draw()
                this.firstLayer.outputContext.drawImage(layer.canvas, 0, 0, layer.canvas.width, layer.canvas.height)
              }
              this.firstLayer.draw(false)
              this.ticker = requestAnimationFrame(ticker)
            }
            this.ticker = requestAnimationFrame(ticker)
          }
        } else {
          this.firstLayer = layer
        }
      }
      layer.connect(this)
      this[_layerMap][id] = layer
    }
    return layer
  }
  removeLayer(id) {
    delete this[_layerMap][id]
  }
}
