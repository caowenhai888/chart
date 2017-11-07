/**
 * Created by caowenhai on 16/5/3.
 */




var chartDate =   [
    {
        week:'wekk1',
        max:3000,
        real:3000,
        thisWeek:0 // 是否本周 1,0
    },
    {
        week:'wekk2',
        max:2000,
        real:1000,
        thisWeek:0
    },
    {
        week:'wekk3',
        max:1000,
        real:0,
        thisWeek:4
    },
    {
        week:'wekk3',
        max:1000,
        real:0,
        thisWeek:1
    }
];

var data = null;

try{
    data =  weekDate;

}catch (e) {
    data = chartDate;
}


/**
 * 扩展 CanvasRenderingContext2D  rundReact 封装 圆角矩形方法
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r 半径
 * @returns {CanvasRenderingContext2D} 返回值2d画布对象
 */

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {

    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    this.beginPath();

    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    // this.arcTo(x+r, y);

    this.closePath();

    return this;
}

var chart = {

    dpi : window.devicePixelRatio,
    coordinates : [],
    chart : document.getElementById('chart').getContext('2d'),
    init:function () {

        var __chart = document.getElementById('chart');

        var w = document.body.offsetWidth;

        var c_w = w;

        var c_h = 270;



        this.tableHeight = (200) * 2;
        this.width = __chart.width = c_w * 2;
        this.height = __chart.height = c_h * 2;

        __chart.style.width = c_w + 'px';
        __chart.style.height =  c_h + 'px';

        var  _this = this;

        chart.animation(function () {

            _this.drawTopCircle();
            _this.drawTopFont();

        },function () {

            _this.drawTooltips();

        });

    },

    lenged : 5,

    yLineLend : 4,

    xLineLend : 7,

    topLine : 90,

    radius : 15,

    beyondH :107,//超出高度范围值

    currentHeight : function (data) {

        return this.tableHeight - ~~(data.real/data.max*this.tableHeight)+this.topLine;

    },

    loadImage : function (url, callback,x,y) {
        var img = new Image();
        img.src = url;

        if (img.complete) {

            callback(img,x,y);
            return;
        }

        img.onload = function () {

            callback(img,x,y);

        };

    },

    currentWidth : function (i) {
        return ~~(this.width/5*(i+1));
    },

    draw : function (fn,afterFn) {

        this.chart.clearRect(0, 0, this.width, this.height);
        this.drawTable();

        fn&&fn();

        this.drawimg();
        this.drawCircle();

        /**
         * 动画结束后,后置回调
         */
        afterFn&&afterFn();
    },

    drawTooltips: function () {

        var chart = this.chart;

        chart.lineWidth = 3;

        for (var i = 0; i < this.coordinates.length;i++){

            var x = this.coordinates[i]['x'];
            var y = this.coordinates[i]['y'];
            console.log(y-this.topLine)

            chart.fillStyle = 'rgba(255,255,255,1)';
            if(y-this.topLine < this.beyondH &&  y-this.topLine!=0){
                y+=100;
                chart.fillStyle = 'rgba(255,255,255,0.6)';
            }


            chart.beginPath();


            chart.strokeStyle = '#feb137';

            if(data[i].real!=0){

                chart.roundRect( x-54, y-28-28-24, 54*2, 28*2, 5 );

            }

            chart.stroke();
            chart.fill();
            chart.closePath();

        }

        for (var i = 0; i < this.coordinates.length;i++){

            var x = this.coordinates[i]['x'];
            var y = this.coordinates[i]['y'];
            if(y-this.topLine < this.beyondH &&  y-this.topLine!=0){
                y+=100;
            }

            chart.beginPath()

            chart.textAlign = 'center'
            chart.font = 'normal 40px Arial';
            chart.fillStyle='#ffae00'
            console.log(data[i].real ,'ss11')

            if(data[i].real == 0 ){


                if(data[i].thisWeek==1){

                    var _x = x,
                        _y = y;

                    this.loadImage('./images/icon_question.png',function ( img, x, y ) {

                        var w = 74,h=70;

                        chart.drawImage(img,x-(w/2),y-(h+15),w,h);

                    }, x, y);

                }

            }else {

                chart.fillText( data[i].real, x, y-38 );

            }

            chart.closePath();
        }
    },

    drawTopCircle : function () {

        for (var i =0; i<data.length;i++){

            var x = this.currentWidth(i);
            var y = this.topLine ;

            this.chart.beginPath();

            this.chart.strokeStyle = '#000'
            this.chart.fillStyle = '#fff';
            this.chart.lineWidth = 14;
            this.chart.arc(x,y,this.radius,0,2*Math.PI);
            this.chart.stroke();
            this.chart.fill();

            this.chart.closePath();
        }

    },

    drawTopFont : function () {

        for (var i =0; i<data.length;i++){

            var x = this.currentWidth(i);
            var y = this.topLine-35 ;

            this.chart.textAlign = 'center'
            this.chart.font = 'normal 40px Arial';
            this.chart.fillStyle='#444'
            this.chart.fillText(data[i].max,x,y)

        }

    },

    drawTable : function () {

        var chart = this.chart;
        var w = this.width;
        var h = this.height;

        chart.strokeStyle = '#cdc9c9';
        chart.lineWidth = 1;

        for(var i =1 ;i<this.lenged;i++){

            chart.moveTo((w/5*(i)) ,this.topLine);
            chart.lineTo((w/5*(i)) ,h);
        }
        chart.stroke();

        for(var i =0 ;i<this.xLineLend;i++){

            chart.lineWidth = 1;
            chart.moveTo( 0,((this.tableHeight/6)*(i))+this.topLine);
            chart.lineTo(w, ((this.tableHeight/6)*(i))+this.topLine);
        }
        chart.stroke();


    },

    drawCircle : function () {
        this.coordinates = [];

        for (var i =0; i<data.length;i++){

            var x = this.currentWidth(i);
            var y = this.currentHeight(data[i])
            this.coordinates.push({x:x,y:y,id:i}); //储存坐标添

            this.chart.beginPath();

            this.chart.fillStyle = '#fff';
            this.chart.lineWidth = 14;
            this.chart.arc(x,y,this.radius,0,2*Math.PI);
            this.chart.stroke();
            this.chart.fill();

            this.chart.closePath();
        }

    },

    drawimg:function () {


        var chart = this.chart;
        chart.fillStyle = 'rgba(254,177,55,0.4)';
        chart.strokeStyle = "rgba(254,177,55,1)";
        chart.lineWidth = 5;
        chart.beginPath();
        var l = data.length + 1;
        var width = this.width;
        var height = this.tableHeight+this.topLine;

        var old_X,old_Y,m_X1,m_Y1, m_X2,m_Y2, X = 0, Y =  height;
        chart.moveTo(0,height);

        for( var i =0; i<data.length;i++){

            old_X = X;
            old_Y = Y;

            X =  this.currentWidth(i);
            Y  = this.currentHeight(data[i]);

            if(old_Y == Y){
                chart.lineTo(X,Y);

            }else {

                m_X1 = ~~((X+old_X)/2);
                m_Y1 = old_Y-1;
                m_X2 = ~~((X+old_X)/2);
                m_Y2 = Y+1;
                chart.bezierCurveTo(
                    m_X1,
                    m_Y1,
                    m_X2,
                    m_Y2,
                    X,
                    Y
                );
            }

        }

        old_X = X;
        old_Y = Y;

        X = width;
        Y = height;
        if(old_Y == Y){

            chart.lineTo(X,Y)

        }else {

            m_X1 = ~~((X+old_X)/2);
            m_Y1 = old_Y-1;
            m_X2 = ~~((X+old_X)/2);
            m_Y2 = Y+1;
            chart.bezierCurveTo(
                m_X1,
                m_Y1,
                m_X2,
                m_Y2,
                X,
                Y
            );
        }

        chart.stroke();
        chart.lineTo(0, height);

        chart.closePath();

        chart.fill();


    },

    counter : 20,

    animation : function (fn,afterFn) {

        fn  = fn || function () {};

        var that = this;
        var datas = (new Function('return '+JSON.stringify(data) ) )();

        function resizedata(rata){
            var temp = (new Function('return '+JSON.stringify(datas) ) )();
            for (var i in temp)
            {
                temp[i]['real'] *= rata;
            }
            return temp;
        }

        var i = 100;
        var arr = [];
        var j = 0;
        var tmp;

        while(1){
            tmp = Math.ceil((i - j)/6);
            if(tmp!=0){
                j += tmp;
                arr.push(j);
            }else{
                break;
            }
        }

        j = 0;//计数器

        function run(){
            data = resizedata(arr[j]/i);
            if(j<arr.length){
                var s = null;
                var k = null;
                if(j<arr.length-1){
                    that.draw(s,k);
                    timehelper = setTimeout(run,60);
                }else{
                    s = fn;
                    k = afterFn;
                    that.draw(s,k);
                }
                j++;
            }
        }
        run();
    },

    point : function (x,y,fn) {

        for(var i=0;i<this.coordinates.length;i++){

            var c_x = Math.abs( x - chart.coordinates[i]['x'] );
            var c_y = Math.abs( y - chart.coordinates[i]['y'] );
            if(c_x <= chart.radius && c_y<= chart.radius){
                fn&&fn(chart.coordinates[i]);
                return true;
            }
        }

        return false;
    }
}

chart.init();

document.getElementById('chart').addEventListener('click',function (e) {

    var x = (e.pageX - this.offsetLeft) * chart.dpi;
    var y = (e.pageY - this.offsetTop) * chart.dpi;
    chart.point(x,y,function (data) {
        console.log(data,'data')
    })

},true);
