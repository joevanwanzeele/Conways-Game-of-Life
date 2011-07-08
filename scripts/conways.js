var Grid;
var GRID_SIZE = 234;
var CELL_SIZE = 3;
var canvas;
var ctx;
var keepGoing = true;

var deadFillStyle = "rgb(0,0,0)";
var aliveFillStyle = "rgb(255,255,255)";

function initializeGrid(randomize) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas = $('#canvas');
    ctx.fillStyle = deadFillStyle;    
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    canvas.click(function (e) {
        var cell = GetCellAtPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        cell.alive = !cell.alive;
        cell.draw();
    });

    Grid = new Array(GRID_SIZE);
    for (var i = 0; i < GRID_SIZE; i++) {
        Grid[i] = new Array(GRID_SIZE);
        for (var j = 0; j < GRID_SIZE; j++) {
            Grid[i][j] = new Cell(i, j);
            if (randomize) {
                Grid[i][j].alive = Math.floor(Math.random() * 10) == 1 ? true : false;
                if (Grid[i][j].alive) {
                    Grid[i][j].draw();
                }
            }
        }
    }
}

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.aliveNextRound = false;
    this.drawPosition = { x: x * CELL_SIZE, y: y * CELL_SIZE };
    this.drawAgain = false;

    this.GetNumberOfLiveNeighbors = function () {
        var aliveNeighbors = 0;

        if (Grid[x - 1]) { //check left side

            if (Grid[x - 1][y] && Grid[x - 1][y].alive) //left
                aliveNeighbors++;            

            if (Grid[x - 1][y + 1] && Grid[x - 1][y + 1].alive) //bottom left
                aliveNeighbors++;            

            if (Grid[x - 1][y - 1] && Grid[x - 1][y - 1].alive)  //top left
                aliveNeighbors++            
        }

        if (Grid[x + 1]) { //check right side

            if (Grid[x + 1][y] && Grid[x + 1][y].alive) //right
                aliveNeighbors++;            

            if (Grid[x + 1][y + 1] && Grid[x + 1][y + 1].alive) //bottom right
                aliveNeighbors++;           

            if (Grid[x + 1][y - 1] && Grid[x + 1][y - 1].alive) //top right
                aliveNeighbors++            
        }

        if (Grid[x][y + 1] && Grid[x][y + 1].alive) //bottom
            aliveNeighbors++;        

        if (Grid[x][y - 1] && Grid[x][y - 1].alive) //top
            aliveNeighbors++;       

        return aliveNeighbors;
    }

    this.NextState = function () {
        var n = this.GetNumberOfLiveNeighbors();
        switch (n) {
            case 2:
                if (this.alive) this.aliveNextRound = true;
                this.newborn = false;                
                return;
            case 3:
                if (!this.alive) this.aliveNextRound = true;
                this.newborn = true;                
                return;
            default:
                this.aliveNextRound = false;                
                break;
        }
    }

    this.draw = function () {
        if (this.alive) {
            ctx.fillStyle = aliveFillStyle;
        }
        else {
            ctx.fillStyle = deadFillStyle;
        }
        ctx.fillRect(this.drawPosition.x, this.drawPosition.y, CELL_SIZE, CELL_SIZE);
    }
}

function Tick() {
    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            Grid[i][j].NextState();
        }
    }

    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            var doDraw = (Grid[i][j].alive != Grid[i][j].aliveNextRound);
            Grid[i][j].alive = Grid[i][j].aliveNextRound;
            if (doDraw) {
                Grid[i][j].draw();
            }
        }
    }
    if (keepGoing) {
        setTimeout("Tick()", 30);
        
    }
}

function StartLife() {
    keepGoing = true;
    Tick();
}

function StopLife() {
    keepGoing = false;
}

function GetCellAtPosition(canvasX, canvasY) {    
    var gridX = Math.floor(canvasX / CELL_SIZE);
    var gridY = Math.floor(canvasY / CELL_SIZE);
    return Grid[gridX][gridY];
}





