var tetris = {
	CELL_SIZE: 26, //每个格子的宽和高
	RN: 20, //总行数
	CN: 10, //总列数
	OFFSET: 15, //左侧和上方边框修正的宽度
	pg: null, //保存游戏主界面容器对象playground
	shape: null, //保存正在下落的图形

	nextShape: null, //下一次将要登场的图形

	interval: 1000, //每次下落的时间间隔1
	wall: null, //保存所有停止下落的方块对象
	timer: null, //保存当前正在执行的定时器
	score: 0, //游戏得分
	SCORES: [0, 10, 50, 80, 200], //删除行数对应的得分
			//0  1  2    3   4 
	lines: 0, //保存已经删除的总行数
	level:1, //保存游戏的等级

	state: 1, 
	GAMEOVER: 0,
	RUNNING: 1,
	PAUSE: 2,
	IMG_OVER: "img/game-over.png",
	IMG_PAUSE: "img/pause.png",

	paintState: function() { //专门绘制游戏特殊状态的图片
		var img = new Image();
		switch(this.state) {
			case this.GAMEOVER:
				img.src = this.IMG_OVER; break;
			case this.PAUSE:
				img.src = this.IMG_PAUSE; break;
		}
		this.pg.appendChild(img);
	},

	isGameOver: function() {
		for(var i = 0; i < this.nextShape.cells.length; i++) {
			var cell = this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c] != null) {
				return true;
			}
		}
		return false;
	},

	randomShape: function() { //随机生成一个图形对象
		//检查随机数
		switch(Math.floor(Math.random() * 7)) {
			case 0: return new O();
			case 1: return new T();
			case 2: return new I();
			case 3: return new Z();
			case 4: return new S();
			case 5: return new L();
			case 6: return new J();
		}
	},

	paintNextShape: function() { //专门负责绘制nextShape图形
		var frag = document.createDocumentFragment();
		for(var i = 0; i < this.nextShape.cells.length; i++) {
			var img = new Image();
			var cell = this.nextShape.cells[i];
			img.src = cell.img;
			img.style.top = (cell.r + 1) * this.CELL_SIZE + this.OFFSET + "px";
			img.style.left = (cell.c + 10) * this.CELL_SIZE + this.OFFSET + "px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},

	paint: function() { //重绘一切
		//使用正则表达式替换pg的内容中所以img元素为“”，结果再保存回pg的内容中
		this.pg.innerHTML = this.pg.innerHTML.replace(/<img(.*?)>/g, "");
		//调用paintShape方法，重绘图形
		this.paintShape();
		this.paintNextShape();
		this.paintWall();
		this.paintState();
		this.paintScore();
	},

	start: function(){ //游戏启动
		var self = this;
		self.state = self.RUNNING; //重置游戏状态为运行
		self.score = 0;
		self.lines = 0;
		self.level = 1;

		self.pg = document.querySelector(".playground");
		// self.shape = new L(); //创建一个图形对象
		// self.paintShape();
	
		self.shape = self.randomShape();
		self.nextShape = self.randomShape();

		self.paintShape();
		self.paintNextShape();

		//初始化wall属性为空数组
		self.wall = [];
		//r从0开始; r<RN; r++
		for(var r = 0; r < self.RN; r++){
			//向wall中压入一个新数组对象，默认元素个数为CN
			self.wall.push(new Array(self.CN));
		}

		self.timer = setInterval(function(){
			self.moveDown();			
		}, self.interval);

		document.onkeydown = function() {
			var e = window.event || arguments[0];
			switch(e.keyCode) {
				//如果为37，就调用moveLeft方法
				case 37:
					self.state == self.RUNNING && self.moveLeft();
					break;
				//如果为39，就调用moveRight方法
				case 39:
					self.state == self.RUNNING && self.moveRight();
					break;
				//如果为40，就调用moveDown方法
				case 40:
					self.state == self.RUNNING && self.moveDown();
					break;
				//如果按向上，就顺时针旋转
				case 38:
					self.state == self.RUNNING && self.rotateR();
					break;
				//如果按Z，就逆时针旋转
				case 90:
					self.state == self.RUNNING && self.rotateL();
					break;
				//如果按S，就重启游戏
				case 83:
					if(self.state == self.GAMEOVER) {
						self.start();
					}
					break;
				//如果按P，就暂停游戏
				case 80:
					if(self.state == self.RUNNING) {
						self.state = self.PAUSE;
						clearInterval(self.timer);
						self.timer = null;
						self.paint();
					}
					break;
				//如果按C，就继续游戏
				case 67:
					if(self.state == self.PAUSE) {
						self.state = self.RUNNING;
						self.timer = setInterval(
							function() {
								self.moveDown();
							}
						,self.interval);
					}
					break;
				//如果按Q，就结束游戏
				case 81:
					if(self.state != self.GAMEOVER) {
						self.state = self.GAMEOVER;
						if(self.timer != null) {
							clearInterval(self.timer);
							self.timer = null;
						}
						self.paint();
					}

				// case 37: self.moveLeft(); break;
				// case 39: self.moveRight(); break;
				// case 40: self.moveDown(); break;
				// case 38: self.rotateR(); break;
				// case 90: self.rotateL(); break;
			}
		}
	},

	moveLeft: function() { //左移一步
		if(this.canLeft()) {
			this.shape.moveLeft();
		}
	},
	canLeft: function() { //检查是否可以左移
		for(var i = 0; i < this.shape.cells.length; i++) {
			var cell = this.shape.cells[i];
			if(cell.c == 0 || this.wall[cell.r][cell.c-1] != null){
				return false;
			}
		}
		return true;
	},	

	moveRight: function() { //右移一步
		if(this.canRight()) {
			this.shape.moveRight();
		}
	},
	canRight: function() { //检查是否可以右移
		for(var i = 0; i < this.shape.cells.length; i++) {
			var cell = this.shape.cells[i];
			if(cell.c == this.CN-1 || this.wall[cell.r][cell.c+1] != null){
				return false;
			}
		}
		return true;
	},
	
	canDown: function() { //专门检查是否可以下落
		for(var i = 0; i < this.shape.cells.length; i++){
			var cell = this.shape.cells[i];
			//如果当前cell的r等于RN-1，或在wall数组中和当前cell位置对应的下一行的元素不等于null
			if(cell.r == this.RN-1 || this.wall[cell.r+1][cell.c] != null){
				return false;
			}
		}
		return true;
	},
	moveDown: function(){ //负责主角图形shape下落一步
		if(this.canDown()){ //如果可以下落
			//才调用shape图形的moveDown方法（）
			this.shape.moveDown();
		}else { //将shape中每个cell放入wall的相同位置
			for(var i = 0; i < this.shape.cells.length; i++) {
				var cell = this.shape.cells[i];
				this.wall[cell.r][cell.c] = cell;
			}
			var lines = this.deleteRows();
			this.score += this.SCORES[lines];
			this.lines += lines;
			
			// this.shape = new O();
			if(!this.isGameOver()) {
				this.shape = this.nextShape; //将等待的图形，放入shape中
				this.nextShape = this.randomShape(); //生成一个等待图形放在nextShape
			}else{
				clearInterval(this.timer);
				this.timer = null;
				this.state = this.GAMEOVER;
				// console.log(this.isGameOver);
			}
			

		}
		this.paint();
	},

	rotateR: function() { //顺时针旋转一次
		this.shape.rotateR();
		//再检查是否越界或和wall中冲突
		if(!this.canRotate()) {
			//如果冲突，就再调shape的rotateL方法转回来
			this.shape.rotateL();
		}
	},
	canRotate: function() { //判断能否旋转
		for(var i = 0; i < this.shape.cells.length; i++) {
			var cell = this.shape.cells[i];
			//如果cell的c<0或c>=CN或r>=RN或在wall中相同位置有格
			if(cell.c < 0 || cell.c >= this.CN || cell.r < 0 || cell.r >= this.RN
				|| this.wall[cell.r][cell.c] != null) {
				return false;
			}
		}
		return true;
	},
	rotateL: function() { //逆时针旋转一次
		this.shape.rotateL();
		//再检查是否越界或和wall中冲突
		if(!this.canRotate()) {
			//如果冲突，就再调shape的rotateR方法转回来
			this.shape.rotateR();
		}
	},

	deleteRows: function() { //删除所有已满的行
		for(var r = this.RN - 1, lines = 0; r >= 0; r--) {
			if(this.isFullRow(r)) {
				this.deleteRow(r);
				r++; //刚被删除的行，还要再检查一次
				lines++;
			}
		} //遍历结束
		return lines; //返回本次消除的行数
	},

	deleteRow: function(row) { //删除第row行
		for(var r = row; r >= 0; r--) {
			this.wall[r] = this.wall[r - 1];
			this.wall[r - 1] = [];
			for(var c = 0; c < this.CN; c++) {
				if(this.wall[r][c] != null) {
					this.wall[r][c].r++;
				}
			}
			//如果r-2行无缝拼接后等于"", 就break
			if(this.wall[r - 2].join("") == "") {
				break;
			}
		}
	},

	isFullRow: function(row) { //判断第row行是否满格
		for(var c = 0; c < this.CN; c++) {
			if(this.wall[row][c] == null) {
				return false;
			}
		}
		return true;
	},

	paintWall: function() { //绘制墙的方法
		var frag = document.createDocumentFragment();
		for(var r = 0; r < this.RN; r++) {
			for(var c = 0; c < this.CN; c++) {
				var cell = this.wall[r][c];
				if(cell) {
					var img = new Image();
					img.src = cell.img;
					img.style.top = cell.r * this.CELL_SIZE + this.OFFSET + "px";
					img.style.left = cell.c * this.CELL_SIZE + this.OFFSET + "px";
					frag.appendChild(img);
				}
				
			}
		}
		this.pg.appendChild(frag);
	},

	paintShape: function() { //专门负责绘制当前Shape图形
		//创建文档片段，保存在变量frag中
		var frag = document.createDocumentFragment();
		for(var i=0; i<this.shape.cells.length; i++){
			var img = new Image();
			var cell = this.shape.cells[i];
			img.src = cell.img;
			img.style.top = cell.r * this.CELL_SIZE + this.OFFSET + "px";
			img.style.left = cell.c * this.CELL_SIZE + this.OFFSET + "px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},

	paintScore: function() {
		var span = document.querySelectorAll(".playground>p>span");
		span[0].innerHTML = this.score;
		span[1].innerHTML = this.lines;
		span[2].innerHTML = this.level;
		// span[1].innerHTML = this.SCORES[];
		// console.log(span[0].innerHTML);
		// span.innerHTML
	}
}

window.onload = function() {
	tetris.start();
}