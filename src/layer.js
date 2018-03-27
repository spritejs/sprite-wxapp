import {Layer} from 'sprite-core'

class ExLayer extends Layer {
  get rpx() {
    if(this.parent) return this.parent.rpx
    return 1
  }
  drawSprites(renderEls, t) {
    const context = this.outputContext
    context.save()
    context.scale(this.rpx, this.rpx)
    super.drawSprites(renderEls, t)
    context.restore()
    context.draw()
  }
}

export default ExLayer
