//获取移动端尺寸
//window.screen.availWidth;  获取屏幕宽度
var documentWidth = document.documentElement.clientWidth; //获取页面DOM宽度
var containerWidth = documentWidth*0.92; //容器宽度
var cellWidth = documentWidth*0.18; //单元格宽度
var cellSpace = documentWidth*0.04; //单元格间距

function getPosTop(i) {
    return cellSpace+(cellWidth+cellSpace)*i;
}

function getPosLeft(j) {
    return cellSpace+(cellWidth+cellSpace)*j;
}

function getNumberBackgroundColor(num) {
    switch(num){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67c5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
		case 4096:return "#a6c";break;
		case 8192:return "#93c";break;
	}
}

function getNumberColor(num) {
    if (num < 5) {
        return "#776e65";
    } else {
        return "#fff";
    }
}

function noSpace(nums) {
	for (var i=0;i<4;i++) {
		for (var j=0;j<4;j++) {
			if (nums[i][j]==0) {
				return false;
			}
		}
	}
	return true;
}

function canMoveLeft(nums) {
	for (var i=0;i<4;i++) {
		for (var j=1;j<4;j++) {
			if (nums[i][j]!=0) {
				if (nums[i][j-1]==0 || nums[i][j-1]==nums[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

//判断水平方向上是否有障碍物
function noBlockHorizontal(row,col1,col2,nums) {
	for (var i=col1+1;i<col2;i++) {
		if (nums[row][i]!=0) {
			return false;
		}
	}
	return true;
}
function noBlockVertical(row1,row2,col,nums) {
	for (var i=row1+1;i<row2;i++) {
		if (nums[i][col]!=0) {
			return false;
		}
	}
	return true;
}

function updateScore(score) {
	$("#scoreNum").text(score);
}

function canMoveRight(nums) {
	for (var i=0;i<4;i++) {
		for (var j=0;j<3;j++) {
			if (nums[i][j]!=0) {
				if (nums[i][j+1]==0 || nums[i][j+1]==nums[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveUp(nums) {
	for (var i=1;i<4;i++) {
		for (var j=0;j<4;j++) {
			if (nums[i][j]!=0) {
				if (nums[i-1][j]==0 || nums[i-1][j]==nums[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveDown(nums) {
	for (var i=0;i<3;i++) {
		for (var j=0;j<4;j++) {
			if (nums[i][j]!=0) {
				if (nums[i+1][j]==0 || nums[i+1][j]==nums[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

//判断游戏是否结束，两个条件：1.没有空格；2.不能移动
function noMove(nums) {
	if (canMoveLeft(nums) || canMoveRight(nums) || canMoveUp(nums) || canMoveDown(nums)) {
		return false;
	}
	return true;
}
function isGameOver() {
	if (noSpace(nums) && noMove(nums)) {
		alert("Game Over!");
	}
}