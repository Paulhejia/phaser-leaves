
var game = new Phaser.Game(750, 1334, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

var emitter, tree;

function preload() {
    // 加载资源
    game.load.image('bg', 'assets/bg.png', 750, 1496);
    game.load.image('sky', 'assets/sky4.png');
    game.load.image('leaf', 'assets/leaf.png');
    game.load.spritesheet('tree', 'assets/tree-sprite.png', 406, 528);
    // 手机适配
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

}
// 加载完静态资源后执行场景
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

function onTreeUp () {
    // 数摇动动画
    tree.play('swing', null, false);
    //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.    
    // 800 叶子存活寿命
    // 500 频率是发射粒子的频率，以毫秒为单位
    // 4 每次发射的粒子数
    // 1 执行一次 The -1 means "run forever"
    emitter.flow(800, 500, 4, 1); 
}