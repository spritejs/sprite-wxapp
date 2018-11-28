import {Sprite, utils} from 'sprite-core'
import Resource from './resource'

const attr = utils.attr

class ResAttr extends Sprite.Attr {
  constructor(subject) {
    super(subject)
    this.setDefault({
      enableCache: false,
    })
  }
  /*
    {
      src: ...,   //texture path
      srcRect: ...,  //texture clip
      rect: ....,  //texture in sprite offset
      filter: ...  //texture filters
    }
   */
  @attr
  set textures(textures) {
    if(!Array.isArray(textures)) {
      textures = [textures]
    }

    textures = textures.map((texture) => {
      if(typeof texture === 'string') {
        texture = {id: texture, src: texture}
      }

      return texture
    })

    this.loadTextures(textures)
    this.set('textures', textures)
  }

  loadTextures(textures) {
    // adaptive textures
    textures = textures.map((texture) => {
      texture = Resource.getTexture(texture)
      if(!texture.image) texture.image = texture.src
      return texture
    })
    super.loadTextures(textures)
  }
}

class ResSprite extends Sprite {
  static Attr = ResAttr
}

export default ResSprite
