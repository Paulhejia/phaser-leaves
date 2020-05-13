## Phaser.js 实战（一）- 会动的树

[这里可以一篇入门教程](https://blog.csdn.net/cdnight/article/details/47444141)

[这里推荐一个中文官网](https://www.phaser-china.com/tutorial-detail-8.html) 业务有时间可以看看那几个视频教程



下面讲讲业务上实现这个树叶摇动的动画

<img src='https://github.com/Paulhejia/phaser-leaves/blob/master/assets/bg.png' width="375" />

```js
.目录结构
├── assets 
│   ├── bg.png  // 背景
│   ├── leaf.png // 单片叶子
│   └── tree-sprite.png // 树晃动的动画集
├── index.html 
├── libs // 库文件
│   └── phaser.min.js 
└── main.js // 主入口文件
```


通过 new 一个 phaser 实例创建一个宽 750 *  高1334 的 canvas画布挂载到 html的 #phaser-example 标签上，

并绑定了 preload、created 两个生命函数



```js
var game = new Phaser.Game(750, 1334, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
```



本教程只用到两个生命钩子函数

{  

​	preload: preload, 

​	create: create 

})

preload ： 一般用于预加载静态资源，图片音视频动画等等

create : 一旦预加载 preload完成，就会调用create, 如果没有预加载preload方法，则create是在您的应用中调用的第一个方法

# preload @function

```js
function preload() {
    // 加载资源
    game.load.image('bg', 'assets/bg.png', 750, 1496);
    game.load.image('sky', 'assets/sky4.png');
    game.load.image('leaf', 'assets/leaf.png');
    game.load.spritesheet('tree', 'assets/tree-sprite.png', 406, 528);
    // 手机适配
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

}
```

知识点

#### new Sprite(game, x, y, key, frame)  [传送门](https://www.phaser-china.com/docs/Phaser.Loader.html#shader)

key：精灵名字, 

url: 路径,

 frameWidth:宽度 , 

frameHeight: 高度, 

#### spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)  [传送门](https://www.phaser-china.com/docs/Phaser.Loader.html#shader)

key：精灵名字, 

url: 路径,

 frameWidth:宽度 , 

frameHeight: 高度, 

frameMax: Sprite工作表中有多少帧,

 margin,

 spacing

*p s*: spritesheet 配合着 animations 去使用， animations是用于动画的对象， 后面会讲解



# create

```js
// 加载完静态资源后执行
function create() {
    // 加入"bg"精灵到场景，x:0, y:0, keyName: sky
    game.add.image(0, 0, 'bg');
    // 加入"tree"精灵到场景
    tree = game.add.sprite(game.world.centerX, game.world.centerY - 150,  'tree');
    // 创建一个动画帧集， (keyName:swing, 分割图片为11 帧，补间动画（动画播放的速度）18ms, 是否循环播放)
    tree.animations.add('swing', [0,1,2,3,4,5,6,7,8,9,10,11], 18, true);
    // 设置树的锚点 x: 0.5, y: 0.5
    tree.anchor.setTo(0.5, 0.5);    
    // 开启树的物理属性
    tree.inputEnabled = true;
    // 如果鼠标离开tree再释放，onUp事件还是会被触发
    // 为树创建 点击事件    
    tree.events.onInputUp.add(onTreeUp, this);
    // 设置发射器位置 
    emitter = game.add.emitter(game.world.centerX, game.world.centerY - 100, 100);
    //emitter.anchor.setTo(0.5, 0.5);
    // 粒子发射区域的range
    emitter.width = 200;  
    // 创建粒子 leaf
    emitter.makeParticles('leaf');
    // 设置树叶速度
    emitter.minParticleSpeed.setTo(-300, 30);
    emitter.maxParticleSpeed.setTo(300, 100);
    // 设置树叶大小在 0.1-0.6之间
    emitter.minParticleScale = 0.1;    
    emitter.maxParticleScale = 0.6;
    // 重力 400
    emitter.gravity = 400;
}
```

game.add.image 把 image 精灵加入到game场景里

## 图片精灵添加

#### image(x, y, key, frame) [传送门](https://www.phaser-china.com/docs/Phaser.GameObjectCreator.html#group)

x: x 轴位置

y: y 轴位置

key: 对应preload 定义时的key name

frame: 当图片为 精灵表时 （spriteSheet）, 可以指定现实某一帧

<br/>

```tree.animations.add('swing', [0,1,2,3,4,5,6,7,8,9,10,11], 18, true);```

## 让树水平居中

#### anchor.setTo

tree.anchor.setTo(0.5, 0.5);  //把锚点设为 图片的中心，默认是左上角， 这样设置 x 轴位置为 game.world.centerX 就可以实现水平居中

![](https://github.com/Paulhejia/phaser-leaves/blob/master/docs/tree-anchor.png)


## 树晃动的动画声明

#### animations.add(name, frames, frameRate, loop, useNumericIndex)  [传送门](https://www.phaser-china.com/docs/Phaser.AnimationManager.html#toc15)

name: 动画名字

frames 与要添加到此动画中的帧相对应的帧/数字和字符串的排列顺序。例如[1、2、3]或['run0'，'run1'，run2]）。如果为null，则将使用所有帧。

frameRate: 动画播放的速度 单位为 秒

loop： 是否循环播放

useNumericIndex: 本节暂时没用到

*ps： 结合 tree.play('swing') 使用*

![](https://github.com/Paulhejia/phaser-leaves/blob/master/docs/tree-sheet.png)


## 绑定树的点击事件

```tree.events.onInputUp.add(onTreeUp, this);``

onInputUp.add(callback,  context) 

callback: 回调函数

context：传入回调函数的上下文

这里 onInputUp 为 鼠标抬起时触发 onTreeUp 回调

```js
function onTreeUp () {
    // 数摇动动画
    tree.play('swing', null, false); // 这时出发 tree 的 swing 动画
  ... 
}
```

## 树叶粒子化

```js
// 设置 发射器的位置
emitter = game.add.emitter(game.world.centerX, game.world.centerY - 100, 100);
// 粒子发射区域的range
emitter.width = 200;  
// 创建粒子 leaf
emitter.makeParticles('leaf');
// 设置树叶速度 x方向： -300 ， y方向： 30  https://www.phaser-china.com/docs/src_particles_arcade_Emitter.js.html
emitter.minParticleSpeed.setTo(-300, 30);
emitter.maxParticleSpeed.setTo(300, 100);
// 设置树叶大小在 0.1-0.6之间
emitter.minParticleScale = 0.1;    
emitter.maxParticleScale = 0.6;
// 重力 400
emitter.gravity = 400;
```



#### emitter(x, y, maxParticles) [传送门](https://www.phaser-china.com/docs/Phaser.GameObjectCreator.html#button)

x: x坐标

y: y坐标

maxParticles: 此发射器中的粒子总数



其中就是定义一个 树叶发射器 , 	

1. 在哪里发射
2. 设定发射的范围
3. 发射的数量
4. 发射粒子的重量
5. 发射粒子多久消失

然后在点击树的时候让发射器开始发射

```js
function onTreeUp () {
    // 数摇动动画
    ... 
    // 发射器
    emitter.flow(800, 500, 4, 1);
   
    //  This will emit a single particle every 100ms. Each particle will live for 2000ms.
    //  The 100 means it will emit 100 particles in total and then stop.    
}
```

#### flow(lifespan, frequency, quantity) [传送门](https://www.phaser-china.com/docs/Phaser.Particles.Arcade.Emitter.html#filter)

lifespan： 每个粒子的存活时长

frequency： 多久发射一次粒子

quantity： 每次发多少粒子



# 下面是我学习过程中总结的学习体系

生命周期（preload,  created,  updated,  render 等等）

场景声明与切换

各种精灵添加 

动画 

粒子 

物理引擎

手机适配

事件

对象池 （回收与复用，防止内存泄漏，闪退）

