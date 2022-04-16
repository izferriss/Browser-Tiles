const TILE_SIZE_INITIAL = 32;                       //pixels
const TILE_WIDTH = 32;                              //pixels
const TILE_HEIGHT = 32;                             //pixels
const SCALE = 2;                                    //multiplier
const TILE_SIZE_SCALED = TILE_SIZE_INITIAL * SCALE; //pixels
var mapWidth = 50;                                  //number of tiles
var mapHeight = 25;                                 //number of tiles
var ctx = null;                                     //context

//Tileset
var tileSet = new Image();
tileSet.src="dungeonTiles.png";

//Frame rate vars
var currentSecond = 0;
var frameCount = 0;
var framesLastSecond = 0;
var lastFrameTime = 0;

var keysDown =
{
    37: false,
    38: false,
    39: false,
    40: false
};

var player = new Character();

//1: passable
//0: impassable
var collisionMap =
[
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,
    1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,
    1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,
    1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,
    1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,0,0,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0,0,0,1,1,1,1,
    1,1,0,0,0,0,0,0,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0,0,0,0,0,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1
];

var gameMap =
[
    65,65,65,65,65,65,65,65,65,10,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,13,65,65,65,65,65,65,65,65,65,
    65,65,65,65,65,65,65,65,65,20,22,21,22,56,57,21,22,56,57,21,22,22,21,22,56,57,21,22,56,57,21,22,22,56,57,22,56,57,57,56,23,65,65,65,65,65,65,65,65,65,
    65,65,65,10,11,11,11,11,12,14,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,31,32,32,32,32,32,32,32,15,11,12,11,11,12,13,65,65,65,
    65,65,65,20,21,22,22,21,57,24,32,32,35,42,41,42,41,42,41,42,41,42,34,32,32,32,32,35,41,42,41,42,41,42,41,42,41,34,32,32,25,56,57,56,57,56,23,65,65,65,
    65,65,65,30,32,32,32,32,32,32,32,32,15,11,12,13,10,11,12,13,10,12,14,32,32,32,32,15,12,13,10,11,12,13,10,11,12,14,32,32,32,32,32,32,32,32,23,65,65,65,
    65,65,65,20,32,32,32,32,32,32,32,32,25,21,22,23,20,21,21,15,14,21,24,32,29,19,32,25,21,15,14,56,57,23,20,21,22,24,32,32,32,32,32,32,32,31,33,65,65,65,
    65,65,65,30,32,32,35,41,42,34,32,32,32,32,32,33,30,44,45,25,24,32,32,39,18,18,29,32,32,25,24,44,45,23,30,32,32,32,32,32,35,41,42,34,32,32,23,65,65,65,
    65,10,11,14,32,32,15,12,13,20,31,32,32,32,32,23,20,54,55,32,32,32,32,32,18,18,32,32,32,32,32,54,55,23,20,32,32,32,32,32,33,65,65,20,32,32,33,65,65,65,
    65,20,21,24,32,32,25,22,23,40,41,41,34,32,32,33,40,41,34,32,32,32,32,32,19,18,32,32,32,32,32,35,42,43,30,32,32,35,41,42,43,65,65,30,32,32,23,65,65,65,
    65,30,16,32,32,32,32,17,23,65,65,65,20,32,32,23,65,65,20,32,32,32,32,32,18,18,32,32,32,32,32,23,65,65,20,32,32,23,65,65,65,65,65,30,32,32,33,65,65,65,
    65,20,32,32,32,32,32,32,33,65,65,65,30,32,32,33,65,65,30,32,32,32,32,32,18,18,32,32,32,32,32,33,65,65,30,32,32,33,65,10,11,11,12,14,32,32,23,65,65,65,
    65,30,32,32,36,37,32,32,23,65,65,65,20,32,32,23,65,65,20,32,32,32,32,32,18,18,32,32,32,32,32,23,65,65,30,32,32,23,65,20,21,57,22,24,32,32,33,65,65,65,
    65,20,32,32,46,47,32,32,33,65,65,65,30,32,32,33,65,65,30,32,28,32,32,32,18,18,32,31,32,32,32,23,65,65,20,32,32,33,65,20,32,32,32,32,32,32,23,65,65,65,
    65,30,32,32,32,32,32,32,23,65,65,65,20,32,32,23,65,65,20,32,32,32,32,32,18,18,32,32,32,32,32,23,65,65,30,32,32,23,65,30,32,32,32,32,32,32,33,65,65,65,
    65,30,26,32,32,32,32,27,33,65,65,65,30,32,32,33,65,65,30,32,32,32,32,32,18,18,32,32,32,32,32,33,65,65,20,32,32,33,66,20,32,32,35,41,42,42,43,65,65,65,
    65,40,41,42,41,42,41,42,43,65,65,65,20,32,32,23,10,12,14,32,32,32,32,32,18,18,32,32,32,32,32,15,12,13,30,32,32,23,66,30,32,32,33,65,65,65,65,65,65,65,
    65,65,65,65,65,65,65,65,65,65,65,65,30,32,32,33,20,56,24,32,32,32,32,32,18,18,32,28,32,32,32,25,56,23,20,32,32,33,66,20,32,32,15,11,12,11,12,13,65,65,
    65,65,65,65,65,65,65,65,65,65,65,65,20,32,32,23,20,44,45,32,32,32,32,32,18,18,32,32,32,32,32,44,45,23,30,32,32,23,66,30,32,32,25,21,22,21,22,23,65,65,
    64,65,65,65,65,65,65,65,65,65,65,65,30,28,32,33,30,54,55,32,32,32,32,32,18,18,32,32,32,32,32,54,55,33,20,32,32,33,66,20,18,18,18,18,18,18,18,23,65,65,
    64,64,65,65,64,64,65,65,65,65,65,65,20,32,32,23,40,41,42,41,42,41,42,34,36,37,35,41,42,41,42,41,42,43,30,32,32,23,66,30,18,18,18,18,18,18,18,33,65,65,
    64,65,65,65,65,65,65,65,65,65,65,65,30,32,32,15,11,12,11,12,12,11,12,14,46,47,15,11,12,11,12,11,11,12,14,32,32,33,66,20,18,18,18,18,18,18,18,23,65,65,
    64,65,65,65,65,65,65,65,65,65,65,65,20,32,32,25,56,57,56,22,21,56,57,24,32,32,25,56,22,56,57,22,56,57,24,28,32,23,66,30,18,18,18,18,18,18,18,33,65,65,
    65,64,65,65,65,65,65,65,64,64,64,64,30,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,33,66,20,18,18,18,18,19,18,18,23,65,65,
    65,64,64,65,65,65,65,64,64,64,64,64,40,41,42,42,42,41,42,41,42,41,42,34,32,32,35,41,42,41,42,41,42,41,42,41,42,43,66,30,18,18,18,18,18,18,18,33,65,65,
    65,64,64,64,65,64,64,64,64,64,64,65,65,65,65,65,65,65,65,65,65,65,65,40,41,42,43,66,66,66,66,66,66,66,66,66,66,66,66,40,41,42,41,42,41,42,42,43,65,65
];

