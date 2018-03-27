import {BaseSprite, Effects} from 'sprite-core'
import {parseColorString, attr} from 'sprite-utils'
import pathToCanvas from 'svg-path-to-canvas'
import pathEffect from 'sprite-path-effect'

Effects.d = pathEffect

class PathSpriteAttr extends BaseSprite.Attr {
  constructor(subject) {
    super(subject)
    this.setDefault({
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      strokeColor: '',
      fillColor: '',
      // d: path2d,
      boxSize: [0, 0],
      pathRect: [0, 0, 0, 0],
    })
  }
  @attr
  set d(val) {
    this.clearCache()
    this.set('d', val)
    const commands = pathToCanvas(val)
    this.set('pathCommands', commands)
  }

  @attr
  set lineWidth(val) {
    this.clearCache()
    this.set('lineWidth', Math.round(val))
  }

  /**
    lineCap: butt|round|square
   */
  @attr
  set lineCap(val) {
    this.clearCache()
    this.set('lineCap', val)
  }

  /**
    lineJoin: miter|round|bevel
   */
  @attr
  set lineJoin(val) {
    this.clearCache()
    this.set('lineJoin', val)
  }

  @attr
  set strokeColor(val) {
    this.clearCache()
    this.set('strokeColor', parseColorString(val))
  }

  @attr
  set fillColor(val) {
    this.clearCache()
    this.set('fillColor', parseColorString(val))
  }
}

class Path extends BaseSprite {
  static Attr = PathSpriteAttr

  constructor(attr) {
    if(typeof attr === 'string') {
      attr = {d: attr}
    }
    super(attr)
  }

  isVisible() {
    return !!this.attr('d')
  }

  render(t, drawingContext) {
    const context = super.render(t, drawingContext),
      attr = this.attr()

    if(attr.d) {
      const commands = this.attr('pathCommands')
      let {strokeColor, fillColor} = attr

      if(!strokeColor && !fillColor) {
        strokeColor = parseColorString('black')
      }
      commands.forEach(({cmd, args}) => {
        context[cmd](...args)
      })

      context.lineWidth = attr.lineWidth
      context.lineCap = attr.lineCap
      context.lineJoin = attr.lineJoin

      if(strokeColor) {
        context.strokeStyle = strokeColor
        context.stroke()
      }
      if(fillColor) {
        context.fillStyle = fillColor
        context.fill()
      }
    }

    return context
  }
}

export default Path
