var nums = new Array();
var score = 0;
var hasConflited = new Array(); //用于解决单元格重复叠加问题
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


$(function() {
    newgame();
    $("#newGame").click(function newgame() {
        init();
        generateOneNumber();
        generateOneNumber();
    });
});



//开始新游戏
function newgame() {
    if (documentWidth>500) {
        containerWidth = 500;
        cellWidth = 100;
        cellSpace = 20;
    } else {
        setForMobile();
    }
    init();
    generateOneNumber();
    generateOneNumber();
}

//设置移动端尺寸
function setForMobile() {
    $("#header").css("width",containerWidth);
    $("#container").css("width",containerWidth-cellSpace*2);
    $("#container").css("height",containerWidth-cellSpace*2);
    $("#container").css("padding",cellSpace);
    $("#container").css("border-radius",containerWidth*0.02);
    $(".grid-cell").css("width",cellWidth);
    $(".grid-cell").css("height",cellWidth);
    $(".grid-cell").css("border-radius",cellWidth*0.06);
}

//初始化页面
function init() {
    //初始化下层单元格位置
    for (var i=0;i<4;i++) {
        for (var j=0;j<4;j++) {
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i));
            gridCell.css("left",getPosLeft(j));
        }
    }

    //初始化数组
    for (var i=0;i<4;i++) {
        nums[i] = new Array();
        hasConflited[i] = new Array();
        for (var j=0;j<4;j++) {
            nums[i][j] = 0;
            hasConflited[i][j] = false; //false代表没有叠加过，true反之
        }
    }

    updateView();

    score = 0;
    updateScore(score);
}

