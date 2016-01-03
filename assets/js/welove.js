/**
 * Created by XFun on 2016/1/3.
 */
var initImgs = 30;/* 初始化总需要加载的图片数*/
var imgLoadCount = 0; /* 这个是计数器，现在这个计数器是0 */

window.onload = function(){
    initData(initImgs);
    var onceScroll = 10;
    var onceScrollBase = 31;
    var scrollEnd = false;
    window.onscroll = function(){
        if(checkScrollSlide() && !scrollEnd){
            var oParent = document.getElementById('main');
            var newImgs = [];
            // 将数据块渲染到当前页面的尾部
            for(var i = onceScrollBase; i < onceScrollBase + onceScroll; i++){
                if(i > 81){
                    scrollEnd = true;
                    return false;
                }
                var oBox = document.createElement('div');
                oBox.className = 'box';
                oParent.appendChild(oBox);
                var oPic = document.createElement('div');
                oPic.className = 'pic';
                oBox.appendChild(oPic);
                var oImg = document.createElement('img');
                oImg.src = "assets/img/welove/welove_" + i + ".jpg";
                newImgs.push(oImg);
                oPic.appendChild(oImg);
            }
            onceScrollBase = onceScrollBase + onceScroll;

            console.log("newImgs.length-" + newImgs.length)
            for(var i = 0; i < newImgs.length; i++){
                loadCount(newImgs[i]);
            }
            var timer = setInterval(function() {
                if (imgLoadCount == (onceScrollBase - 1)) {
                    waterfall('main', 'box');
                    clearInterval(timer)
                }
            }, 100)
        }
    }
};

// 初始化数据
function initData(initImgs){
    var oParent = document.getElementById('main');
    // 将数据块渲染到当前页面的尾部
    for(var i = 1; i <= initImgs; i++){
        var oBox = document.createElement('div');
        oBox.className = 'box';
        oParent.appendChild(oBox);
        var oPic = document.createElement('div');
        oPic.className = 'pic';
        oBox.appendChild(oPic);
        var oImg = document.createElement('img');
        oImg.className = 'loveimg';
        oImg.src = "assets/img/welove/welove_" + i + ".jpg";
        oPic.appendChild(oImg);
    }

    var oImgs = getByClass(oParent,'loveimg');
    for(var i = 0; i < oImgs.length; i++){
        loadCount(oImgs[i]);
    }

    var timer = setInterval(function() {
        if (imgLoadCount == initImgs) {
            waterfall('main', 'box');
            clearInterval(timer)
        }
    }, 100)
}

function loadCount(img){
    loadImage(img, function(){
        imgLoadCount++;
    });
}

function loadImage(img, callback) {
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
        callback(img);
        return; // 直接返回，不用再处理onload事件
    }else{
        img.onload = function () { //图片下载完毕时异步调用callback函数。
            callback(img);
        };
    }
}

function waterfall(parent,box){
    //将main下的所有class为box的元素取出来
    var oParent = document.getElementById(parent);
    var oBoxs = getByClass(oParent,box);
    //计算整个页面显示的列数(页面宽/box的宽)
    var oBoxW = oBoxs[0].offsetWidth;
    var cols = Math.floor(document.documentElement.clientWidth/oBoxW);
    // 设置main的宽度
    oParent.style.cssText = 'width:' + oBoxW * cols + "px;margin:0 auto";
    var hArr = []; // 存放每一列高度的数组
    for(var i = 0; i < oBoxs.length; i++){
        if(i < cols){
            hArr.push(oBoxs[i].offsetHeight);
        }else{
            var minH = Math.min.apply(null, hArr);
            var minhIndex = getMinhIndex(hArr, minH);
            oBoxs[i].style.position = 'absolute';
            oBoxs[i].style.top = minH + 'px';
            oBoxs[i].style.left = oBoxW * minhIndex + 'px';
            //oBoxs[i].style.left = oBoxs[minhIndex].offsetLeft + 'px';
            hArr[minhIndex] += oBoxs[i].offsetHeight;
        }
    }
}

//根据class获取元素
function getByClass(parent, clsName){
    var boxArr = new Array(), // 用来存储获取到的所有class为box的元素
        oElements = parent.getElementsByTagName('*');
    for(var i = 0; i < oElements.length; i++){
        if(oElements[i].className == clsName){
            boxArr.push(oElements[i]);
        }
    }
    return boxArr;
}

// 计算出数组中最小值的索引
function getMinhIndex(arr, val){
    for(i in arr){
        if(arr[i] == val){
            return i;
        }
    }
}

//检测是否具备滚动条加载数据的条件
function checkScrollSlide(){
    var oParent = document.getElementById('main');
    var oBoxs = getByClass(oParent, 'box');
    var lastBoxH = oBoxs[oBoxs.length - 1].offsetTop + Math.floor(oBoxs[oBoxs.length - 1].offsetHeight / 2);
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.body.clientHeight || document.documentElement.clientHeight;
    return lastBoxH < scrollTop + height;
}
