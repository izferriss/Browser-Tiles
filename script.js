const TILE_SIZE_INITIAL = 32;                       //pixels
const TILE_WIDTH = 32;                              //pixels
const TILE_HEIGHT = 32;                             //pixels
const SCALE = 2;                                    //multiplier
const TILE_SIZE_SCALED = TILE_SIZE_INITIAL * SCALE; //pixels
const TILE_BG_COLOR = "#1B1B1B";                    //BG color of tileset
const MAP_WIDTH = 50;                               //number of tiles
const MAP_HEIGHT = 25;                              //number of tiles
var ctx = null;                                     //context

//Tileset
var tileSet = null;
var tileSetLoaded = false;
var tileSetPath = "dungeonTiles.png";

//Frame rate vars
var currentSecond = 0;
var frameCount = 0;
var framesLastSecond = 0;
var lastFrameTime = 0;

//allowed keys
var keysDown =
{
    37: false,  //LEFT
    38: false,  //UP
    39: false,  //RIGHT
    40: false,   //DOWN
    65: false,  //a
    87: false,  //w
    68: false,  //d
    83: false  //s
};

//directions
var directions =
{
    up      :   0,
    right   :   1,
    down    :   2,
    left    :   3
};

//Character
var player = new Character();
var playerSet = null;
var playerSetLoaded = false;
var playerSetPath = "simpleDirectionSheet.png";

//1: passable
//0: impassable
var collisionMap =
[
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,
    1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,
    1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,
    1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,
    1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,
    1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,1,1,1,
    1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1
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

//Viewport
var viewport =
{
    screen : [0,0],
    startTile: [0,0],
    endTile: [0,0],
    offset: [0,0],
    update: function(px, py)
    {
        this.offset[0] = Math.floor((this.screen[0]/2) - px);
        this.offset[1] = Math.floor((this.screen[1]/2) - py);

        var tile =
        [
            Math.floor(px/TILE_WIDTH),
            Math.floor(py/TILE_HEIGHT)
        ];

        this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / TILE_WIDTH);
        this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / TILE_HEIGHT);

        if(this.startTile[0] < 0)
        {
            this.startTile[0] = 0;
        }
        if(this.startTile[1] < 0)
        {
            this.startTile[1] = 0;
        }

        this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / TILE_WIDTH);
        this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / TILE_HEIGHT);

        if(this.endTile[0] >= MAP_WIDTH)
        {
            this.endTile[0] = MAP_WIDTH - 1;
        }
        if(this.endTile[1] >= MAP_HEIGHT)
        {
            this.endTile[1] = MAP_HEIGHT - 1;
        }
    }
};

//Character
function Character()
{
    this.tileFrom = [25,23];
    this.tileTo = [25,23];
    this.timeMoved = 0;
    this.dimensions = [TILE_WIDTH, TILE_HEIGHT];
    this.position = [800,736];                          //pixels
    this.delayMove = 300;                               //ms
    this.direction = directions.up;

    this.sprites = {};
    this.sprites[directions.up]     =   [{x:0, y:0, w:32, h:32}];
    this.sprites[directions.right]  =   [{x:32, y:0, w:32, h:32}];
    this.sprites[directions.down]   =   [{x:64, y:0, w:32, h:32}];
    this.sprites[directions.left]   =   [{x:96, y:0, w:32, h:32}];

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

//Is character allowed to move?
Character.prototype.canMoveTo = function(x,y)
{
    if(x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT)
    {
        return false;
    }
    if(collisionMap[toIndex(x,y)] != 1)
    {
        return false;
    }

    return true;
};

//Is character allowed to move up?
Character.prototype.canMoveUp = function ()
{
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1);
};

//Is character allowed to move down?
Character.prototype.canMoveDown = function ()
{
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1);
};

//Is character allowed to move left?
Character.prototype.canMoveLeft = function ()
{
    return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]);
};

//Is character allowed to move right?
Character.prototype.canMoveRight = function ()
{
    return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]);
};

//character navigation (LEFT)
Character.prototype.moveLeft = function(t)
{
    this.tileTo[0] -= 1;
    this.timeMoved = t;
    this.direction = directions.left;
};

//character navigation (RIGHT)
Character.prototype.moveRight = function(t)
{
    this.tileTo[0] += 1;
    this.timeMoved = t;
    this.direction = directions.right;
};

//character navigation (UP)
Character.prototype.moveUp = function(t)
{
    this.tileTo[1] -= 1;
    this.timeMoved = t;
    this.direction = directions.up;
};

//character navigation (DOWN)
Character.prototype.moveDown = function(t)
{
    this.tileTo[1] += 1;
    this.timeMoved = t;
    this.direction = directions.down;
};