//动态创建上层单元格并初始化
function updateView() {
    $(".number-cell").remove();
    for (var i=0;i<4;i++) {
        for (var j=0;j<4;j++) {
            $("#container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var numberCell = $("#number-cell-"+i+"-"+j);           
            if (nums[i][j]==0) {
                numberCell.css("width","0px");
                numberCell.css("height","0px");
                numberCell.css("top",getPosTop(i)+cellWidth*0.5);
                numberCell.css("left",getPosLeft(j)+cellWidth*0.5);
            } else {
                numberCell.css("width",cellWidth);
                numberCell.css("height",cellWidth);
                numberCell.css("top",getPosTop(i));
                numberCell.css("left",getPosLeft(j));
                numberCell.css("background-color",getNumberBackgroundColor(nums[i][j]));
                numberCell.css("color",getNumberColor(nums[i][j]));
                numberCell.text(nums[i][j]);
            }
            hasConflited[i][j] = false;

            $(".number-cell").css("border-radius",cellWidth*0.06);
            if(nums[i][j]>=16) {
                //$("#number-cell-"+i+"-"+j).addClass("smallerSize");
                $("#number-cell-"+i+"-"+j).css("font-size",cellWidth*0.3);
            } else {
                $("#number-cell-"+i+"-"+j).css("font-size",cellWidth*0.5);
            }
            //$(".number-cell").css("font-size",cellWidth*0.5);
            $(".number-cell").css("line-height",cellWidth+"px");

            
        }
    }
}

/*
    在随机的单元格中生成一个随机数
    1.在空余的单元格中随机找一个
    2.随机产生一个2或4
*/
function generateOneNumber() {
    //判断是否还有空单元格，如果没有就直接返回
    if (noSpace(nums)) {
        return;
    }
    //随机选取一个位置
    var temp = new Array();
    var count = 0;
    for (var i=0;i<4;i++) {
        for (var j=0;j<4;j++) {
            if (nums[i][j]==0) {
                temp[count] = i*4+j;
                count++;
            }
        }
    }
    var pos = Math.floor(Math.random()*count);
    var randx = Math.floor(temp[pos]/4);
    var randy = temp[pos]%4;
    //随机取一个数字
    //nums[randx][randy] = Math.random()<0.5 ? 2 : 4;
    var randNum = Math.random()<0.5 ? 2 : 4;
    //在随机位置上显示随机数字
    nums[randx][randy] = randNum;
    showNumberWithAnimation(randx,randy,randNum);
}

//实现键盘响应
$(document).keydown(function(event) {
    //阻止事件的默认动作（阻止键盘控制滚动条上下移动）
    event.preventDefault()

    switch(event.keyCode) {
        case 37: //left
            //判断是否可以向左移动
            if (canMoveLeft(nums)) {
                moveLeft();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
            break;
        case 38: //up
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
            break;
        case 39: //right
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
            break;
        case 40: //down
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
            break;
    }
});

//实现触摸滑动响应
document.addEventListener("touchstart",function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener("touchend",function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    //判断滑动的方向
    var deltax = endx - startx;
    var deltay = endy - starty;
    //给滑动距离设置阈值，小于阈值不做操作
    if (Math.abs(deltax)<documentWidth*0.08 && Math.abs(deltay)<documentWidth*0.08) {
        return;
    }
    if (Math.abs(deltax)>Math.abs(deltay)) { //水平方向滑动
        if (deltax>0) { //向右滑动
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        } else { //向左滑动
            if (canMoveLeft(nums)) {
                moveLeft();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }
    } else { //垂直方向滑动
        if (deltay>0) { //向下滑动
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        } else { //向上滑动
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }
    }
});

/*
    向左移动
    需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
    1.落脚点没有数字，并且移动路径中没有障碍物
    2.落脚点的数字和自己相同，并且移动路径中没有障碍物
*/
function moveLeft() {
    for (var i=0;i<4;i++) {
        for (var j=1;j<4;j++) {
            if (nums[i][j]!=0) {
                for (var k=0;k<j;k++) {
                    if (nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)) {
                        //移动操作
                        showMoveAnimation(i,j,i,k);
                        nums[i][k] = nums[i][j];
                        nums[i][j] = 0;
                        break;
                    } else if (nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflited[i][k]) {
                        showMoveAnimation(i,j,i,k);
                        nums[i][k] += nums[i][j];
                        nums[i][j] = 0;
                        score += nums[i][k];
                        updateScore(score);
                        hasConflited[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateView,200);
}
function moveRight() {
    for (var i=0;i<4;i++) {
        for (var j=2;j>=0;j--) {
            if (nums[i][j]!=0) {
                for (var k=3;k>j;k--) {
                    if (nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)) {
                        showMoveAnimation(i,j,i,k);
                        nums[i][k] = nums[i][j];
                        nums[i][j] = 0;
                        break;
                    } else if (nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasConflited[i][k]) {
                        showMoveAnimation(i,j,i,k);
                        nums[i][k] += nums[i][j];                        
                        nums[i][j] = 0;
                        score += nums[i][k];
                        updateScore(score);
                        hasConflited[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateView,200);
}
function moveUp() {
    for (var j=0;j<4;j++) {
        for (var i=1;i<4;i++) {
            if (nums[i][j]!=0) {
                for (var k=0;k<i;k++) {
                    if (nums[k][j]==0 && noBlockVertical(k,i,j,nums)) {
                        showMoveAnimation(i,j,k,j);
                        nums[k][j] = nums[i][j];
                        nums[i][j] = 0;
                        break;
                    } else if (nums[k][j]==nums[i][j] && noBlockVertical(k,i,j,nums) && !hasConflited[k][j]) {
                        showMoveAnimation(i,j,k,j);
                        nums[k][j] += nums[i][j];                       
                        nums[i][j] = 0;
                        score += nums[k][j];
                        updateScore(score);
                        hasConflited[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateView,200);
}
function moveDown() {
    for (var j=0;j<4;j++) {
        for (var i=2;i>=0;i--) {
            if (nums[i][j]!=0) {
                for (var k=3;k>i;k--) {
                    if (nums[k][j]==0 && noBlockVertical(i,k,j,nums)) {
                        showMoveAnimation(i,j,k,j);
                        nums[k][j] = nums[i][j];
                        nums[i][j] = 0;
                        break;
                    } else if (nums[k][j]==nums[i][j] && noBlockVertical(i,k,j,nums) && !hasConflited[k][j]) {
                        showMoveAnimation(i,j,k,j);
                        nums[k][j] += nums[i][j];
                        nums[i][j] = 0;
                        score += nums[k][j];
                        updateScore(score);
                        hasConflited[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateView,200);
}