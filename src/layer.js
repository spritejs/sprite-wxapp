import {Layer} from 'sprite-core'

class ExLayer extends Layer {
  get rpx() {
    if(this.parent) return this.parent.rpx
    return 1
  }
  toLocalPos(x, y) {
    return this.parent && this.parent.toLocalPos(x, y)
  }
  toGlobalPos(x, y) {
    return this.parent && this.parent.toGlobalPos(x, y)
  }
  drawSprites(renderEls, t) {
    const context = this.outputContext
    context.save()
    context.scale(this.rpx, this.rpx)
    super.drawSprites(renderEls, t)
    context.restore()
    if(context.draw) {
      context.draw()
    }
  }
}

export default ExLayer
