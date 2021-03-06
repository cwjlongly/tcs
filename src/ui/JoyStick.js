function ModeKey() {
    //大圆
    this.moveMax = null;
    //小圆点
    this.moveKey = null;
    //当前的舞台
    this.layer = null;
    //是否按下
    this.isDown = false;
    //是否弹起
    this.isUp = false;
    //是否移动
    this.isMove = false;

}
// tip:其实是否按下，是否弹起和是否移动，有点多余了

//初始化你预先设置的参数
ModeKey.prototype.init = function () {
    console.log(this.moveKey, this.layer, this.moveMax)
    this.moveKey.on(Laya.Event.MOUSE_DOWN, this, this.downFun);
    //记录一开始小圆点的位置，方便鼠标弹起的时候自动返回开始位置
    this.moveKey.mode = {x: this.moveKey.x, y: this.moveKey.y}
}
//按下事件
ModeKey.prototype.downFun = function (e) {
    this.isDown = true;
    this.starX = e.stageX;
    this.starY = e.stageY;
    //添加弹起和移动事件
    this.layer.on(Laya.Event.MOUSE_UP, this, this.upFun);
    this.layer.on(Laya.Event.MOUSE_MOVE, this, this.moveFun);
}
//弹起事件
ModeKey.prototype.upFun = function () {
    this.isDown = false;
    this.isUp = false;
    this.isMove = false;
    this.isMode = "stop";
    //移除弹起和移动事件
    this.layer.off(Laya.Event.MOUSE_UP, this, this.upFun);
    this.layer.off(Laya.Event.MOUSE_MOVE, this, this.moveFun);
    Laya.Tween.to(this.moveKey, { x: this.moveKey.mode.x, y: this.moveKey.mode.y }, 100)
}
//鼠标移动事件
ModeKey.prototype.moveFun = function (e) {
    if (!this.isDown) 
        return;
    this.moveX = e.stageX;
    this.moveY = e.stageY;
    this.isMode = "run";
    // 获取半径
    var r = Math.sqrt(Math.pow((this.starX - this.moveX), 2) + Math.pow((this.starY - this.moveY), 2));
    //当移动半径大于大圆的半径时，半径等于大圆的0.5的宽度（也就是半径）
    if (r >= this.moveMax.width/2) 
        r = this.moveMax.width/2;
    var angle = Math.atan2(this.moveY - this.starY, this.moveX - this.starX);
    bottonX = Math.cos(angle) * r + this.starX+(this.moveMax.x - this.starX);
    bottonY = Math.sin(angle) * r + this.starY+(this.moveMax.y - this.starY);
    this.moveKey.x =bottonX ;
    this.moveKey.y =bottonY ;
    var degree = (angle * 180 / Math.PI)+180;
    //在this.con.backData(degree)方法里获取到degree的值也就是角度值，然后你可以自己判断任务方位
    //返回当前的一个方法
    backData(degree)
}

//--------------------------------------------------------美丽的分割线--------------------------------------------------------

// 调用方法
// 在你的舞台上调用该方法即可运行
// 这里的this指向你当前的舞台；
 
// 比如你当前的舞台为 gameLayer
// modeKey = new ModeKey();
// // 外层
// modeKey.moveMax = 大圆按钮;
// // 圆点层
// modeKey.moveKey =小圆按钮
// modeKey.layer = gameLayer
// modeKey.init();//

// function backData (data){
// console.log(data)
// }