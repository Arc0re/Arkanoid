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
var bricks = []; // Array qui contient toutes les briques
var brick_rows = 5;
var brick_cols = 10;
var brick_width = (canvas_width / brick_cols) - 1;
var brick_height = 15;
var brick_padding = 1;

/* Paddle */
var pad_x = canvas_width / 2;
var pad_width = 75;
var pad_height = 15;

/* Other */
var player_lives = 3;
var row_height = brick_height + brick_padding;
var col_width = brick_width + brick_padding;
var is_ball_out = false;

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

function display_lives()
{
	// TODO: Changer pour des balles
	display_text("LIVES: " + player_lives, 25, 5, canvas_height - 20, false);
}

function display_bricks()
{
	for (var i = 0; i < brick_rows; i++) {
		for (var j = 0; j < brick_cols; j++) {
			if (bricks[i][j] === 1) {
				display_brick(j * (brick_width + brick_padding), i * (brick_height + brick_padding), brick_width, brick_height);
			}
		}
	}
}

/****************************************************************/

/* Game */

function init_bricks_array()
{
	for (var x = 0; x < brick_rows; x++) {
		bricks[x] = [];
		for (var y = 0; y < brick_cols; y++) {
			bricks[x][y] = 1;
		}
	}
}

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



/****************************************************************/

function ark_ts()
{
	/* Title screen */
	display_text("CLICK TO PLAY", 25, canvas_width / 2, canvas_height / 2, true);
}

function ark_init()
{
	clear_screen(); /* Erase titlescreen */

	init_ball();
	init_bricks_array();
	
	/* Game loop */
	ark_loop();
}

/* Display all the things */
function ark_draw()
{
	clear_screen();
	display_ball(ball_x, ball_y, ball_r);
	display_pad();
	display_bricks();
	display_lives();
}

/* Handle mouse and kb events */
function handle_events()
{
	$(document).keydown(function(e) {
		switch (e.keyCode) {
		case K_LEFT:
			pad_x -= 25;
			break;
		case K_RIGHT:
			pad_x += 25;
			break;
		}
		/* TODO: pause */
	});

	$(document).mousemove(function(e) {
		/* TODO: Doesn't work
		if (e.pageX > canvas_left_offset && e.pageY < canvas_right_offset) {
			pad_x = e.pageX - canvas_left_offset - pad_width / 2;
			console.log("Inside if");
		}
		*/

		pad_x = e.pageX - canvas_left_offset - pad_width / 2;
		//pad_x = e.pageX;
	});
}

function move_ball()
{
	var current_ball_row = Math.floor((ball_y - ball_r) / row_height); 
	var current_ball_col = Math.floor(ball_x / col_width);

	// Si la balle est dans une brique
	if (ball_y - ball_r * row_height && current_ball_row >= 0 && current_ball_col >= 0 /*&& bricks[current_ball_row][current_ball_col] == 1*/) {
		if (bricks[current_ball_row][current_ball_col] == 1) {
			ball_dy = -ball_dy; // On inverse la trajectoire
			bricks[current_ball_row][current_ball_col] = 0; // On marque la brique comme cassee
		}
	}

	// Deplacer la balle en x
	if (ball_x + ball_dx > canvas_width || ball_x + ball_dx < 0) {
		ball_dx = -ball_dx;	
	}
	// Deplacer la balle en y
	if (ball_y + ball_dy < 0) {
		ball_dy = -ball_dy;
	} else if (ball_y + ball_dy + ball_r > canvas_height - pad_height) {
		// Touche le pad ?
		if (ball_x + ball_r > pad_x && ball_x - ball_r < pad_x + pad_width) {
			ball_dx = 12 * ((ball_x - (pad_x + pad_width / 2)) / pad_width); 
			ball_dy = -ball_dy;
		} else {
			is_ball_out = true;
		}
	}

	// Move ball
	ball_x += ball_dx;
	ball_y += ball_dy;
}

/* Launch the game on click, starts main loop (ark_loop) */
ark_ts(); // Affiche l'ecran titre
canvas.click(ark_init); // TODO: empecher clic apres
handle_events();

/* Game loop, called by ark_init */
function ark_loop(timer)
{
	console.log("Frames: " + timer);
	move_ball();
	ark_draw();
	window.requestAnimationFrame(ark_loop);
}
