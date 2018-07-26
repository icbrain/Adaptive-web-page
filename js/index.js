window.onload = function(){

    //在页面加载完毕后调用函数
    header();
    banner();
    downTime(5);
}

function header (){

    //获取头部盒子
    var oDivHeader = document.querySelector('#header > .header_box');
    //console.log(oDivHeader);
    //获取轮播盒子
    var oDivBanner = document.querySelector('#banner');
    //console.log(oDivBanner);
    //获取banner盒子的高度
    var iBannerH = oDivBanner.offsetHeight;
    //console.log(bannerH);
    var iOpcity = 0;

    window.onscroll = function(){
        //获取滚动距离
        var iTop = document.documentElement.scrollTop || document.body.scrollTop;
        //console.log(iTop);

        if(iTop < iBannerH){
            //随着滚动距离加大,iOpcity的值会增大 最大就是0.85
            iOpcity = iTop/iBannerH*0.85;

        }else{
            iOpcity = 0.85;
        }

        oDivHeader.style.backgroundColor = "rgba(201, 21, 35, "+ iOpcity +")"

    }

}

/*
轮播

1. 自动轮播 (定时器+过渡)
2. 点随着轮播图走,轮播图随着点走 (图片索引对应点索引);
3. 图片滑动 (touch事件)
4. 当不超过一定距离的时候 吸附回原位置 (一定距离可以自己控制 屏幕宽度 过渡 手指移动距离)
5. 当超过一定距离的时候 切换到上一张或者下一张 (一定距离可以自己控制 屏幕宽度 过渡 手指移动距离)

*/

