var canvas = $("#arkanoid");
var context = $(canvas)[0].getContext("2d");

/* Keyboard codes */
var K_LEFT = 37;
var K_RIGHT = 39;

/* Canvas props */
var canvas_width = $(canvas).width();
var canvas_height = $(canvas).height();
var canvas_left_offset = $(canvas).offset().left;
var canvas_right_offset = $(canvas).offset().right;

/* Ball */
var ball_x;
var ball_y;
var ball_r = 5; // Rayon de la balle
var ball_dx; // mvt en x
var ball_dy;

/* Bricks */
var bricks = [];
var brick_rows = 5;
var brick_cols = 10;
var brick_width = (canvas_width / brick_cols) - 1;
var brick_height = 15;
var brick_padding = 1;

/* Paddle */
var pad_x = canvas_width / 2;
var pad_width = 75;
var pad_height = 15;

var player_lives = 3;

/****************************************************************/

/* Display stuff */

function display_ball(x, y, r) // TODO: remplacer ball par dot
{
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
}

function display_brick(x, y, w, h)
{
	context.beginPath();
	context.rect(x, y, w, h);
	context.closePath();
	context.fill();
}

function display_pad()
{
	display_brick(pad_x, canvas_height - 50, pad_width, pad_height);
}

function display_text(text, size, x, y, is_centered)
{
	context.font = size + "px Verdana";
	if (is_centered) {
		context.textAlign = "center";
	}
	context.fillText(text, x, y);
	context.textAlign = "left";
}

/****************************************************************/

/* Game */

function init_ball()
{
	/* Centre la balle */
	ball_x = canvas_width / 2;
	ball_y = canvas_height / 2;
	ball_dx = 2;
	ball_dy = 4;
}

function clear_screen()
{
	context.clearRect(0, 0, canvas_width, canvas_height);
}

function display_lives()
{
	// TODO: Changer pour des balles
	display_text("LIVES: " + player_lives, 25, 5, canvas_height - 20, false);
}

/* Main */
function init_arkanoid()
{
	/* Title screen */
	display_text("CLICK TO PLAY", 25, canvas_width / 2, canvas_height / 2, true);
	
	/* Launch game */
	canvas.click(arkanoid);
}

function init_bricks_array(array)
{
	for (var x = 0; x < brick_rows; x++) {
		array[x] = [];
		for (var y = 0; y < brick_cols; y++) {
			array[x][y] = 1;
		}
	}
}

/* Game (loop, etc) aka draw() */
function arkanoid()
{
	clear_screen(); /* Erase titlescreen */

	init_ball();
	init_bricks_array(bricks);

	display_lives();
	display_ball(ball_x, ball_y, ball_r);
	display_pad();
	
	/* Display all the bricks */
	for (var i = 0; i < brick_rows; i++) {
		for (var j = 0; j < brick_cols; j++) {
			if (bricks[i][j] === 1) {
				//console.log("i, j: " + i + " " + j);
				display_brick(j * (brick_width + brick_padding), i * (brick_height + brick_padding), brick_width, brick_height);
			}
		}
	}

	/* Move pad */
	$(document).mousemove(function(e) {
		//console.log("Mousemove: x, y " + e.pageX + " " + e.pageY);
		console.log("Pad_x: " + pad_x);
		pad_x = e.PageX;
		if (e.pageX > canvas_left_offset && e.pageY < canvas_right_offset) {
			pad_x = e.pageX - canvas_left_offset - pad_width / 2;
			console.log("Inside if");
		}
	});

	/*
	$(document).keydown(function(e) {
		console.log(e.keyCode);
		switch (e.keyCode) {
		case K_LEFT:
			pad_x += 5;
			break;
		case K_RIGHT:
			pad_x -= 5;
			break;
		}
	});
	*/

	/* Refresh */
	window.requestAnimationFrame(arkanoid);
}

/* Launch the game on click */
init_arkanoid();
