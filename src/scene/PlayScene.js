var PlayScene = (function(superClass) {

    var WebGL = laya.webgl.WebGL;
    var Stage   = Laya.Stage;
    var Event   = Laya.Event;

    var stage = Laya.stage;
    var screen = gameConfig.screen;

    function PlayScene(opts) {
        PlayScene.super(this);
    }
    Laya.class(PlayScene, 'playScene', superClass);

    var _proto = PlayScene.prototype;

    _proto.init = function() {

        var self = this;
        this.isEnd = false;

        // 创建背景
        var bg = new Background();
        var heroLink = ObjectHolder.heroLink;
        var itemBox = ObjectHolder.itemBox;
        var enemyBox = ObjectHolder.enemyBox;
        var bulletBox = ObjectHolder.bulletBox;
        var barBox = ObjectHolder.barBox;



        this.addChild(bg);
        this.addChild(heroLink);
        this.addChild(itemBox);
        this.addChild(enemyBox);
        this.addChild(bulletBox);
        this.addChild(barBox);
        // this.addChild(button);

        var hero = new Hero({dir: gameConfig.dirs.RIGHT, curX: 40, curY:40});
        var item = new Item({x: 120, y: 120});
        var itemArcher = new ItemArcher({x: 80, y: 80});
        var enemy = new EnemyTower({x: 160, y:160});

        heroLink.addHero(hero);
        heroLink.move();

        itemBox.addChild(item);
        itemBox.addChild(itemArcher);

        enemyBox.addChild(enemy);

        // 监听键盘输入
        Laya.stage.on(Event.KEY_DOWN, this, onKeyDown);

        function onKeyDown(e) {
            // console.log(e.keyCode);
            switch(e.keyCode) {
                case 38:
                    heroLink.changeDir(gameConfig.dirs.UP);
                    break;
                case 40:
                    heroLink.changeDir(gameConfig.dirs.DOWN);
                    break;
                case 37:
                    heroLink.changeDir(gameConfig.dirs.LEFT);
                    break;
                case 39:
                    heroLink.changeDir(gameConfig.dirs.RIGHT);
                    break;
                // 空格
                case 32:
                    var newHero = new Hero({dir: gameConfig.dirs.RIGHT, curX: 80, curY: 80});
                    heroLink.addHero(newHero);
                    // hero.dir = gameConfig.dirs.RIGHT;
                    break;
                // x
                case 88:
                    heroLink.delHero();
                    // hero.dir = gameConfig.dirs.RIGHT;
                    break;
                // z 删除首节点
                case 90:
                    heroLink.removeHero(hero);
                    break;

            }
        }

        // 游戏循环函数
        function onLoop() {
            // 碰撞检测
            for (var i=0; i<heroLink.numChildren; i++) {
                var curHero = heroLink.getChildAt(i);
                for (var j=0; j<itemBox.numChildren; j++) {
                    var item = itemBox.getChildAt(j);
                    if (curHero.getBounds().intersects(item.getBounds())) {
                        item.pos(Math.random() * 760, Math.random() * 760);
                        item.onHeroFound(hero);
                        curHero.getItem(item);
                    }
                }
                for (var k=0; k<bulletBox.numChildren; k++) {
                    var bullet = bulletBox.getChildAt(k);
                    if (curHero.getBounds().intersects(bullet.getBounds())) {
                        bullet.onCrash(curHero);
                        if (curHero.hurt(bullet)) {
                            if (!curHero.pNode && !curHero.nNode){
                                self.isEnd = true;
                            }
                            break;
                        }
                    }
                }
            }

            // 敌人攻击
            for (var i=0; i<enemyBox.numChildren; i++) {
                enemyBox.getChildAt(i).attack();
            }

            // 子弹移动
            for (var i=0; i<bulletBox.numChildren; i++) {
                bulletBox.getChildAt(i).move();
            }


            if (self.isEnd) {
                var endScene = new EndScene(); 
                ObjectHolder.init();
                endScene.init();
                stage.replaceChild(endScene, self);
                Laya.timer.clear(self,onLoop);
                // Laya.timer.clearAll(self);
                self.destroy(true);

            }

        }


        // 开始游戏循环
        Laya.timer.frameLoop(1, this, onLoop);
    }

    return PlayScene;

})(Laya.Sprite);