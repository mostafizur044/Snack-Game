/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__painter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__snake__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__food__ = __webpack_require__(5);




var canvas = document.getElementById('mycanvas');
var startButton = document.getElementById('start-btn');
startButton.addEventListener("click", function () {
    init();
});
var gameLoop;
function init() {
    startButton.setAttribute('disabled', true);
    var painter = new __WEBPACK_IMPORTED_MODULE_0__painter__["a" /* Painter */](canvas);
    var snake = new __WEBPACK_IMPORTED_MODULE_2__snake__["a" /* Snake */](5, 'green', 'darkgreen');
    var food = new __WEBPACK_IMPORTED_MODULE_3__food__["a" /* Food */]();
    var board = new __WEBPACK_IMPORTED_MODULE_1__board__["a" /* Board */](painter, snake, food, 350, 350, 10);
    board.init();
    gameLoop = setInterval(function () {
        board.init();
        snake.move();
        if (board.checkBoundary()) {
            gameLoop = clearInterval(gameLoop);
            alert("Game over");
        }
        document.onkeydown = function (event) {
            var keyCode = event.keyCode;
            snake.changeDirection(keyCode);
        };
        board.drawSnake();
        board.drawFood();
    }, 150);
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Painter; });
var Painter = /** @class */ (function () {
    function Painter(_canvas) {
        this.canvas = _canvas;
        this.context = _canvas.getContext('2d');
    }
    Painter.prototype.fillArea = function (x1, y1, x2, y2, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x1, y1, x2, y2);
    };
    Painter.prototype.strokeArea = function (x1, y1, x2, y2, color) {
        this.context.strokeStyle = color;
        this.context.strokeRect(x1, y1, x2, y2);
    };
    return Painter;
}());



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Board; });
var Board = /** @class */ (function () {
    function Board(painter, snake, food, h, w, s) {
        this.height = h;
        this.width = w;
        this.size = s;
        this.painter = painter;
        this.snake = snake;
        this.food = food;
    }
    Board.prototype.drawSnake = function () {
        for (var i = 0; i < this.snake.cells.length; i++) {
            var cell = this.snake.cells[i];
            if (i == 0) {
                this.drawSnakeCell(cell.x, cell.y, true);
            }
            else {
                this.drawSnakeCell(cell.x, cell.y, false);
            }
        }
    };
    Board.prototype.drawSnakeCell = function (x, y, isHead) {
        if (isHead) {
            this.painter.fillArea(x * this.size, y * this.size, this.size, this.size, "red");
            this.painter.strokeArea(x * this.size, y * this.size, this.size, this.size, "darkgreen");
        }
        else {
            this.painter.fillArea(x * this.size, y * this.size, this.size, this.size, "green");
            this.painter.strokeArea(x * this.size, y * this.size, this.size, this.size, "darkgreen");
        }
    };
    Board.prototype.drawFood = function () {
        this.painter.fillArea(this.food.position.x * this.size, this.food.position.y * this.size, this.size, this.size, "pink");
        this.painter.strokeArea(this.food.position.x * this.size, this.food.position.y * this.size, this.size, this.size, "yellow");
    };
    Board.prototype.drawScore = function () {
    };
    Board.prototype.checkBoundary = function () {
        return this.snake.checkBoundary(-1, this.width / this.size, -1, this.height / this.size);
    };
    Board.prototype.init = function () {
        this.painter.fillArea(0, 0, this.width, this.height, "lightgrey");
        this.painter.strokeArea(0, 0, this.width, this.height, "black");
    };
    return Board;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Snake; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__enums_direction__ = __webpack_require__(4);

var Snake = /** @class */ (function () {
    function Snake(_length, _bodyColor, _borderColor) {
        this.cells = [];
        this.length = _length;
        this.bodyColor = _bodyColor;
        this.borderColor = _borderColor;
        this.direction = __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Down;
        for (var i = 0; i < _length; i++) {
            this.cells.push({ x: i, y: 0 });
        }
    }
    Snake.prototype.changeDirection = function (keyCode) {
        switch (keyCode) {
            case 37:
                if (this.direction != __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Right) {
                    this.direction = __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Left;
                }
                break;
            case 39:
                if (this.direction != __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Left) {
                    this.direction = __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Right;
                }
                break;
            case 38:
                if (this.direction != __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Down) {
                    this.direction = __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Up;
                }
                break;
            case 40:
                if (this.direction != __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Up) {
                    this.direction = __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Down;
                }
                break;
        }
    };
    Snake.prototype.move = function () {
        var snakeX = this.cells[0].x;
        var snakeY = this.cells[0].y;
        if (this.direction == __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Right) {
            snakeX++;
        }
        else if (this.direction == __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Left) {
            snakeX--;
        }
        else if (this.direction == __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Up) {
            snakeY--;
        }
        else if (this.direction == __WEBPACK_IMPORTED_MODULE_0__enums_direction__["a" /* Direction */].Down) {
            snakeY++;
        }
        this.cells.pop();
        this.cells.unshift({ x: snakeX, y: snakeY });
    };
    Snake.prototype.eatFood = function (food) {
        var head = this.cells[0];
        if (food.x == head.x && food.y == head.y) {
            return true;
        }
        else {
            return false;
        }
    };
    Snake.prototype.checkCollision = function () {
        var x = this.cells[0].x;
        var y = this.cells[0].y;
        for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i];
            if (cell.x === x && cell.y === y)
                return true;
        }
        return false;
    };
    Snake.prototype.checkBoundary = function (bx1, bx2, by1, by2) {
        var firstCell = this.cells[0];
        if (firstCell.x == bx1 || firstCell.y == by1 || firstCell.x == bx2 || firstCell.y == by2) {
            return true;
        }
        else {
            return false;
        }
    };
    return Snake;
}());



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Direction; });
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Food; });
var Food = /** @class */ (function () {
    function Food() {
        this.createFood();
    }
    Food.prototype.createFood = function () {
        var pos = {
            x: Math.random() * 30,
            y: Math.random() * 30
        };
        this.position = pos;
    };
    return Food;
}());



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzY2M2UxZmQwZDg2Nzk1ZThlN2YiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xhc3Nlcy9wYWludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2JvYXJkLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL3NuYWtlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9kaXJlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvZm9vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3RGtDO0FBQ0o7QUFDQTtBQUNGO0FBRTVCLElBQUksTUFBTSxHQUFRLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFdEQsSUFBSSxXQUFXLEdBQVEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUU1RCxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksRUFBRSxDQUFDO0FBQ1gsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLFFBQVksQ0FBQztBQUdqQjtJQUNJLFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLElBQUksT0FBTyxHQUFHLElBQUkseURBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLHFEQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLG1EQUFJLEVBQUUsQ0FBQztJQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLHFEQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFYixRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUdiLEVBQUUsRUFBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBQztZQUN0QixRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsUUFBUSxDQUFDLFNBQVMsR0FBRyxVQUFVLEtBQUs7WUFDaEMsSUFBSSxPQUFPLEdBQVUsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNuQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQixDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ1gsQ0FBQzs7Ozs7Ozs7QUN0Q0Q7QUFBQTtJQUdJLGlCQUFZLE9BQVc7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCwwQkFBUSxHQUFSLFVBQVMsRUFBUyxFQUFFLEVBQVMsRUFBQyxFQUFTLEVBQUUsRUFBUyxFQUFFLEtBQVk7UUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXpDLENBQUM7SUFDRCw0QkFBVSxHQUFWLFVBQVcsRUFBUyxFQUFFLEVBQVMsRUFBQyxFQUFTLEVBQUUsRUFBUyxFQUFFLEtBQVk7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7O0FDYkQ7QUFBQTtJQU9JLGVBQVksT0FBaUIsRUFBQyxLQUFhLEVBQUUsSUFBVyxFQUFDLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUTtRQUNqRixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUNELHlCQUFTLEdBQVQ7UUFDSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQy9DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEVBQUUsRUFBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLEVBQUM7Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlDLENBQUM7UUFFTCxDQUFDO0lBQ0wsQ0FBQztJQUNELDZCQUFhLEdBQWIsVUFBYyxDQUFRLEVBQUUsQ0FBUSxFQUFFLE1BQWM7UUFDNUMsRUFBRSxFQUFDLE1BQU0sQ0FBQyxFQUFDO1lBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7SUFDTCxDQUFDO0lBQ0Qsd0JBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwSCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFNUgsQ0FBQztJQUNELHlCQUFTLEdBQVQ7SUFFQSxDQUFDO0lBQ0QsNkJBQWEsR0FBYjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRyxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUNELG9CQUFJLEdBQUo7UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUM7UUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsT0FBTyxDQUFDO0lBQ2xFLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7QUNyRDRDO0FBRzdDO0lBTUksZUFBWSxPQUFjLEVBQUUsVUFBaUIsRUFBRSxZQUFvQjtRQUMvRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1FQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2hDLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUUsRUFBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtCQUFlLEdBQWYsVUFBZ0IsT0FBYztRQUMxQixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxFQUFFO2dCQUNILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksbUVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1FQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxDQUFDO2dCQUNELEtBQUssQ0FBQztZQUNWLEtBQUssRUFBRTtnQkFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLG1FQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxtRUFBUyxDQUFDLEtBQUssQ0FBQztnQkFDckMsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFFVixLQUFLLEVBQUU7Z0JBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxtRUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsbUVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xDLENBQUM7Z0JBQ0QsS0FBSyxDQUFDO1lBRVYsS0FBSyxFQUFFO2dCQUNILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksbUVBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLG1FQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxDQUFDO2dCQUNELEtBQUssQ0FBQztRQUNkLENBQUM7SUFDTCxDQUFDO0lBRUQsb0JBQUksR0FBSjtRQUNJLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksbUVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLG1FQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxtRUFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsTUFBTSxFQUFFLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksbUVBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCx1QkFBTyxHQUFQLFVBQVEsSUFBYztRQUNsQixJQUFJLElBQUksR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5DLEVBQUUsRUFBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFHTCxDQUFDO0lBQ0QsOEJBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEdBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixFQUFFLEVBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDcEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNELDZCQUFhLEdBQWIsVUFBYyxHQUFVLEVBQUMsR0FBVSxFQUFFLEdBQVUsRUFBRSxHQUFVO1FBQ3ZELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxFQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUM7WUFDckYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBQ0wsWUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7QUNoR0QsSUFBWSxTQUtYO0FBTEQsV0FBWSxTQUFTO0lBQ2pCLHFDQUFFO0lBQ0YseUNBQUk7SUFDSix5Q0FBSTtJQUNKLDJDQUFLO0FBQ1QsQ0FBQyxFQUxXLFNBQVMsS0FBVCxTQUFTLFFBS3BCOzs7Ozs7OztBQ0REO0FBQUE7SUFFSTtRQUNJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBQ0QseUJBQVUsR0FBVjtRQUNJLElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFO1lBQ2xCLENBQUMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRTtTQUNyQjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NjYzZTFmZDBkODY3OTVlOGU3ZiIsImltcG9ydCB7UGFpbnRlcn0gZnJvbSAnLi9wYWludGVyJztcclxuaW1wb3J0IHtCb2FyZH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCB7U25ha2V9IGZyb20gJy4vc25ha2UnO1xyXG5pbXBvcnQge0Zvb2R9IGZyb20gXCIuL2Zvb2RcIjtcclxuXHJcbmxldCBjYW52YXM6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteWNhbnZhcycpO1xyXG5cclxubGV0IHN0YXJ0QnV0dG9uOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtYnRuJyk7XHJcblxyXG5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgaW5pdCgpO1xyXG59KTtcclxuXHJcbmxldCBnYW1lTG9vcDphbnk7XHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdCgpOiB2b2lkIHtcclxuICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgIGxldCBwYWludGVyID0gbmV3IFBhaW50ZXIoY2FudmFzKTtcclxuICAgIHZhciBzbmFrZSA9IG5ldyBTbmFrZSg1LCAnZ3JlZW4nLCAnZGFya2dyZWVuJyk7XHJcbiAgICB2YXIgZm9vZCA9IG5ldyBGb29kKCk7XHJcbiAgICB2YXIgYm9hcmQgPSBuZXcgQm9hcmQocGFpbnRlciwgc25ha2UsIGZvb2QsIDM1MCwgMzUwLCAxMCk7XHJcbiAgICBib2FyZC5pbml0KCk7XHJcblxyXG4gICAgZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYm9hcmQuaW5pdCgpO1xyXG4gICAgICAgIHNuYWtlLm1vdmUoKTtcclxuXHJcblxyXG4gICAgICAgIGlmKGJvYXJkLmNoZWNrQm91bmRhcnkoKSl7XHJcbiAgICAgICAgICAgIGdhbWVMb29wID0gY2xlYXJJbnRlcnZhbChnYW1lTG9vcCk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiR2FtZSBvdmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IGtleUNvZGU6bnVtYmVyID0gZXZlbnQua2V5Q29kZTtcclxuICAgICAgICAgICAgc25ha2UuY2hhbmdlRGlyZWN0aW9uKGtleUNvZGUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJvYXJkLmRyYXdTbmFrZSgpO1xyXG4gICAgICAgIGJvYXJkLmRyYXdGb29kKCk7XHJcbiAgICB9LCAxNTApXHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL21haW4udHMiLCJpbXBvcnQge0lQYWludGVyfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lwYWludGVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYWludGVyIGltcGxlbWVudHMgSVBhaW50ZXJ7XHJcbiAgICBjYW52YXM6YW55O1xyXG4gICAgY29udGV4dDogYW55O1xyXG4gICAgY29uc3RydWN0b3IoX2NhbnZhczphbnkpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gX2NhbnZhcztcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBfY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB9XHJcbiAgICBmaWxsQXJlYSh4MTpudW1iZXIsIHkxOm51bWJlcix4MjpudW1iZXIsIHkyOm51bWJlciwgY29sb3I6c3RyaW5nKTp2b2lke1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeDEsIHkxLHgyLCB5Mik7XHJcblxyXG4gICAgfVxyXG4gICAgc3Ryb2tlQXJlYSh4MTpudW1iZXIsIHkxOm51bWJlcix4MjpudW1iZXIsIHkyOm51bWJlciwgY29sb3I6c3RyaW5nKTp2b2lke1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHgxLCB5MSx4MiwgeTIpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL3BhaW50ZXIudHMiLCJpbXBvcnQge0lQYWludGVyfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lwYWludGVyJztcclxuaW1wb3J0IHtJRm9vZH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pZm9vZCc7XHJcbmltcG9ydCB7SVNuYWtlfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lzbmFrZSc7XHJcbmltcG9ydCB7SUJvYXJkfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lib2FyZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9hcmQgaW1wbGVtZW50cyBJQm9hcmR7XHJcbiAgICBwYWludGVyOiBJUGFpbnRlcjtcclxuICAgIHNuYWtlOiBJU25ha2U7XHJcbiAgICBoZWlnaHQ6bnVtYmVyO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIHNpemU6bnVtYmVyO1xyXG4gICAgZm9vZDogSUZvb2Q7XHJcbiAgICBjb25zdHJ1Y3RvcihwYWludGVyOiBJUGFpbnRlcixzbmFrZTogSVNuYWtlLCBmb29kOiBJRm9vZCxoOm51bWJlciwgdzpudW1iZXIsIHM6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGg7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHc7XHJcbiAgICAgICAgdGhpcy5zaXplID0gcztcclxuICAgICAgICB0aGlzLnBhaW50ZXIgPSBwYWludGVyO1xyXG4gICAgICAgIHRoaXMuc25ha2UgPSBzbmFrZTtcclxuICAgICAgICB0aGlzLmZvb2QgPSBmb29kO1xyXG4gICAgfVxyXG4gICAgZHJhd1NuYWtlKCk6dm9pZHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc25ha2UuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLnNuYWtlLmNlbGxzW2ldO1xyXG4gICAgICAgICAgICBpZihpPT0wKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1NuYWtlQ2VsbChjZWxsLngsIGNlbGwueSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTbmFrZUNlbGwoY2VsbC54LCBjZWxsLnksIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkcmF3U25ha2VDZWxsKHg6bnVtYmVyLCB5Om51bWJlciwgaXNIZWFkOmJvb2xlYW4pe1xyXG4gICAgICAgIGlmKGlzSGVhZCl7XHJcbiAgICAgICAgICAgIHRoaXMucGFpbnRlci5maWxsQXJlYSh4KnRoaXMuc2l6ZSwgeSp0aGlzLnNpemUsIHRoaXMuc2l6ZSwgdGhpcy5zaXplLCBcInJlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5wYWludGVyLnN0cm9rZUFyZWEoeCp0aGlzLnNpemUsIHkqdGhpcy5zaXplLCB0aGlzLnNpemUsIHRoaXMuc2l6ZSwgXCJkYXJrZ3JlZW5cIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYWludGVyLmZpbGxBcmVhKHgqdGhpcy5zaXplLCB5KnRoaXMuc2l6ZSwgdGhpcy5zaXplLCB0aGlzLnNpemUsIFwiZ3JlZW5cIik7XHJcbiAgICAgICAgICAgIHRoaXMucGFpbnRlci5zdHJva2VBcmVhKHgqdGhpcy5zaXplLCB5KnRoaXMuc2l6ZSwgdGhpcy5zaXplLCB0aGlzLnNpemUsIFwiZGFya2dyZWVuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXdGb29kKCk6dm9pZHtcclxuICAgICAgICB0aGlzLnBhaW50ZXIuZmlsbEFyZWEodGhpcy5mb29kLnBvc2l0aW9uLngqdGhpcy5zaXplLCB0aGlzLmZvb2QucG9zaXRpb24ueSp0aGlzLnNpemUsIHRoaXMuc2l6ZSwgdGhpcy5zaXplLCBcInBpbmtcIik7XHJcbiAgICAgICAgdGhpcy5wYWludGVyLnN0cm9rZUFyZWEodGhpcy5mb29kLnBvc2l0aW9uLngqdGhpcy5zaXplLCB0aGlzLmZvb2QucG9zaXRpb24ueSp0aGlzLnNpemUsIHRoaXMuc2l6ZSwgdGhpcy5zaXplLCBcInllbGxvd1wiKTtcclxuXHJcbiAgICB9XHJcbiAgICBkcmF3U2NvcmUoKTp2b2lke1xyXG5cclxuICAgIH1cclxuICAgIGNoZWNrQm91bmRhcnkoKTogYm9vbGVhbntcclxuICAgICAgICByZXR1cm4gdGhpcy5zbmFrZS5jaGVja0JvdW5kYXJ5KC0xLCAgdGhpcy53aWR0aC90aGlzLnNpemUsLTEsIHRoaXMuaGVpZ2h0L3RoaXMuc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBpbml0KCk6dm9pZHtcclxuICAgICAgICB0aGlzLnBhaW50ZXIuZmlsbEFyZWEoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIFwibGlnaHRncmV5XCIpXHJcbiAgICAgICAgdGhpcy5wYWludGVyLnN0cm9rZUFyZWEoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsXCJibGFja1wiKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvYm9hcmQudHMiLCJpbXBvcnQge0lQb3NpdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pcG9zaXRpb24nO1xyXG5pbXBvcnQge0lTbmFrZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pc25ha2UnO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnLi4vZW51bXMvZGlyZWN0aW9uJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU25ha2UgaW1wbGVtZW50cyBJU25ha2V7XHJcbiAgICBjZWxsczogSVBvc2l0aW9uW107XHJcbiAgICBib2R5Q29sb3I6IHN0cmluZztcclxuICAgIGJvcmRlckNvbG9yOiBzdHJpbmc7XHJcbiAgICBkaXJlY3Rpb246IERpcmVjdGlvbjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoX2xlbmd0aDpudW1iZXIsIF9ib2R5Q29sb3I6c3RyaW5nLCBfYm9yZGVyQ29sb3I6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5jZWxscyA9IFtdO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gX2xlbmd0aDtcclxuICAgICAgICB0aGlzLmJvZHlDb2xvciA9IF9ib2R5Q29sb3I7XHJcbiAgICAgICAgdGhpcy5ib3JkZXJDb2xvciA9IF9ib3JkZXJDb2xvcjtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5Eb3duO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8X2xlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2goe3g6IGksIHk6IDB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlRGlyZWN0aW9uKGtleUNvZGU6bnVtYmVyKXtcclxuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPSBEaXJlY3Rpb24uUmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5MZWZ0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gIT0gRGlyZWN0aW9uLkxlZnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5SaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPSBEaXJlY3Rpb24uRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9uLlVwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9IERpcmVjdGlvbi5VcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkRvd247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZSgpe1xyXG4gICAgICAgIGxldCBzbmFrZVg6IG51bWJlciA9IHRoaXMuY2VsbHNbMF0ueDtcclxuICAgICAgICBsZXQgc25ha2VZOiBudW1iZXIgPSB0aGlzLmNlbGxzWzBdLnk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PSBEaXJlY3Rpb24uUmlnaHQpIHtcclxuICAgICAgICAgICAgc25ha2VYKys7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PSBEaXJlY3Rpb24uTGVmdCkge1xyXG4gICAgICAgICAgICBzbmFrZVgtLTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09IERpcmVjdGlvbi5VcCkge1xyXG4gICAgICAgICAgICBzbmFrZVktLTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09IERpcmVjdGlvbi5Eb3duKSB7XHJcbiAgICAgICAgICAgIHNuYWtlWSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jZWxscy5wb3AoKTtcclxuICAgICAgICB0aGlzLmNlbGxzLnVuc2hpZnQoe3g6c25ha2VYLCB5OnNuYWtlWX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGVhdEZvb2QoZm9vZDpJUG9zaXRpb24pOiBib29sZWFue1xyXG4gICAgICAgIGxldCBoZWFkOklQb3NpdGlvbiA9IHRoaXMuY2VsbHNbMF07XHJcblxyXG4gICAgICAgIGlmKGZvb2QueCA9PSBoZWFkLnggJiYgZm9vZC55ID09IGhlYWQueSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGNoZWNrQ29sbGlzaW9uKCk6IGJvb2xlYW57XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLmNlbGxzWzBdLng7XHJcbiAgICAgICAgdmFyIHkgPSB0aGlzLmNlbGxzWzBdLnk7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGxzW2ldO1xyXG4gICAgICAgICAgICBpZihjZWxsLnggPT09IHggJiYgY2VsbC55ID09PSB5KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNoZWNrQm91bmRhcnkoYngxOm51bWJlcixieDI6bnVtYmVyLCBieTE6bnVtYmVyLCBieTI6bnVtYmVyICk6Ym9vbGVhbntcclxuICAgICAgICB2YXIgZmlyc3RDZWxsID0gdGhpcy5jZWxsc1swXTtcclxuICAgICAgICBpZihmaXJzdENlbGwueCA9PSBieDEgfHwgZmlyc3RDZWxsLnkgPT0gYnkxIHx8IGZpcnN0Q2VsbC54ID09IGJ4MiB8fCBmaXJzdENlbGwueSA9PSBieTIpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvc25ha2UudHMiLCJleHBvcnQgZW51bSBEaXJlY3Rpb24ge1xyXG4gICAgVXAsXHJcbiAgICBEb3duLFxyXG4gICAgTGVmdCxcclxuICAgIFJpZ2h0XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VudW1zL2RpcmVjdGlvbi50cyIsIlxyXG5pbXBvcnQge0lQb3NpdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9pcG9zaXRpb24nO1xyXG5pbXBvcnQge0lGb29kfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lmb29kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBGb29kIGltcGxlbWVudHMgSUZvb2R7XHJcbiAgICBwb3NpdGlvbjogSVBvc2l0aW9uO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmNyZWF0ZUZvb2QoKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUZvb2QoKTp2b2lke1xyXG4gICAgICAgIGxldCBwb3MgPSB7XHJcbiAgICAgICAgICAgIHg6TWF0aC5yYW5kb20oKSozMCxcclxuICAgICAgICAgICAgeTpNYXRoLnJhbmRvbSgpKjMwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9mb29kLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==