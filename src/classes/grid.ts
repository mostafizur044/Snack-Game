import {Cell} from './cell';
import {CELLSIZE, SCALE, APPLES,COLORS} from '../constants/allConstants';
import {Game} from './game';
import {Configuration} from '../interfaces/configuration';



export class Grid {
    
        private game: Game;
        private apples;
    
        constructor(game: Game) {
            this.game = game;
            this.apples = [];     
            this.seed(); 
        }
      
        seed() {
           const { nbCellsX , nbCellsY, level} = this.game.getConfiguration();
           const nbApples = (APPLES * (level + 1)) -level ;
           for (let count = 0;  count < nbApples; count++) {
                let x = Math.floor(Math.random() * nbCellsX);
                let y = Math.floor(Math.random() * nbCellsY); 
                this.apples.push(new Cell(x, y));
            }
        }
    
        draw(time:number, context:CanvasRenderingContext2D,strokeColor:string) {
    
            const { width, height, cellWidth, cellHeight } = this.game.getConfiguration();
    
            context.fillStyle = '#fff';
            context.lineWidth = 1 * SCALE;
    
            for (let x = 0; x <= width; x += cellWidth) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, height);
                context.stroke();
                context.strokeStyle=strokeColor;
            }
    
            for (let y = 0; y <= height; y += cellHeight) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(width, y);
                context.stroke();
            }
    
            // apples
            context.fillStyle = 'red';
            this.apples.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
        }
    
        isApple(cell: Cell) {
            return this.apples.find(el => cell.x == el.x && cell.y == el.y);
        }
      
        eat(cell: Cell) {
            this.apples = this.apples.filter(el => cell.x != el.x || cell.y != el.y)
        }
      
        isDone() {
          return this.apples.length == 0;
        }
    }