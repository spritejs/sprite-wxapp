const loadedResources = new Map();

const Resource = {
  // {id, src, [srcRect]}
  loadTexture(texture) {
    if(typeof texture === 'string') {
      texture = {id: texture, src: texture};
    }
    if(!texture.id) texture.id = texture.src;
    loadedResources.set(texture.id, texture);
    return texture;
  },
  loadFrames(imgSrc, frameData) {
    return Object.entries(frameData.frames).map(([id, frame]) => {
      const {x, y, w, h} = frame.frame;
      const {rotated, trimmed} = frame;
      if(rotated || trimmed) throw new Error('目前不支持对精灵图片的rotate和trim！');

      const texture = {id, src: imgSrc, srcRect: [x, y, w, h]};
      loadedResources.set(texture.id, texture);
      return texture;
    });
  },
  getTexture(texture) {
    let loaded = loadedResources.get(texture.id);
    if(!loaded) {
      loaded = this.loadTexture(texture);
    }
    return Object.assign(texture, loaded);
  },
};

export default Resource;
