// let WINDOW_WIDTH = document.body.clientWidth;
// let WINDOW_HEIGHT = document.body.clientHeight;
let WINDOW_WIDTH = document.documentElement.clientWidth
let WINDOW_HEIGHT = document.documentElement.clientHeight
let MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
let MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
let RADIUS = Math.round(WINDOW_WIDTH*4/5/108-1);

// let endTime = new Date()
////倒计时一小时，毫秒为单位
// endTime.setTime(endTime.getTime()+3600*1000)


//初始化当前时间的秒数为0
let curShowTimeSeconds = 0
//初始化新彩色小球为空数组
let balls = []
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

/*----------------------初始化----------------------------*/

window.onload = function(){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds()
    setInterval(() =>{
        render( context )
        update()
    },50)
}
/*----------------------1、倒计时剩余时间函数----------------------------*/

// function getCurShowTimeSeconds(){
// //获取当前时间
//   let curTime = new Date()
//   //倒计时剩余时间
//   let ret = endTime.getTime() - curTime.getTime()
//   //将毫秒数转化为正整秒数
//   ret = Math.round(ret/1000)
//   return ret? ret : 0


// }
/*----------------------2、时钟函数---------------------------*/

function getCurShowTimeSeconds(){
//获取当前时间
  let curTime = new Date()
  let ret = curTime.getHours()*3600 +curTime.getMinutes()*60 + curTime.getSeconds()

  return ret


}
/*------------------动画更新--------------------------------*/
function update(){
    //获取下次动画时间
    let nextShowTimeSeconds = getCurShowTimeSeconds()
    let nextHours = parseInt(nextShowTimeSeconds/3600)
    let nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60)
    let nextSeconds = nextShowTimeSeconds % 60

    let curHours = parseInt(curShowTimeSeconds/3600)
    let curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60)
    let curSeconds = curShowTimeSeconds % 60
//检测时间变化
    if(nextSeconds !== curSeconds ){
        if(parseInt(curHours/10) !== parseInt(nextHours/10)){
            //时间一变，就生成小球
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10))
        }
         if( parseInt(curHours%10) !== parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) !== parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) !== parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) !== parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) !== parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        curShowTimeSeconds = nextShowTimeSeconds
    }
    updateBalls()
}
/*------------------小球更新函数--------------------------------*/

function updateBalls(){
    for (let i = 0,len = balls.length; i< len; i++){
        balls[i].x += balls[i].vx
        balls[i].y += balls[i].vy
        balls[i].vy +=balls[i].g

        //碰撞检测
        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS
            //y轴获取相反方向的速度
            balls[i].vy = -balls[i].vy*0.75
        }
    }
    balls.filter((item) =>{
        return item.x-RADIUS >0 && item.x+RADIUS < WINDOW_WIDTH
    })

}
/*------------------小球生成函数--------------------------------*/

function addBalls(x,y,num){
    for (let i = 0,len = digit[num].length;i<len;i++){
        for (let j = 0,jlen = digit[num][i].length; j<jlen;j++){
            //遍历digits位置，为1就添加小球
            if(digit[num][i][j] == 1){
                let aball = {
                    x:x+ j*2*(RADIUS + 1) + RADIUS+1,
                    y:y+ i*2*(RADIUS + 1) + RADIUS+1,
                    //小球加速度
                    g:1.5 + Math.random(),
                    //x轴速度，使之为-4||4
                    vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    //y轴速度
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]

                }
                balls.push(aball)
            }
        }
    }

}

function render( cxt ){
    //对矩形画框进行刷新，否则画面会重叠
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
    let hours = parseInt(curShowTimeSeconds/3600)
    let minutes = parseInt((curShowTimeSeconds-hours*3600)/60)
    let seconds = curShowTimeSeconds % 60

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
    //小球绘制
    for(let i = 0, len = balls.length; i < len; i++){
        cxt.fillStyle = balls[i].color
        cxt.beginPath()
        cxt.arc(balls[i].x,balls[i].y,RADIUS, 0, 2*Math.PI,true)
        cxt.closePath()
        cxt.fill()
    }
}
/*----------------------canvas渲染数字函数----------------------------*/
function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "rgb(0,102,153)";

    for( let i = 0 ; i < digit[num].length ; i ++ )
        for(let j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                /*第i行第j个圆的圆心坐标
                x=x+j*2*(RADIUS+1)+(RADIUS+1)
                y=y+i*2*(RADIUS+1)+(RADIUS+1)
                */
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                cxt.closePath()

                cxt.fill()
            }
}