//Character
function Character()
{
    this.tileFrom = [4,4];
    this.tileTo = [4,4];
    this.timeMoved = 0;
    this.dimensions = [TILE_WIDTH, TILE_HEIGHT];
    this.position = [128,128];                        //pixels
    this.delayMove = 300;                           //ms
}

//Places character at x,y location
Character.prototype.placeAt = function(x,y)
{
    this.tileFrom = [x,y];
    this.tileTo = [x,y];
    this.position = [((TILE_WIDTH * x) + ((TILE_WIDTH-this.dimensions[0])/2)), ((TILE_HEIGHT * y) + ((TILE_HEIGHT - this.dimensions[1])/2))];
};

//Character movement
Character.prototype.processMovement = function(t)
{
    if(this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1])
    {
        return false;
    }

    if((t-this.timeMoved) >= this.delayMove)
    {
        this.placeAt(this.tileTo[0], this.tileTo[1]);
    }
    else
    {
        this.position[0] = (this.tileFrom[0] * TILE_WIDTH) + ((TILE_WIDTH - this.dimensions[0])/2);
        this.position[1] = (this.tileFrom[1] * TILE_HEIGHT) + ((TILE_HEIGHT - this.dimensions[1])/2);

        //horizontal movement
        if(this.tileTo[0] != this.tileFrom[0])
        {
            var diff = (TILE_WIDTH / this.delayMove) * (t - this.timeMoved);
            this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
        }

        //vertical movement
        if(this.tileTo[1] != this.tileFrom[1])
        {
            var diff = (TILE_HEIGHT / this.delayMove) * (t - this.timeMoved)
            this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
        }

        this.position[0] = Math.round(this.position[0]);
        this.position[1] = Math.round(this.position[1]);
    }

    return true;
};

function toIndex(x,y)
{
    return ((y * mapWidth + x));
}

window.onload = function()
{
    //define context
    ctx = document.getElementById('game').getContext('2d');

    //define global font
    ctx.font = "10pt consolas";

    //Keydown listener
    window.addEventListener("keydown", function(e)
    {
        if(e.keyCode>=37 && e.keyCode <= 40)
        {
            keysDown[e.keyCode] = true;
        }
    });

    //Keyup listener
    window.addEventListener("keyup", function(e)
    {
        if(e.keyCode>=37 && e.keyCode <= 40)
        {
            keysDown[e.keyCode] = false;
        }
    });

}

