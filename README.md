# spritejs 微信小程序版

这是 [spritejs](https://github.com/spritejs/spritejs) 的微信小程序版，目前支持 spritejs v 2.0 的大部分功能，具体可以参考[帮助文档](https://github.com/spritejs/spritejs/tree/master/docs#%E6%95%B4%E4%BD%93%E7%BB%93%E6%9E%84)

## 特性

- Sprite属性更新自动（分批）重绘
- 以rpx为默认单位
- 动画支持Web Animations API
- 支持事件机制

## 快速使用

### 安装

v1.10.0 版本之后，小程序版支持使用 NPM 安装。

```bash
npm install @spritejs/wxapp --save
```

然后在微信小程序中[构建 NPM 包](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

### 通过组件使用

安装并构建之后，要使用 SpriteJS，最简单的方式是通过内置的 scene 组件使用。

在小程序配置 app.json 中注册组件：

```json
  "usingComponents": {
    "s-scene": "@spritejs/wxapp/scene"
  }
```

然后在要使用的页面引入组件：

```xml
<view>
  <s-scene id="container"
    layers="bglayer,fglayer"
    bindSceneCreated="onSceneCreated"
  ></s-scene>
</view>
```

参数layers表示创建几个layer以及它们的ID，缺省为default。

bindSceneCreated为创建Scene后的回调事件，事件方法中传回所创建的layers：

```js
const { Sprite } = require('@spritejs/wxapp');

Page({
  onSceneCreated({ detail: layers }) {
    const { bglayer, fglayer } = layers;
    const s = new Sprite({
      size: [100, 100],
      pos: [300, 300],
      bgcolor: 'red',
    });
    fglayer.append(s);

    const s2 = new Sprite({
      size: [300, 300],
      pos: [200, 200],
      bgcolor: 'blue',
    });
    bglayer.append(s2);

    s.on('touchstart', () => {
      s.attr('bgcolor', 'green');
    });
    s.on('touchmove', () => {
      s.attr('bgcolor', 'yellow');
    });
    s.on('touchend', () => {
      s.attr('bgcolor', 'red');
    });
  },
});
```

### 自定义使用

如果不想使用组件，你也可以自己创建canvas，然后构造scene

```xml
<view class="scene-layout" id="container" catchtouchmove="noop">
  <block wx:for="{{layers}}" wx:key="{{item}}">
    <canvas canvas-id="{{item}}" disable-scroll="true"></canvas>
  </block>
</view>
```

```js
const spritejs = require('@spritejs/wxapp');

Page({
  data: {
    layers: ['fglayer'],
    eventOffset: [0, 0],
  },
  onTouchStart(event) {
    // 派发 touchstart 事件
    this.scene.layer('fglayer').dispatchEvent(event, this.data.eventOffset);
  },
  onReady: function() {
    // 由于代理事件的 scene-layout 相对窗口可能有偏移，所以需要传入这个偏移量
    // 以正确定位事件坐标
    const query = wx.createSelectorQuery();
    query.select('.scene-layout').boundingClientRect().exec(([rect]) => {
      if(rect) {
        this.setData({
          eventOffset: [rect.left, rect.top],
        });
      }
    });

    const scene = new spritejs.Scene();
    this.scene = scene;
    const layer = scene.layer('fglayer');
    
    // 预加载资源
    scene.preload(['../../assets/img/birds.png', require('../../assets/img/birds.json.js')]);
    
    const bird = new spritejs.Sprite('bird1.png');
    bird.attr({
      anchor: [0.5, 0.5],
      pos: [100, 200],
    });

    // 添加 ontouch 事件
    bird.on('touchstart', evt => {
      console.log(evt)
    });

    // 纹理动画
    let i = 0;
    setInterval(() => {
      bird.textures = [`bird${i++%3+1}.png`];
    }, 100);

    // 添加文字
    const text = new spritejs.Label('Hello\n World!');
    text.attr({
      //anchor: [0.5, 0.5],
      font: '44px Arial',
      border: [2, 'red'],
    });

    const posFrom = [0, 0];
    const posTo = [100, 0];

    // 播放一个移位动画
    text.animate([
      {pos: posFrom},
      {pos: posTo},
    ], {
      duration: 2000
    });

    // 将两个精灵添加到 layer
    layer.append(bird, text);
  },
})
```

**注意**，自己调用的时候，创建canvas需要设置canvas-id属性与创建的layer的ID一致。

## 小程序版与原版限制/差异

### Scene 的参数差异

不同于web/node版，小程序版的Scene构造函数只能传width和height，单位是rpx。rpx是微信小程序特有的单位，具体描述参考[文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxss.html)。

```js
const info = wx.getSystemInfoSync();
const scene = new Scene(750, 1433); // 单位是rpx
```

### 事件处理的差异

如果通过组件加载方式使用，`touchstart, touchend, touchmove, tap, longpress` 等事件被scene自动代理，所以你可以在sprite元素中添加对应的事件处理函数，能够正常触发事件。

如果是自己创建scene，那么需要自己手动代理事件：

```xml
<!--index.wxml-->
<view class="scene-layout" id="container">
  <block wx:for="{{layers}}" wx:key="{{item}}">
    <canvas canvas-id="{{item}}" bindtouchstart="touched"></canvas>
  </block>
</view>
```

```js
const spritejs = require('@spritejs/wxapp')

Page({
  data: {
    layers: ['fglayer'],
    eventOffset: [0, 0],
  },
  touched: function(event) {
    this.scene.layer('fglayer').delegateEvent(event, this.data.eventOffset);
  },
  onReady: function() {
    // 由于代理事件的 scene-layout 相对窗口可能有偏移，所以需要传入这个偏移量
    // 以正确定位事件坐标
    const query = wx.createSelectorQuery();
    query.select('.scene-layout').boundingClientRect().exec(([rect]) => {
      if(rect) {
        this.setData({
          eventOffset: [rect.left, rect.top],
        });
      }
    });

    const scene = new spritejs.Scene();
    this.scene = scene;

    const layer = scene.layer('fglayer');
    
    // 如果在自定义组件中使用，传递第二个参数为组件实例的引用。
    // const layer = scene.layer('fglayer', this)
    
    ...
  },
})
```

### layer的canvas元素需要预先创建

微信不支持动态创建元素，因此canvas要先在模板里创建好，并赋给对应的canvas-id。

### 资源预加载和Sprite图片支持的限制

目前不支持远程url的加载，只支持本地图片素材，另外web/node版的Sprite可以预加载图片并获得图片宽高，所以sprite可以默认自适应宽高，而微信小程序版除非使用texturepacker打包图片，否则不能获得默认的宽高，必须指定宽高才可以将sprite对象显示出来。

另外**注意**scene.preload预加frames资源载时，不支持从json文件加载frameData，必须是js对象，可以将frameData存成js，然后在app中require进来。

另外目前不支持 texture packer 的 rotated 和 trimmed 功能。

```js
// 微信小程序版的 scene.preload 是同步的
scene.preload(['../../assets/img/birds.png', require('../../assets/img/birds.json.js')])

const sprite1 = new Sprite('bird1.png') 
sprite1.attr({
  pos: [0, 0],
})
// 从frames中加载的图片有默认大小，可以正常显示
scene.layer().append(sprite1)

const sprite2 = new Sprite('../../assets/img/rambda.png')
sprite2.attr({
  pos: [50, 50],
  size: [100, 100], // 非frames的图片必须指定宽高
})

scene.layer().append(sprite2)
```

### 调试示例代码

我们放了一个“十滴水”小游戏的例子在 `app` 文件夹下。

要调试示例代码，可以启动webpack编译

```bash
npm start
```

然后用微信开发者工具调试代码

![示例小程序](https://p1.ssl.qhimg.com/t01c8802b28edfcb127.gif)

### 目前不支持的特性

* 微信不支持动态创建Dom元素，不兼容d3，目前d3的功能暂时不支持（未来打算通过shim适配）。
* 微信context不支持滤镜，所以滤镜filter无效果。
* 微信canvas不支持渐变（linearGradients 和 createRadialGradient)，如果在 attr 中使用渐变属性会出错。
* 微信的canvas不支持动态创建context，因此无法使用缓存优化。

### 目前暂时无法解决的Bug

* 由于微信的模拟器的clip有问题，所以在模拟器下sprite元素的clip区域可能不正确
* 微信的canvas的globalAlpha只有setter没有getter，因此小程序设置opacity属性的时候没法层叠，子元素的opacity会覆盖父容器的opacity值
