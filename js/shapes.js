function Cell(r,c,img){
	this.r = r; //行下标
	this.c = c; //列下标
	this.img = img; //图片路径
}
//Shape类型构造函数，描述所有图形的属性和方法
function Shape(orgi) {
	this.orgi = orgi;
	// console.log(this.orgi);
	this.statei = 0;
}

Shape.prototype = {
	IMGS: {
		O: "img/O.png", S: "img/S.png", L: "img/L.png", 
		I: "img/I.png", J: "img/J.png", Z: "img/Z.png", T: "img/T.png"
	},

	moveDown: function() {
		for(var i = 0; i < this.cells.length; this.cells[i++].r++);
			// console.log(this.cells.r);
	},
	moveLeft: function() {
		for(var i = 0; i < this.cells.length; this.cells[i++].c--);
	},
	moveRight: function() {
		for(var i = 0; i < this.cells.length; this.cells[i++].c++);
	},

	rotateR: function() { //向右转，切换到下一个state
		this.statei++;
		this.statei == this.states.length && (this.statei = 0);
		this.rotate();
	},
	rotateL: function() { //向左转，切换到上一个state
		this.statei--;
		this.statei == -1 && (this.statei = this.states.length-1);
		this.rotate();
	},
	//根据当前state的数据，计算图形中每个格的r和c
	rotate: function() {
		//从当前图形的states数组中获得statei位置的状态，保存在变量state中
		var state = this.states[this.statei];
		//[{r: -1, c: 0}, {r: 0, c: 0}, {r: +1, c: 0}, {r: 0, c: -1}]
		//获得shape中参照格
		var orgCell = this.cells[this.orgi];

		//遍历当前图形中的cell数组（i）
		for(var i = 0; i < this.cells.length; i++) {
			//将当前格的r设置为参照格r+state中i位置的对象的r
			// console.log(state[i].r);
			// console.log(orgCell.r);
			
			this.cells[i].r = orgCell.r + state[i].r;
			//将当前格的c设置为参照格c+state中i位置的对象的c
			this.cells[i].c = orgCell.c + state[i].c;
		}
	}
}

//每种图形类型的对象
function O(){
	Shape.call(this, 0);//借用父类型构造函数
	this.cells = [
		new Cell(0, 4, this.IMGS.O),
		new Cell(0, 5, this.IMGS.O),
		new Cell(1, 4, this.IMGS.O),
		new Cell(1, 5, this.IMGS.O)
	];
	this.states = [
		State(0,0, 0,+1, +1,0, +1,+1)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(O.prototype, Shape.prototype);

function T(){
	Shape.call(this, 1);//借用父类型构造函数
	this.cells = [
		new Cell(0, 3, this.IMGS.T),
		new Cell(0, 4, this.IMGS.T),
		new Cell(0, 5, this.IMGS.T),
		new Cell(1, 4, this.IMGS.T)
	];
	this.states = [
		State(0,-1, 0,0, 0,+1, +1,0),
		State(-1,0, 0,0, +1,0, 0,-1),
		State(0,+1, 0,0, 0,-1, -1,0),
		State(+1,0, 0,0, -1,0, 0,+1)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(T.prototype, Shape.prototype);

function I(){
	Shape.call(this, 1);//借用父类型构造函数
	this.cells = [
		new Cell(0, 3, this.IMGS.I),
		new Cell(0, 4, this.IMGS.I),
		new Cell(0, 5, this.IMGS.I),
		new Cell(0, 6, this.IMGS.I)
	];
	this.states = [
		State(0,-1, 0,0, 0,+1, 0,+2),
		State(-1,0, 0,0, +1,0, +2,0)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(I.prototype, Shape.prototype);

function S(){
	Shape.call(this, 1);//借用父类型构造函数
	this.cells = [
		new Cell(0, 5, this.IMGS.S),
		new Cell(0, 4, this.IMGS.S),
		new Cell(1, 4, this.IMGS.S),
		new Cell(1, 3, this.IMGS.S)
	];
	this.states = [
		State(0,+1, 0,0, +1,0, +1,-1),
		State(+1,0, 0,0, 0,-1, -1,-1)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(S.prototype, Shape.prototype);

function Z(){
	Shape.call(this, 1);//借用父类型构造函数
	this.cells = [
		new Cell(0, 3, this.IMGS.Z),
		new Cell(0, 4, this.IMGS.Z),
		new Cell(1, 4, this.IMGS.Z),
		new Cell(1, 5, this.IMGS.Z)
	];
	this.states = [
		State(0,-1, 0,0, +1,0, +1,+1),
		State(-1,0, 0,0, 0,-1, +1,-1)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(Z.prototype, Shape.prototype);

function J(){
	Shape.call(this, 2);//借用父类型构造函数
	this.cells = [
		new Cell(0, 3, this.IMGS.J),
		new Cell(1, 3, this.IMGS.J),
		new Cell(1, 4, this.IMGS.J),
		new Cell(1, 5, this.IMGS.J)
	];
	this.states = [
		State(-1,-1, 0,-1, 0,0, 0,+1),
		State(-1,+1, -1,0, 0,0, +1,0),
		State(+1,+1, 0,+1, 0,0, 0,-1),
		State(+1,-1, +1,0, 0,0, -1,0)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(J.prototype, Shape.prototype);

function L(){
	Shape.call(this, 1);//借用父类型构造函数
	this.cells = [
		new Cell(1, 3, this.IMGS.L),
		new Cell(1, 4, this.IMGS.L),
		new Cell(1, 5, this.IMGS.L),
		new Cell(0, 5, this.IMGS.L)
	];
	this.states = [
		State(0,-1, 0,0, 0,+1, -1,+1),
		State(-1,0, 0,0, +1,0, +1,+1),
		State(0,+1, 0,0, 0,-1, +1,-1),
		State(+1,0, 0,0, -1,0, -1,-1)
	];
}
//让子类型的原型继承自父类型的原型
Object.setPrototypeOf(L.prototype, Shape.prototype);

function State(r0, c0, r1, c1, r2, c2, r3, c3) { //每个图形每种状态的数据类型
	return [
		{r: r0, c: c0}, //第1个格相对于参照格的偏移量
		{r: r1, c: c1}, //第2个格相对于参照格的偏移量
		{r: r2, c: c2}, //第3个格相对于参照格的偏移量
		{r: r3, c: c3}  //第4个格相对于参照格的偏移量
	];
}