function drawGame()
{
    //loop!
    requestAnimationFrame(drawGame);

    //If context doesn't exist, don't do anything
    if(ctx == null)
    {
        return;
    }

    //frame rate calculations
    var currentFrameTime = Date.now();                      //ms
    var timeElapsed = currentFrameTime - lastFrameTime;
    var sec = Math.floor(Date.now()/1000);

    if (sec != currentSecond)
    {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else
    {
        frameCount++;
    }

    //player movement
    if(!player.processMovement(currentFrameTime))
    {
        //check if movement is allowed
        //(38 = UP)
        if(keysDown[38] && player.tileFrom[1] > 0 && collisionMap[toIndex(player.tileFrom[0], player.tileFrom[1] - 1)] == 1)
        {
            player.tileTo[1] -= 1;
        }
        //(40 = DOWN)
        else if(keysDown[40] && player.tileFrom[1] < (mapHeight -1) && collisionMap[toIndex(player.tileFrom[0], player.tileFrom[1] + 1)] == 1)
        {
            player.tileTo[1] += 1;
        }
        //(37 = LEFT)
        if(keysDown[37] && player.tileFrom[0] > 0 && collisionMap[toIndex(player.tileFrom[0] - 1, player.tileFrom[1])] == 1)
        {
            player.tileTo[0] -= 1;
        }
        //(39 = RIGHT)
        else if(keysDown[39] && player.tileFrom[0] < (mapWidth -1) && collisionMap[toIndex(player.tileFrom[0] + 1, player.tileFrom[1])] == 1)
        {
            player.tileTo[0] += 1;
        }

        //if tileFrom and tileTo don't match, the player is moving
        if(player.tileFrom[0] != player.tileTo[0] || player.tileFrom[1] != player.tileTo[1])
        {
            player.timeMoved = currentFrameTime;
        }
    }



    //draw map
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            //gets the value of the element at pos x,y
            let value = gameMap[x + mapWidth * y];

            //placeholders for the top-left corner positions of the tile within the tileset
            let tileSetPosX = 0;
            let tileSetPosY = 0;

            /*
                this if statement is to get the pixel position within the sprite sheet based on the value in map[]
                -- tile set has 10 columns of tiles max, but any number of rows
                -- map[n] returns value which is represented as a concatenated row and column
                ----- eg. if value is 65, the tile is in the 6th row and 5th column of the tileset
                ----- with this understood, we can find the top left corner of each tile

                * adjust if statement to reflect the number of rows in your tileset by continuing the sequence of if/else
            */

            //first row
            if(value > 0 && value < 10)
            {
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 0;
            }
            //second row
            else if(value > 9 && value < 20)
            {
                //reduce to a number 0-9
                value -= 10;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;;
 
                //top-left pixel ypos
                tileSetPosY = 32;
            }
            //third row
            else if(value > 19 && value < 30)
            {
                //reduce to a number 0-9
                value -= 20;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 64;
            }
            //fourth row
            else if(value > 29 && value < 40)
            {
                //reduce to a number 0-9
                value -= 30;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 96;
            }
            //fifth row
            else if(value > 39 && value < 50)
            {
                //reduce to a number 0-9
                value -= 40;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 128;
            }
            //sixth row
            else if(value > 49 && value < 60)
            {
                //reduce to a number 0-9
                value -= 50;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 160;
            }
            //seventh row
            else
            {
                //reduce to a number 0-9
                value -= 60;
 
                //top-left pixel xpos
                tileSetPosX = TILE_SIZE_INITIAL * value;
 
                //top-left pixel ypos
                tileSetPosY = 192;
            }

            let drawX = x * TILE_SIZE_INITIAL;
            let drawY = y * TILE_SIZE_INITIAL;

            //draw the tile
            /*
                drawImage()
                -- source,
                -- top-left x pos in source,
                -- top-left y pos in source,
                -- x-axis amount to take from source,
                -- y-axis amount to take from source,
                -- top-left x pos of drawing area,
                -- top-left y pos of drawing area,
                -- x-axis amount to draw to
                -- y-axis amount to draw to
            */
            ctx.drawImage(tileSet, tileSetPosX, tileSetPosY, TILE_WIDTH, TILE_HEIGHT, drawX, drawY, TILE_SIZE_INITIAL, TILE_SIZE_INITIAL);


            //define player color
            ctx.fillStyle ="#0000ff";

            //draw player (rect)
            ctx.fillRect(player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);

            //define font color
            ctx.fillStyle = "#ff0000";

            //draw frame rate
            ctx.fillText("FPS: " + framesLastSecond, 10, 20);
 
            //update FPS
            lastFrameTime = currentFrameTime;
        }
    }
}


//Wait for tileset to load before launching game loop
tileSet.addEventListener("load", (event)=>{drawGame();});
