import Layer from './layer'
import Sprite from './sprite'
import Scene from './scene'
import Resource from './resource'

import {
  BaseNode,
  BaseSprite,
  Label,
  Group,
  Effects,
  Path,
  registerNodeType,
  createNode,
  Color,

  utils,
  math,
} from 'sprite-core'

registerNodeType('layer', Layer, true)
registerNodeType('sprite', Sprite)

const version = require('../package.json').version

export {
  version,
  math,
  utils,

  BaseNode,
  BaseSprite,
  Sprite,
  Label,
  Path,
  Group,
  Layer,
  Scene,

  registerNodeType,
  createNode,
  Color,

  Resource,
  Effects,
}