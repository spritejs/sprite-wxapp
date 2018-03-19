/*
https://github.com/basementuniverse/parsecolor

Parse a valid CSS color string into an object like: { r, g, b, a }
Properties will have the correct interval and precision.
Valid input examples:

red
#f00
#ff0000
#ff0000ff
rgb(255, 0, 0)
rgb(100%, 0%, 0%)
rgba(255, 0, 0, 1)
rgba(100%, 0%, 0%, 1)
hsl(0, 100%, 50%)
hsla(0, 100%, 50%, 1)

*/
const names = {
  aliceblue: 'f0f8ff',
  antiquewhite: 'faebd7',
  aqua: '0ff',
  aquamarine: '7fffd4',
  azure: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '000',
  blanchedalmond: 'ffebcd',
  blue: '00f',
  blueviolet: '8a2be2',
  brown: 'a52a2a',
  burlywood: 'deb887',
  cadetblue: '5f9ea0',
  chartreuse: '7fff00',
  chocolate: 'd2691e',
  coral: 'ff7f50',
  cornflowerblue: '6495ed',
  cornsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: '0ff',
  darkblue: '00008b',
  darkcyan: '008b8b',
  darkgoldenrod: 'b8860b',
  darkgray: 'a9a9a9',
  darkgreen: '006400',
  darkgrey: 'a9a9a9',
  darkkhaki: 'bdb76b',
  darkmagenta: '8b008b',
  darkolivegreen: '556b2f',
  darkorange: 'ff8c00',
  darkorchid: '9932cc',
  darkred: '8b0000',
  darksalmon: 'e9967a',
  darkseagreen: '8fbc8f',
  darkslateblue: '483d8b',
  darkslategray: '2f4f4f',
  darkslategrey: '2f4f4f',
  darkturquoise: '00ced1',
  darkviolet: '9400d3',
  deeppink: 'ff1493',
  deepskyblue: '00bfff',
  dimgray: '696969',
  dimgrey: '696969',
  dodgerblue: '1e90ff',
  firebrick: 'b22222',
  floralwhite: 'fffaf0',
  forestgreen: '228b22',
  fuchsia: 'f0f',
  gainsboro: 'dcdcdc',
  ghostwhite: 'f8f8ff',
  gold: 'ffd700',
  goldenrod: 'daa520',
  gray: '808080',
  green: '008000',
  greenyellow: 'adff2f',
  grey: '808080',
  honeydew: 'f0fff0',
  hotpink: 'ff69b4',
  indianred: 'cd5c5c',
  indigo: '4b0082',
  ivory: 'fffff0',
  khaki: 'f0e68c',
  lavender: 'e6e6fa',
  lavenderblush: 'fff0f5',
  lawngreen: '7cfc00',
  lemonchiffon: 'fffacd',
  lightblue: 'add8e6',
  lightcoral: 'f08080',
  lightcyan: 'e0ffff',
  lightgoldenrodyellow: 'fafad2',
  lightgray: 'd3d3d3',
  lightgreen: '90ee90',
  lightgrey: 'd3d3d3',
  lightpink: 'ffb6c1',
  lightsalmon: 'ffa07a',
  lightseagreen: '20b2aa',
  lightskyblue: '87cefa',
  lightslategray: '789',
  lightslategrey: '789',
  lightsteelblue: 'b0c4de',
  lightyellow: 'ffffe0',
  lime: '0f0',
  limegreen: '32cd32',
  linen: 'faf0e6',
  magenta: 'f0f',
  maroon: '800000',
  mediumaquamarine: '66cdaa',
  mediumblue: '0000cd',
  mediumorchid: 'ba55d3',
  mediumpurple: '9370db',
  mediumseagreen: '3cb371',
  mediumslateblue: '7b68ee',
  mediumspringgreen: '00fa9a',
  mediumturquoise: '48d1cc',
  mediumvioletred: 'c71585',
  midnightblue: '191970',
  mintcream: 'f5fffa',
  mistyrose: 'ffe4e1',
  moccasin: 'ffe4b5',
  navajowhite: 'ffdead',
  navy: '000080',
  oldlace: 'fdf5e6',
  olive: '808000',
  olivedrab: '6b8e23',
  orange: 'ffa500',
  orangered: 'ff4500',
  orchid: 'da70d6',
  palegoldenrod: 'eee8aa',
  palegreen: '98fb98',
  paleturquoise: 'afeeee',
  palevioletred: 'db7093',
  papayawhip: 'ffefd5',
  peachpuff: 'ffdab9',
  peru: 'cd853f',
  pink: 'ffc0cb',
  plum: 'dda0dd',
  powderblue: 'b0e0e6',
  purple: '800080',
  rebeccapurple: '639',
  red: 'f00',
  rosybrown: 'bc8f8f',
  royalblue: '4169e1',
  saddlebrown: '8b4513',
  salmon: 'fa8072',
  sandybrown: 'f4a460',
  seagreen: '2e8b57',
  seashell: 'fff5ee',
  sienna: 'a0522d',
  silver: 'c0c0c0',
  skyblue: '87ceeb',
  slateblue: '6a5acd',
  slategray: '708090',
  slategrey: '708090',
  snow: 'fffafa',
  springgreen: '00ff7f',
  steelblue: '4682b4',
  tan: 'd2b48c',
  teal: '008080',
  thistle: 'd8bfd8',
  tomato: 'ff6347',
  turquoise: '40e0d0',
  violet: 'ee82ee',
  wheat: 'f5deb3',
  white: 'fff',
  whitesmoke: 'f5f5f5',
  yellow: 'ff0',
  yellowgreen: '9acd32',
  transparent: '00000000',
}