//Returns the value of the element of the array at pos x,y
function toIndex(x,y)
{
    return ((y * MAP_WIDTH + x));
}

//Handle events when the page loads
window.onload = function()
{
    //define context
    ctx = document.getElementById('game').getContext('2d');

    //start loop
    requestAnimationFrame(drawGame);

    //define global font
    ctx.font = "10pt consolas";

    //Keydown listener
    window.addEventListener("keydown", function(e)
    {
        if((e.keyCode>=37 && e.keyCode <= 40) || e.keyCode == 65 || e.keyCode == 87 || e.keyCode == 68 || e.keyCode == 83)
        {
            keysDown[e.keyCode] = true;
        }
    });

    //Keyup listener
    window.addEventListener("keyup", function(e)
    {
        if((e.keyCode>=37 && e.keyCode <= 40) || e.keyCode == 65 || e.keyCode == 87 || e.keyCode == 68 || e.keyCode == 83)
        {
            keysDown[e.keyCode] = false;
        }
    });

    //Viewport
    viewport.screen =
    [
        document.getElementById('game').width,
        document.getElementById('game').height
    ];

    tileSet = new Image();

    //Tile set loading
    tileSet.onerror = function()
    {
        ctx = null;
        alert("Failed loading tile set!");
    };

    tileSet.onload = function()
    {
        tileSetLoaded = true;
    }

    tileSet.src = tileSetPath;

    playerSet = new Image();
    //Player set loading
    playerSet.onerror = function()
    {
        ctx = null;
        alert("Failed loading player set!");
    };

    playerSet.onload = function()
    {
        playerSetLoaded = true;
    }

    playerSet.src = playerSetPath;
}

//Game loop
function drawGame()
{
    //If context doesn't exist, don't do anything
    if(ctx == null)
    {
        return;
    }

    //If any of the graphics haven't loaded, try again
    if(!tileSetLoaded || !playerSetLoaded)
    {
        requestAnimationFrame(drawGame);
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
        //UP
        if((keysDown[38] || keysDown[87]) && player.canMoveUp())
        {
            player.moveUp(currentFrameTime);
        }
        //DOWN
        else if((keysDown[40] || keysDown[83]) && player.canMoveDown())
        {
            player.moveDown(currentFrameTime);
        }
        //LEFT
        if((keysDown[37] || keysDown[65]) && player.canMoveLeft())
        {
            player.moveLeft(currentFrameTime);
        }
        //RIGHT
        else if((keysDown[39] || keysDown[68]) && player.canMoveRight())
        {
            player.moveRight(currentFrameTime);
        }

        //if tileFrom and tileTo don't match, the player is moving
        if(player.tileFrom[0] != player.tileTo[0] || player.tileFrom[1] != player.tileTo[1])
        {
            player.timeMoved = currentFrameTime;
        }
    }

    //update viewport camera
    viewport.update(player.position[0] + (player.dimensions[0]/2), player.position[1] + (player.dimensions[1]/2));

    //If the tileset isn't drawn at points on the canvas, show a bg color instead
    ctx.fillStyle = TILE_BG_COLOR;
    ctx.fillRect(0,0, viewport.screen[0], viewport.screen[1]);


    //draw map
    for(var y = viewport.startTile[1]; y < viewport.endTile[1] + 1; y++)
    {
        for(var x = viewport.startTile[0]; x < viewport.endTile[0] + 1; x++)
        {
            //gets the value of the element at pos x,y
            let value = gameMap[x + MAP_WIDTH * y];

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
            ctx.drawImage(tileSet, tileSetPosX, tileSetPosY, TILE_WIDTH, TILE_HEIGHT, viewport.offset[0] + drawX, viewport.offset[1] + drawY, TILE_SIZE_INITIAL, TILE_SIZE_INITIAL);

        }
    }

     //player
     var sprite = player.sprites[player.direction];
     ctx.drawImage(playerSet, sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h, viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1], player.dimensions[0], player.dimensions[1]);
    

     //FPS
     let fps = document.getElementById("dev");
     fps.innerHTML = "FPS: " + framesLastSecond;

     if(framesLastSecond >= 60)
     {
         fps.style.backgroundColor = "green";
     }
     else if(framesLastSecond < 60 && framesLastSecond >= 30)
     {
         fps.style.backgroundColor = "yellow";
     }
     else
     {
         fps.style.backgroundColor = "red";
     }

     //update FPS
     lastFrameTime = currentFrameTime;
     requestAnimationFrame(drawGame);
}


//Wait for tileset to load before launching game loop
//tileSet.addEventListener("load", (event)=>{drawGame();});
