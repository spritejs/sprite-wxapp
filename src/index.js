import {
  BaseNode,
  BaseSprite,
  DataNode,
  Label,
  Group,
  Effects,
  Easings,
  Timeline,
  Path,
  registerNodeType,
  isValidNodeType,
  createNode,
  createElement,
  Color,

  use,
  utils,
  math,

  querySelector,
  querySelectorAll,
  stylesheet,
} from '@spritejs/core';

import Layer from './layer';
import Sprite from './sprite';
import Scene from './scene';
import Resource from './resource';

registerNodeType('layer', Layer, true);
registerNodeType('sprite', Sprite);

const version = require('../package.json').version;

export {
  version,
  use,
  math,
  utils,

  BaseNode,
  BaseSprite,
  DataNode,
  Sprite,
  Label,
  Path,
  Group,
  Layer,
  Scene,

  registerNodeType,
  isValidNodeType,
  createNode,
  createElement,
  Color,

  Resource,
  Effects,
  Easings,
  Timeline,

  querySelector,
  querySelectorAll,
  stylesheet,
};