/* eslint-disable */
const clamp = (n, a, b) => (n < a ? a : (n > b ? b : n)),	// Clamp n in interval [a, b]
  round = (n, d) => {	// Round n to nearest integer, or to d decimal places (if d is defined)
    const p = Math.pow(10, d || 0)
    return Math.round(n * p) / p
  },
  hi = n => clamp(parseInt(n, 16), 0, 255),	// Convert 2-digit hex to int in interval [0, 255]
  hf = n => clamp(round(parseInt(n, 16) / 255, 2), 0, 1),	// Convert 2-digit hex to float with 2 decimal places in interval [0, 1]
  si = n => clamp(round(parseFloat(n)), 0, 255),	// Convert string to int in interval [0, 255]
  sf = n => clamp(round(parseFloat(n), 2), 0, 1),	// Convert string to float with 2 decimal places in interval [0, 1]
  pi = n => clamp(round(parseFloat(n) / 100 * 255), 0, 255),	// Convert percentage string to int in interval [0, 255]
  uf = n => clamp(parseFloat(n) / 360, 0, 1),	// Convert hue string to float in interval [0, 1]
  pf = n => clamp(parseFloat(n) / 100, 0, 1)	// Convert percentage string to float in interval [0, 1]

// Convert hsl to rgb, alpha value gets passed straight through
// h, s, l values are assumed to be in interval [0, 1]
// Returns an object like { r, g, b, a }
// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
function hslToRgb(h, s, l, a) {
  let r,
    g,
    b,
    hue = function (p, q, t) {
      if(t < 0) { t += 1 }
      if(t > 1) { t -= 1 }
      if(t < 1 / 6) { return p + (q - p) * 6 * t }
      if(t < 1 / 2) { return q }
      if(t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6 }
      return p
    }
  if(s == 0) {
    r = g = b = l
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
      p = 2 * l - q
    r = hue(p, q, h + 1 / 3)
    g = hue(p, q, h)
    b = hue(p, q, h - 1 / 3)
  }
  return {r: round(r * 255), g: round(g * 255), b: round(b * 255), a}
}
export default function (c) {
  let o = {r: 0, g: 0, b: 0, a: 0},
    m = null
  if(typeof c === 'string') {
    if(c in names) { c = `#${names[c]}` }
    if((m = c.match(/#([a-f0-9])([a-f0-9])([a-f0-9])$/i)) !== null) {
      o = {r: hi(m[1] + m[1]), g: hi(m[2] + m[2]), b: hi(m[3] + m[3]), a: 1}
    } else if((m = c.match(/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)) !== null) {
      o = {r: hi(m[1]), g: hi(m[2]), b: hi(m[3]), a: 1}
    } else if((m = c.match(/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)) !== null) {
      o = {r: hi(m[1]), g: hi(m[2]), b: hi(m[3]), a: hf(m[4])}
    } else if((m = c.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/)) !== null) {
      o = {r: si(m[1]), g: si(m[2]), b: si(m[3]), a: 1}
    } else if((m = c.match(/rgb\(\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*\)/)) !== null) {
      o = {r: pi(m[1]), g: pi(m[2]), b: pi(m[3]), a: 1}
    } else if((m = c.match(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
      o = {r: si(m[1]), g: si(m[2]), b: si(m[3]), a: sf(m[4])}
    } else if((m = c.match(/rgba\(\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
      o = {r: pi(m[1]), g: pi(m[2]), b: pi(m[3]), a: sf(m[4])}
    } else if((m = c.match(/hsl\(\s*(\d{1,3}\.?\d?)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*\)/)) !== null) {
      o = hslToRgb(uf(m[1]), pf(m[2]), pf(m[3]), 1)
    } else if((m = c.match(/hsla\(\s*(\d{1,3}\.?\d?)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
      o = hslToRgb(uf(m[1]), pf(m[2]), pf(m[3]), sf(m[4]))
    }
  } else if(typeof c === 'object') {
    if(c.r !== undefined && c.g != undefined && c.b !== undefined) {
      o = {r: si(c.r), g: si(c.g), b: si(c.b), a: sf(c.a || 1)}
    } else if(c.h !== undefined && c.s !== undefined && c.l !== undefined) {
      o = hslToRgb(uf(c.h), pf(c.s), pf(c.l), sf(c.a || 1))
    }
  }
  return o
}
/* eslint-enable */
