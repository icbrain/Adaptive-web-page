window.onload = function(){

    listMove();
    rightMove();
}

//判断是否是点击事件
function isClick(elem, callback){

    //定义点击延迟时间
    var iDelayTime = 200;
    //判断手指是否移动 true移动 false点击
    var bMove = false;
    //开始时间
    var iStartTime = 0;

    //手指点击开始 记录点击开始时间 确定bMove的值是false
    elem.addEventListener('touchstart', function(){

        iStartTime = Date.now();
        bMove = false;

    });

    //手指移动事件触发, 手指真的移动了 bMove = true
    elem.addEventListener('touchmove', function(){

        bMove = true;

    });

    //手指抬起
    //1. 判断bMove的值 true 就是移动了, 直接return
    //2. 判断间隔事件 > 延迟时间 也算是移动了, 直接return
    //3. 就是点击事件了 执行回调中的内容
    elem.addEventListener('touchend', function(){
        //1
        if(bMove === true){

            return;

        }

        //2
        if( Date.now() - iStartTime > iDelayTime ){

            return

        }

        //3
        callback && callback();


    });


}
//清除过渡
var endTransition = function(elem){

    elem.style.webkitTransition = "";
    elem.style.transition = "";

}
//定义开始过渡函数
var startTransition = function(elem){

    elem.style.webkitTransition = "all 0.5s";
    elem.style.transition = "all 0.5s";

}
//变换
var setTransform = function(elem, translateY){

    elem.style.webkitTransform = "translateY(" + translateY + "px)";
    elem.style.transform = "translateY(" + translateY+ "px)";

}

//左侧移动
function listMove(){

    //获取header
    var oDivHeader = document.querySelector('#header');
    //header的高
    var iHeaderH = oDivHeader.offsetHeight;
    //获取移动的ul
    var oUlMove = document.querySelector('.left ul');
    //ul的高
    var iUlMoveH = oUlMove.offsetHeight;
    //body的高
    var iBodyH = document.body.offsetHeight;

    //console.log(document.body.offsetHeight);
    //console.log(iHeaderH);
    //console.log(oUlMove.offsetHeight);

    //最小移动距离
    //var iMinDistance = 0;
    //最大移动距离
    var iMaxDistance = iBodyH - iHeaderH - iUlMoveH;
    //延迟距离
    var iDelayDistance = 200;

    //手指点下的坐标
    var iDisY = 0;
    //手指移动的距离
    var iMoveY = 0;
    //oUlMove已经移动的距离
    var iMoveDistance = 0;


    //手指点下
    oUlMove.addEventListener('touchstart', function(e){

        iDisY = e.touches[0].clientY;

    });

    //手指移动
    oUlMove.addEventListener('touchmove', function(e){

        iMoveY = e.touches[0].clientY - iDisY;
        //上边最大移动距离
        if( (iMoveY + iMoveDistance) > iDelayDistance ) {

            iMoveY = 0;
            iMoveDistance = iDelayDistance

        }
        //下边最大移动距离
        else if( (iMoveY + iMoveDistance) < ( iMaxDistance - iDelayDistance ) ){

            iMoveY = 0;
            iMoveDistance = iMaxDistance - iDelayDistance;

        }

        //console.log(iMoveDistance);
        endTransition(oUlMove);
        setTransform(oUlMove, iMoveY + iMoveDistance);

    })

    //手指抬起
    oUlMove.addEventListener('touchend', function(e){

        iMoveDistance += iMoveY;

        if( iMoveDistance > 0 ){

            iMoveDistance = 0;

        }else if( iMoveDistance < iMaxDistance){

            iMoveDistance = iMaxDistance;

        }

        startTransition(oUlMove);
        setTransform(oUlMove, iMoveDistance);

    });

    var aLi = oUlMove.querySelectorAll('li');
    var iLiH = aLi[0].offsetHeight;
    var iLen = aLi.length;

    for(var i = 0; i < iLen; i++){

        aLi[i].dataset['index'] = i;
        //aLi.index = i;
    }

    isClick(oUlMove, function(e){

        var e = e || event;

        var oLiNow = e.target.parentNode;

        for(var i = 0; i < iLen; i++){

            aLi[i].className = '';

        }

        //console.log(e.target);
        oLiNow.className = 'current';

        var iClickDistance = -oLiNow.dataset['index']*iLiH;

        if( iClickDistance > 0 ){

            iClickDistance = 0;

        }else if( iClickDistance < iMaxDistance ){

            iClickDistance = iMaxDistance;

        }
        //console.log(iClickDistance);

        iMoveDistance = iClickDistance;

        startTransition(oUlMove);
        setTransform(oUlMove, iClickDistance);

    });


}

function rightMove(){

    //获取header
    var oDivHeader = document.querySelector('#header');
    //header的高
    var iHeaderH = oDivHeader.offsetHeight;
    //body的高
    var iBodyH = document.body.offsetHeight;
    //获取右侧div
    var oDivRight = document.querySelector('.right');
    //右侧div的高
    var oDivRightH = oDivRight.offsetHeight;
    //右侧div最大移动距离
    var iMaxDistance = iBodyH - iHeaderH - oDivRightH;
    //手指点下坐标
    var iDisY = 0;
    var iMoveY = 0;
    var iMoveDistance = 0;

    oDivRight.addEventListener('touchstart', function(e){

        iDisY = e.touches[0].clientY;

    });

    //手指移动
    oDivRight.addEventListener('touchmove', function(e){

        iMoveY = e.touches[0].clientY - iDisY;
        //上边最大移动距离
        if( (iMoveY + iMoveDistance) > 0 ) {

            iMoveY = 0;
            iMoveDistance = 0;

        }
        //下边最大移动距离
        else if( (iMoveY + iMoveDistance) < iMaxDistance ){

            iMoveY = 0;
            iMoveDistance = iMaxDistance;

        }

        //console.log(iMoveDistance);
        //endTransition(oDivRight);
        setTransform(oDivRight, iMoveY + iMoveDistance);

    })

    //手指抬起
    oDivRight.addEventListener('touchend', function(e){

        iMoveDistance += iMoveY;

        /*if( iMoveDistance > 0 ){

            iMoveDistance = 0;

        }else if( iMoveDistance < iMaxDistance){

            iMoveDistance = iMaxDistance;

        }

        startTransition(oDivRight);
        setTransform(oDivRight, iMoveDistance);*/

    })



}