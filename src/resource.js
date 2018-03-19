const loadedResources = new Map()

const Resource = {
  // {id, src, [srcRect]}
  loadTexture(texture) {
    if(typeof texture === 'string') {
      texture = {id: texture, src: texture}
    }
    loadedResources.set(texture.id, texture)
    return texture
  },
  loadFrames(imgSrc, frameData) {
    return Object.entries(frameData.frames).map(([id, frame]) => {
      const {x, y, w, h} = frame.frame
      const rotated = frame.rotated
      if(rotated) throw new Error('目前不支持被旋转的精灵图片！')

      const texture = {id, src: imgSrc, srcRect: [x, y, w, h]}
      loadedResources.set(texture.id, texture)
      return texture
    })
  },
  getTexture(src) {
    let texture = loadedResources.get(src)
    if(!texture) {
      texture = this.loadTexture(src)
    }
    return texture
  },
}

export default Resource