function banner(){
    //获取banner盒子
    var oDivBanner = document.querySelector('#banner');
    //获取banner盒子的宽度 就是屏幕宽度
    var iWinW = oDivBanner.offsetWidth;
    //获取图片容器 ul:first-of-type
    var oUlImg = oDivBanner.querySelector('ul:first-of-type');
    //获取点的容器 ul:last-of-type
    var oUlPoint = oDivBanner.querySelector('ul:last-of-type');
    //获取所有的点 ul:last-of-type > li
    var aLiPoints  = oUlPoint.querySelectorAll('li');
    //点的个数
    var iLen = aLiPoints.length;
    //定义定时器
    var timer = null;
    //图片索引
    var index = 1;
    //定义结束过渡函数
    var endTransition = function(){

        oUlImg.style.webkitTransition = "";
        oUlImg.style.transition = "";

    }
    //定义开始过渡函数
    var startTransition = function(){

        oUlImg.style.webkitTransition = "all 0.5s";
        oUlImg.style.transition = "all 0.5s";

    }
    //变换
    var setTransform = function(translateX){

        oUlImg.style.webkitTransform = "translateX(" + translateX + "px)";
        oUlImg.style.transform = "translateX(" + translateX+ "px)";

    }

    var setPoints = function(){

        for(var i = 0; i < iLen; i++){
            aLiPoints[i].className = '';
        }
        aLiPoints[index - 1].className = "current";

    }

    setTransform(-index*iWinW);
    timer = setInterval(function(){

        index++;
        /* 定位 控制left的值 */
        /* 现在我们用过渡 */
        startTransition();

        setTransform(-index*iWinW);
         //以下内容放到过渡结束中处理
         // if(index >= 9){
         //    index = 1;
         //    /* 关闭过渡 */
         //    oUlImg.style.webkitTransition = "";
         //    oUlImg.style.transition = "";
         //    oUlImg.style.webkitTransform = "translateX(" + -index*iWinW + "px)";
         //    oUlImg.style.transform = "translateX(" + -index*iWinW + "px)";
         // }
         // if(index == 9){
         //    aLiPoints[iLen-1].className = '';
         //    aLiPoints[0].className = 'current';
         // }else{
         //     for(var i = 0; i < iLen; i++){
         //        aLiPoints[i].className = '';
         //     }
         //     aLiPoints[index - 1].className = "current";
         // }

    },1000);

    //过渡结束处理index的值
    transitionEnd(oUlImg, function(){

        //console.log("123");
        if(index >= 9){

            index = 1;
            //结束过渡
            endTransition();
            //改变位置
            setTransform(-index*iWinW);

        }else if(index <= 0){

            index = 8;
            //结束过渡
            endTransition();
            //改变位置
            setTransform(-index*iWinW);

        }

        setPoints();

    })

    //添加手指事件
    //1. 记录手指点下的x位置
    //2. 计算手指移动的距离 同时图片按照距离做变换
    //3. 抬起手指 计算移动距离 内容同上边要求 4 -5

    //touchstart 手指按下
    //touchmove  手指移动
    //touchend   手指抬起

    //手指点下的坐标
    var iDisX = 0;
    //手指移动的距离 = 移动位置的坐标 - 手指点下的坐标
    var iMoveX = 0;
    //最大移动距离
    //如果比最大移动距离小吸附回去
    //如果比最大移动距离大下一张图片
    var iMaxDistace = iWinW/3;


    //手指点下事件
    oUlImg.addEventListener('touchstart', function(e){

        //手指按下第一件事 清除timer
        clearInterval(timer);
        //关闭过渡
        endTransition();

        //记录手指点击的x轴位置
        iDisX = e.touches[0].clientX;
        //console.log(iDisX);
    });

    //手指移动事件
    oUlImg.addEventListener('touchmove', function(e){

        //计算移动的距离 可正可负
        iMoveX = e.touches[0].clientX - iDisX;
        //让图片移动这么多距离
        setTransform(-index*iWinW + iMoveX);
        console.log(iMoveX);
    })

    //吸附效果
    //1. 移动距离够 判断 iMoveX的绝对值 比 iMaxDistace 大
    //      1. 往前走
    //      iMoveX 负
    //      2. 往后走
    //      iMoveX 正

    //手指抬起事件
    oUlImg.addEventListener('touchend', function(e){

        if( Math.abs(iMoveX) > iMaxDistace ){

            //切换一张图片
            //1. 往前走
            if( iMoveX < 0 ){

                index++;

            }
            //2. 往后走
            else{

                index--;

            }

            //开启过渡
            startTransition();

            //设置变换位置
            setTransform(-index*iWinW);

        }else{

            //吸附回去
            //位置退回原位置

            //开启过渡
            startTransition();

            //设置变换位置
            setTransform(-index*iWinW);

        }

        //开启自动轮播
        timer = setInterval(function(){

            //index值累加
            index++;
            //console.log(index);
            //开启过渡
            startTransition();

            //设置变换位置
            setTransform(-index*iWinW);

         }, 1000)

    })

}
//过渡结束函数 elem调用元素 callback回调函数
function transitionEnd(elem, callback){

    elem.addEventListener('webkitTransitionEnd', function(){

        /*if(callback){
            callback();
        }*/

        callback && callback(); // e || event

    });
    elem.addEventListener('transitionEnd', function(){

        callback && callback();

    });

}


/* 倒计时 */

function downTime(num){
    //num是小时  转为秒数=>time
    var time = num*60*60;
    //计时器变量
    var timer = null;
    //获取放时间的盒子
    //var oDivTime = document.querySelector('.kill_time');
    //获取所有的span元素 放时间的
    //var aSpanTime = oDivTime.querySelectorAll('span');
    //获取所有存放时间的li
    var aLiTime = document.querySelectorAll('.main_content:nth-child(1) .content_top li');

    timer = setInterval(function(){
        //如果时间变为0了就清除计时器,停止函数运行
        time--;

        if(time <= 0){

            clearInterval(timer);
            return false;

        }

        //格式化时间
        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = time%60;

        //console.log("小时:" + h);
        //console.log("分钟:" + m);
        //console.log("秒:" + s);

        aLiTime[0].innerHTML = Math.floor(h/10);
        aLiTime[1].innerHTML = h%10;

        aLiTime[3].innerHTML = Math.floor(m/10);
        aLiTime[4].innerHTML = m%10;

        aLiTime[6].innerHTML = Math.floor(s/10);
        aLiTime[7].innerHTML = s%10;

    }, 1000);

}