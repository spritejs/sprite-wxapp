import BaseNode from './basenode'
import {requestAnimationFrame} from './shim'

const _children = Symbol('children'),
  _updateSet = Symbol('updateSet'),
  _zOrder = Symbol('zOrder'),
  _state = Symbol('state'),
  _renderPromise = Symbol('renderPromise')

class Layer extends BaseNode {
  constructor(id, {handleEvent} = {handleEvent: true}) {
    super()

    this.id = id
    this.handleEvent = handleEvent

    /* eslint-disable no-undef */
    this.outputContext = wx.createCanvasContext(id)
    /* eslint-enable no-undef */

    this[_children] = []
    this[_updateSet] = new Set()
    this[_zOrder] = 0
    this[_state] = {}
  }

  get container() {
    return this.parent ? this.parent.container : null
  }

  isDirty(target) {
    return this[_updateSet].has(target)
  }

  prepareRender() {
    if(!this[_state].prepareRender) {
      this[_state].prepareRender = true

      const that = this,
        parent = this.parent

      this[_renderPromise] = new Promise((resolve, reject) => {
        requestAnimationFrame(function step(t) {
          if(!parent) {
            // already removed from paper
            that[_state].prepareRender = false
            resolve()
            return
          }

          const renderer = that.renderRepaintAll.bind(that)

          if(that[_updateSet].size) {
            renderer(t)
            that.updateEvent()
          }
          if(that[_updateSet].size) {
            requestAnimationFrame(step)
          } else {
            that[_state].prepareRender = false
            resolve()
          }
        })
      })
      // .catch(ex => console.error(ex.message))
    }

    return this[_renderPromise]
  }
  updateEvent() {
    super.dispatchEvent('update', {target: this}, true)
  }
  update(target) {
    const parent = this.parent

    // already removed from paper
    if(!parent) {
      this[_updateSet].clear()
      return
    }
    if(target && this[_updateSet].has(target)) return

    // invisible... return
    if(target && !target.lastRenderBox && !this.isVisible(target)) return

    if(target) this[_updateSet].add(target)

    this.prepareRender()
  }

  isVisible(sprite) {
    const opacity = sprite.attr('opacity')
    if(opacity <= 0) {
      return false
    }

    const [width, height] = sprite.offsetSize
    if(width <= 0 || height <= 0) {
      return false
    }

    return true
  }

  sortChildren(children) {
    children.sort((a, b) => {
      const a_zidx = a.attr('zIndex'),
        b_zidx = b.attr('zIndex')
      if(a_zidx === b_zidx) {
        return a.zOrder - b.zOrder
      }
      return a_zidx - b_zidx
    })
  }

  drawSprites(drawingContext, renderEls, t) {
    for(let i = 0; i < renderEls.length; i++) {
      const child = renderEls[i]
      if(child.parent === this) {
        if(this.isVisible(child)) {
          const transform = child.transform.m,
            pos = child.attr('pos'),
            bound = child.originRect

          drawingContext.save()
          if(this.parent && this.parent.rpx) {
            drawingContext.scale(this.parent.rpx, this.parent.rpx)
          }
          drawingContext.translate(pos[0], pos[1])
          drawingContext.transform(...transform)
          drawingContext.globalAlpha = child.attr('opacity')

          let context = child.cache

          /* eslint-disable no-await-in-loop */
          if(!context) {
            context = child.render(t, drawingContext)
            // context = await child.render(t)
            // if(context !== drawingContext) child.cache = context
          }
          /* eslint-enable no-await-in-loop */

          child.userRender(t, context)

          if(this[_updateSet].has(child)) {
            child.dispatchEvent(
              'update',
              {
                target: child, context, renderBox: child.renderBox, lastRenderBox: child.lastRenderBox,
              },
              true
            )
          }

          child.lastRenderBox = child.renderBox

          if(context !== drawingContext) {
            drawingContext.drawImage(context.canvas, bound[0], bound[1])
          }
          // 真机上 restore 不好用，不知道什么原因 （iphone 7）

          drawingContext.restore()
        } else {
          // invisible, only need to remove lastRenderBox
          delete child.lastRenderBox
        }
      }
    }
  }

  renderRepaintAll(t) {
    const renderEls = this[_children].filter(e => this.isVisible(e))
    this.sortChildren(renderEls)
    const outputContext = this.outputContext

    // const [width, height] = this.resolution
    // outputContext.clearRect(0, 0, width, height)

    this.drawSprites(outputContext, renderEls, t)
    outputContext.draw()

    this[_updateSet].clear()
  }

  appendChild(sprite, forceUpdate = true) {
    this.removeChild(sprite)
    this[_children].push(sprite)
    sprite.connect(this, this[_zOrder]++)
    if(forceUpdate) this.update(sprite)
    return sprite
  }
  append(...sprites) {
    sprites.forEach(sprite => this.appendChild(sprite))
  }
  removeChild(sprite) {
    const idx = this[_children].indexOf(sprite)
    if(idx === -1) {
      return null
    }
    this[_children].splice(idx, 1)
    if(this.isVisible(sprite) || sprite.lastRenderBox) {
      sprite.forceUpdate()
    }
    sprite.disconnect(this)
    return sprite
  }
  remove(...args) {
    if(args.length === 0) {
      args = this[_children].slice(0)
    }
    return args.map(child => this.removeChild(child))
  }
  pointCollision(evt) {
    return true
  }
  dispatchEvent(type, evt) {
    evt.layer = this
    evt.type = type
    evt.stopDispatch = function () {
      this.terminated = true
    }
    const sprites = this[_children].slice(0)
    sprites.sort((a, b) => {
      const a_zidx = a.attr('zIndex'),
        b_zidx = b.attr('zIndex')

      if(a_zidx === b_zidx) {
        return b.zOrder - a.zOrder
      }
      return b_zidx - a_zidx
    })

    const targetSprites = []
    for(let i = 0; i < sprites.length; i++) {
      const sprite = sprites[i]
      if(!evt.terminated) {
        sprite.dispatchEvent(type, evt)
      }
    }

    evt.targetSprites = targetSprites
    super.dispatchEvent(type, evt)
  }
}

export default Layer
