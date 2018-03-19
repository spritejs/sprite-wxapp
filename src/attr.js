import {attr, parseValue} from './decorators'
import {Matrix} from './math'
import {parseColorString, oneOrTwoValues, fourValuesShortCut,
  parseStringInt, parseStringFloat, parseStringTransform} from './utils'

const Immutable = require('seamless-immutable').static
const _attr = Symbol('attr'),
  _temp = Symbol('store'),
  _subject = Symbol('subject')

class SpriteAttr {
  constructor(subject) {
    this[_subject] = subject
    this[_attr] = Immutable({
      anchor: [0, 0],
      x: 0,
      y: 0,
      opacity: 1,
      width: '',
      height: '',
      bgcolor: '',
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
      transform: [1, 0, 0, 1, 0, 0],
      border: '',
      borderRadius: 0,
      padding: [0, 0, 0, 0],
      zIndex: 0,
      offsetRotate: 'auto',
      linearGradients: {},
    })
    this[_temp] = new Map() // save non-serialized values
  }

  getAttrState() {
    return this[_attr]
  }

  saveObj(key, val) {
    this[_temp].set(key, val)
  }
  loadObj(key) {
    return this[_temp].get(key)
  }

  set(key, val) {
    this[_attr] = Immutable.set(this[_attr], key, val)
  }
  get(key) {
    const obj = this[_attr][key]

    if(obj && typeof obj === 'object') {
      return Immutable.asMutable(obj, {deep: true})
    }
    return obj
  }
  remove(key) {
    return delete this[_attr][key]
  }

  clearCache() {
    if(this.subject) {
      this.subject.cache = null
    }
    return this
  }
  forceUpdate(clearCache) {
    if(this.subject) {
      this.subject.forceUpdate(clearCache)
    }

    return this
  }
  merge(attrs) {
    if(typeof attrs === 'string') {
      attrs = JSON.parse(attrs)
    }

    this[_attr] = Immutable.merge(this[_attr], attrs)

    return this
  }
  serialize() {
    const attrs = Object.assign({}, this[_attr])
    return JSON.stringify(attrs)
  }

  get subject() {
    return this[_subject]
  }

  set id(val) {
    return this.saveObj('id', String(val))
  }
  get id() {
    return this.loadObj('id')
  }

  set name(val) {
    return this.set('name', String(val))
  }
  get name() {
    return this.get('name')
  }

  @attr
  @parseValue(parseStringFloat, oneOrTwoValues)
  set anchor(val) {
    this.set('anchor', val)
  }
  get anchor() {
    return this.get('anchor')
  }

  @attr
  set x(val) {
    this.set('x', Math.round(val))
  }
  get x() {
    return this.get('x')
  }

  @attr
  set y(val) {
    this.set('y', Math.round(val))
  }
  get y() {
    return this.get('y')
  }

  @attr
  @parseValue(parseStringInt)
  set pos(val) {
    const [x, y] = val
    this.x = x
    this.y = y
  }
  get pos() {
    return [this.x, this.y]
  }

  @attr('repaint')
  @parseValue(parseColorString)
  set bgcolor(val) {
    this.set('bgcolor', val)
  }
  get bgcolor() {
    return this.get('bgcolor')
  }

  @attr
  set opacity(val) {
    this.set('opacity', val)
  }
  get opacity() {
    return this.get('opacity')
  }

  @attr('repaint')
  set width(val) {
    this.set('width', Math.round(val))
  }
  get width() {
    return this.get('width')
  }

  @attr('repaint')
  set height(val) {
    this.set('height', Math.round(val))
  }
  get height() {
    return this.get('height')
  }

  @attr
  @parseValue(parseStringInt)
  set size(val) {
    const [width, height] = val
    this.width = width
    this.height = height
  }
  get size() {
    return [this.width, this.height]
  }

  @attr('repaint')
  set border(val) {
    const [width, color] = val
    this.set('border', [width, parseColorString(color)])
  }
  get border() {
    return this.get('border') || [0, 'rgba(0,0,0,0)']
  }

  @attr('repaint')
  @parseValue(parseStringInt, fourValuesShortCut)
  set padding(val) {
    this.set('padding', val)
  }
  get padding() {
    return this.get('padding')
  }

  @attr('repaint')
  set borderRadius(val) {
    this.set('borderRadius', val)
  }
  get borderRadius() {
    return this.get('borderRadius')
  }

  // transform attributes
  @attr
  @parseValue(parseStringTransform)
  set transform(val) {
    /*
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
      matrix: [1,0,0,1,0,0],
     */
    this.merge({
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
    })

    if(Array.isArray(val)) {
      this.set('transform', val)
      this.set('transformStr', `matrix(${val})`)
    } else {
      this.set('transform', [1, 0, 0, 1, 0, 0])
      const transformStr = []

      Object.entries(val).forEach(([key, value]) => {
        if(key === 'matrix' && Array.isArray(value)) {
          this.set('transform', new Matrix(value).m)
        } else {
          this[key] = value
        }
        transformStr.push(`${key}(${value})`)
      })

      this.set('transformStr', transformStr.join(' '))
    }
  }
  get transform() {
    return this.get('transformStr') || 'matrix(1,0,0,1,0,0)'
  }

  @attr
  set rotate(val) {
    const delta = this.get('rotate') - val
    this.set('rotate', val)
    const transform = new Matrix(this.get('transform')).rotate(-delta)
    this.set('transform', transform.m)
  }
  get rotate() {
    return this.get('rotate')
  }

  @attr
  set scale(val) {
    val = oneOrTwoValues(val)
    const oldVal = this.get('scale')
    const delta = [val[0] / oldVal[0], val[1] / oldVal[1]]
    this.set('scale', val)

    const offsetAngle = this.get('offsetAngle')
    if(offsetAngle) {
      this.rotate -= offsetAngle
    }

    const transform = new Matrix(this.get('transform'))
    transform.scale(...delta)
    this.set('transform', transform.m)

    if(offsetAngle) {
      this.rotate += offsetAngle
    }
  }
  get scale() {
    return this.get('scale')
  }

  @attr
  set translate(val) {
    const oldVal = this.get('translate')
    const delta = [val[0] - oldVal[0], val[1] - oldVal[1]]
    this.set('translate', val)
    const transform = new Matrix(this.get('transform'))
    transform.translate(...delta)
    this.set('transform', transform.m)
  }
  get translate() {
    return this.get('translate')
  }

  @attr
  set skew(val) {
    const oldVal = this.get('skew')
    const invm = new Matrix().skew(...oldVal).inverse()
    this.set('skew', val)
    const transform = new Matrix(this.get('transform'))
    transform.multiply(invm).skew(...val)
    this.set('transform', transform.m)
  }
  get skew() {
    return this.get('skew')
  }

  @attr
  set zIndex(val) {
    this.set('zIndex', val)
  }
  get zIndex() {
    return this.get('zIndex')
  }

  /**
    linearGradients : {
      bgcolor: {
        direction: 30,  //angle，[0,360)
        rect: [x, y, w, h],
        vector: [x1, y1, x2, y2], // direction/rect or from/to
        colors: [
          {offset: 0, color: 'red'},
          {offset: 1, color: 'black'}
        ]
      }
    }
   */
  @attr('repaint')
  set linearGradients(val) {
    this.set('linearGradients', val)
  }
  get linearGradients() {
    return this.get('linearGradients')
  }
}

export default SpriteAttr
