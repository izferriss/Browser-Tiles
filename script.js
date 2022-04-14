const Player = function(x,y){
    this.x = x;
    this.y = y;
};

Player.prototype = {

    moveTo:function(x,y)
    {
        this.x += (x - this.x - spriteWidth) * 0.05;
        this.y += (y - this.y - spriteHeight) * 0.05;
    }
};

const ViewPort = function(x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
};

ViewPort.prototype = {

    scrollTo:function(x,y)
    {
        this.x = x - this.w/2;
        this.y = y - this.h/2;
    }
};

var player = new Player(384, 256);
var viewport = new ViewPort(320, 320, 640, 640);

var pointer = {x: 0, y:0};
var context = document.querySelector("canvas").getContext("2d");
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;
var tileSize = 32;
var spriteWidth = tileSize;
var spriteHeight = 48;
var scaled_size = 2;
var columns = 50;
var rows = 25;
var numTiles = rows * columns;

var map =
   [65,65,65,65,65,65,65,65,65,10,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,12,11,13,65,65,65,65,65,65,65,65,65,
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
    65,64,64,64,65,64,64,64,64,64,64,65,65,65,65,65,65,65,65,65,65,65,65,40,41,42,43,66,66,66,66,66,66,66,66,66,66,66,66,40,41,42,41,42,41,42,42,43,65,65]

    function loop()
    {
        window.requestAnimationFrame(loop);
        height = document.documentElement.clientHeight;
        width = document.documentElement.clientWidth;

        context.canvas.height = height;
        context.canvas.width = width;

        context.imageSmoothingEnabled = false;

        player.moveTo(pointer.x, pointer.y);
        viewport.scrollTo(player.x, player.y);

        var x_min = Math.floor(viewport.x/(tileSize * scaled_size));
        var y_min = Math.floor(viewport.y/(tileSize * scaled_size));
        var x_max = Math.ceil((viewport.x + viewport.w) / (tileSize * scaled_size));
        var y_max = Math.ceil((viewport.y + viewport.h) / (tileSize * scaled_size));

        //don't draw past boundaries
        if (x_min < 0)
        {
            x_min = 0;
        }
        if (y_min < 0)
        {
            y_min = 0;
        }
        if (x_max > columns)
        {
            x_max = columns;
        }
        if(y_max > rows)
        {
            y_max = rows;
        }

        let counter = 0;

        for(let y = y_min; y < y_max; y++)
        {
            for(let x = x_min; x < x_max; x++)
            {
                let value = map[x + columns * y];
                let tileSheetPos_y = 0;
                let tileSheetPos_x = 0;

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
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 0;
                }
                //second row
                else if(value > 9 && value < 20)
                {
                    //reduce to a number 0-9
                    value -= 10;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 32;
                }
                //third row
                else if(value > 19 && value < 30)
                {
                    //reduce to a number 0-9
                    value -= 20;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 64;
                }
                //fourth row
                else if(value > 29 && value < 40)
                {
                    //reduce to a number 0-9
                    value -= 30;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 96;
                }
                //fifth row
                else if(value > 39 && value < 50)
                {
                    //reduce to a number 0-9
                    value -= 40;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 128;
                }
                //sixth row
                else if(value > 49 && value < 60)
                {
                    //reduce to a number 0-9
                    value -= 50;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 160;
                }
                //seventh row
                else
                {
                    //reduce to a number 0-9
                    value -= 60;

                    //top-left pixel xpos
                    tileSheetPos_x = tileSize * value;

                    //top-left pixel ypos
                    tileSheetPos_y = 192;
                }

                //define the size of the tile to be drawn
                let tile_x = (x * tileSize * scaled_size) - viewport.x + width/2 - viewport.w/2;
                let tile_y = (y * tileSize * scaled_size) - viewport.y + height/2 - viewport.h/2;

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
                context.drawImage(tileSheet, tileSheetPos_x, tileSheetPos_y, tileSize, tileSize, tile_x, tile_y, tileSize * scaled_size, tileSize * scaled_size);

                counter++;
            }
        }

        player.moveTo(pointer.x, pointer.y);
        context.drawImage(playerSheet_down, 0, 0, spriteWidth, spriteHeight, Math.round(player.x - viewport.x + (width/2) - (viewport.w/2)), Math.round(player.y - viewport.y + (height/2) - (viewport.h/2)), spriteWidth * scaled_size, spriteHeight * scaled_size);

        //viewport clip frame
        context.strokeStyle = "#ffff00";
        context.rect(width/2 - viewport.w/2 ,height/2 - viewport.h/2, viewport.w, viewport.h);
        context.stroke();

    }
    var tileSheet = new Image();
    tileSheet.src="dungeonTiles.png";
    var playerSheet_up = new Image();
    playerSheet_up.src = "suikStyle_up.png";
    var playerSheet_down = new Image();
    playerSheet_down.src = "suikStyle_down.png";
    var playerSheet_left = new Image();
    playerSheet_left.src = "suikStyle_leftright.png";
    var playerSheet_right = new Image();
    playerSheet_right.src = "suikStyle_leftright.png";


    tileSheet.addEventListener("load", (event)=>{loop();});

    context.canvas.addEventListener("click", (event)=>
    {
        pointer.x = event.pageX + viewport.x - width/2 + viewport.w/2;
        pointer.y = event.pageY + viewport.y - height/2 + viewport.h/2;
    });

