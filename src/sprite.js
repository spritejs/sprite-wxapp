import BaseSprite from './basesprite'
import Resource from './resource'

import {attr, readonly} from './decorators'

/*
  spritjs 小程序版限制：

  - 不支持图片大小的自动识别（除非使用 frames）
  - 不支持精灵图片的 frame 旋转
  - 不支持加载远程图片
  - 不支持filter
  - 不支持texture cache
*/
class TextureAttr extends BaseSprite.Attr {
  /*
    {
      src: ...,   //texture res
      srcRect: ...,  //texture clip
      rect: ....,  //texture in sprite offset
    }
   */
  @attr
  set textures(textures) {
    if(!Array.isArray(textures)) {
      textures = [textures]
    }
    let width = 0
    let height = 0
    textures = textures.map((texture) => {
      if(typeof texture === 'string') {
        texture = {src: texture}
      }

      const res = Resource.getTexture(texture.src)
      const srcRect = res.srcRect
      if(srcRect) {
        width = Math.max(srcRect[2])
        height = Math.max(srcRect[3])
        if(!texture.srcRect) {
          texture.srcRect = srcRect
        }
      }

      const rect = texture.rect
      if(rect) {
        width = Math.max(width, rect[0] + rect[2])
        height = Math.max(height, rect[1] + rect[3])
      }

      this.set('texturesSize', [width, height])
      texture.src = res.src

      return texture
    })
    this.set('textures', textures)
  }
  get textures() {
    return this.get('textures')
  }
  @readonly
  get texturesSize() {
    return this.get('texturesSize') || [0, 0]
  }
}

export default class Sprite extends BaseSprite {
  static Attr = TextureAttr

  /**
    new Sprite({
      attr: {
        ...
      },
      attributeChangedCallback: function(prop, oldValue, newValue){

      }
    })
   */
  constructor(textures, opts = {attr: {}}, AttrModel = TextureAttr) {
    if(typeof textures === 'string') {
      textures = [textures]
    } else if(textures && !Array.isArray(textures)) {
      opts = textures
      textures = opts.textures
    }
    const attr = opts.attr
    delete opts.attr
    super(opts, AttrModel)

    if(textures) {
      this.textures = textures
    }
    if(attr) {
      this.attr(attr)
    }
  }

  set textures(textures) {
    this.attr('textures', textures)
  }
  get textures() {
    return this.attr('textures')
  }

  // override to adapt textures' size
  get contentSize() {
    let [width, height] = this.attr('size')

    const boxSize = this.attr('texturesSize')

    if(width === '') {
      width = boxSize[0] | 0
    }
    if(height === '') {
      height = boxSize[1] | 0
    }

    return [width, height]
  }

  pointCollision(evt) {
    if(super.pointCollision(evt)) {
      const textures = this.textures

      if(textures) {
        let {offsetX, offsetY} = evt
        evt.targetTextures = []

        const [anchorX, anchorY] = this.attr('anchor'),
          [width, height] = this.contentSize

        offsetX += width * anchorX
        offsetY += height * anchorY

        textures.forEach((texture) => {
          const [x, y, w, h] = texture.rect || [0, 0, ...this.innerSize]
          if(offsetX >= x && offsetX - x < w
             && offsetY >= y && offsetY - y < h) {
            // touched textures
            evt.targetTextures.push(texture)
          }
        })
      }
      return true
    }
  }

  render(t, drawingContext) {
    let context
    const textures = this.textures

    if(textures) {
      const attr = this.attr(),
        borderWidth = attr.border[0]

      context = super.render(t, drawingContext)

      textures.forEach((texture) => {
        const rect = (texture.rect || [0, 0, ...this.innerSize]).slice(0)
        const srcRect = texture.srcRect

        rect[0] += borderWidth
        rect[1] += borderWidth

        if(srcRect) {
          drawingContext.drawImage(texture.src, ...srcRect, ...rect)
        } else {
          drawingContext.drawImage(texture.src, ...rect)
        }
      })
    } else {
      context = super.render(t, drawingContext)
    }

    return context
  }
}
