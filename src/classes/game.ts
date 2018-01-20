import {Cell} from './cell';
import {CELLSIZE, SCALE, APPLES, WIDTH, HEIGHT, SPEED, MAX_LEVEL, COLORS} from '../constants/allConstants';
import {Grid} from './grid';
import {Worm} from './worm';
import {Configuration} from '../interfaces/configuration';



export class Game {

    private canvas: HTMLCanvasElement;
    private score:number = 0;
    private running: boolean = false;
    private grid: Grid;
    private worm: Worm;
    private configuration: Configuration;  
    private nextMove:number;

    constructor() {

        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;    
        document.getElementById("play-ground").appendChild(this.canvas);

        // canvas element size in the page
        this.canvas.style.width = WIDTH * CELLSIZE + 'px';
        this.canvas.style.height = HEIGHT * CELLSIZE + 'px';

        // image buffer size 
        this.canvas.width = WIDTH * CELLSIZE * SCALE;
        this.canvas.height = HEIGHT * CELLSIZE * SCALE;

        // configuration
        this.configuration = {
            level: 0,
            speed: SPEED,
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: WIDTH,
            nbCellsY: HEIGHT,
            cellWidth: this.canvas.width / WIDTH,
            cellHeight: this.canvas.height / HEIGHT,
            color: COLORS[0]
        };

        this.worm = new Worm(this);
        this.grid = new Grid(this);
      
        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    start() {
        this.nextMove = 0;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.running = false;
    }

    getConfiguration() {
        return this.configuration
    }

    loop(time:number) {

        if(this.running) {
          
          requestAnimationFrame(this.loop.bind(this));
          
          if (time >= this.nextMove) {
            
              this.nextMove = time + this.configuration.speed;
            
              // move once
              this.worm.move();
                          
              // check what happened  
              switch (this.checkState()) {
                  case -1:
                      this.die();
                      break;
                  case 1:
                      this.worm.grow();
                      this.score += 100;
                      this.grid.eat(this.worm.getHead());
                      if(this.grid.isDone()) {
                        this.levelUp();
                      }
                  default:
                      // update display
                      this.paint(time);
              }
          }
        }
    }

    paint(time:number) {
      
        const {width, height, color, level} = this.configuration;
        const context = this.canvas.getContext("2d");
      
        // background
        context.fillStyle = color;
        context.fillRect(0,0,width,height);
      
        
        document.getElementById('level').innerText = (1 + level).toLocaleString(); 
        document.getElementById('score').innerText = this.score.toLocaleString(); 
        

        // grid
        this.grid.draw(time, context, COLORS[this.configuration.level]);
        // worm
        this.worm.draw(time, context);
    }

    checkState() {

        const cell = this.worm.getHead();

        // left the play area or ate itself?? 
        if (this.isOutside(cell) || this.worm.isWorm(cell)) {
            // dead
            return -1;
        }

        // ate apple?
        if (this.grid.isApple(cell)) {
            return 1;
        }

        // nothing special
        return 0;
    }
  
    levelUp() {
      this.score += 500;
      this.configuration.level++;
      if(this.configuration.level < MAX_LEVEL) {
        this.configuration.speed -= 8;
        this.configuration.color = COLORS[this.configuration.level];
        this.grid.seed();
      } else {
        this.win();
      }
    }
  
    win() {
      alert("Congrats you beat the game!\r\n\r\nFinal Score: " + this.score);
      this.stop();       
    }
  
    die() {
      document.getElementById('start-btn').style.pointerEvents  = 'none';
      alert("You died.\r\n\r\nFinal Score: " + this.score);
      this.stop();
    }

    isOutside(cell: Cell) {
        const { nbCellsX, nbCellsY } = this.configuration;
        return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
    }
  
   onKeyDown(event:KeyboardEvent) {
       switch(event.key) {
         case 'ArrowUp':
           event.preventDefault();
           this.worm.setDirection('Up');
           break;
         case 'ArrowDown':
           event.preventDefault();
           this.worm.setDirection('Down');
           break;
         case 'ArrowLeft':
           event.preventDefault();
           this.worm.setDirection('Left');
           break;
         case 'ArrowRight':
           event.preventDefault();
           this.worm.setDirection('Right');
           break;
       }
    }
  
}
