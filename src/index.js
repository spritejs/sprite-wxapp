import Sprite from './sprite'
import Layer from './layer'
import Scene from './scene'
import Label from './label'
import BaseSprite from './basesprite'
import Resource from './resource'
import {parseColor} from './utils'
import {Matrix, Vector} from './math'
import {Effects} from 'sprite-animator'

const Color = parseColor

module.exports = {
  version: require('../package.json').version,
  Sprite,
  Layer,
  Scene,
  Label,

  BaseSprite,
  Resource,
  Color,
  Matrix,
  Vector,
  Effects,
}
