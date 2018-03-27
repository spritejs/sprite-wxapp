import {Sprite} from 'sprite-core'
import {attr} from 'sprite-utils'
import Resource from './resource'

class ResAttr extends Sprite.Attr {
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
  }

  loadTextures(textures) {
    // adaptive textures
    textures = textures.map((texture) => {
      texture = Resource.getTexture(texture)
      if(!texture.image) texture.image = texture.src
      return texture
    })
    this.set('textures', textures)
    super.loadTextures(textures)
  }
}

class ResSprite extends Sprite {
  static Attr = ResAttr
}

export default ResSprite
