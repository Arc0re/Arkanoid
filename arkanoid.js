var canvas = $("#arkanoid");
var context = $(canvas)[0].getContext("2d");

/* Clavier */
var K_LEFT = 37;
var K_RIGHT = 39;

/* Canvas */
var canvas_width = $(canvas).width();
var canvas_height = $(canvas).height();
var canvas_left_offset = $(canvas).offset().left;
var canvas_right_offset = $(canvas).offset().right;

/* Balle */
var ball_x;
var ball_y;
var ball_r = 5; // Rayon de la balle
var ball_dx; // mvt en x
var ball_dy; // mvt en y

/* Briques */
var bricks = []; // Array qui contient toutes les briques
var brick_rows = 5;
var brick_cols = 10;
var brick_width = (canvas_width / brick_cols) - 1;
var brick_height = 15;
var brick_padding = 1;

/* Raquette */
var pad_x = canvas_width / 2;
var pad_width = 75;
var pad_height = 15;

/* Autres */
var player_lives = 3;
var row_height = brick_height + brick_padding;
var col_width = brick_width + brick_padding;
var is_ball_out = false;

/****************************************************************/

/*
 * Fonctions d'affichage
 */

/* Afficher la balle */
function display_ball(x, y, r) // TODO: remplacer ball par dot ?
{
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
}

/* Afficher un rectangle */
function display_rect(x, y, w, h)
{
	context.beginPath();
	context.rect(x, y, w, h);
	context.closePath();
	context.fill();
}

/* Afficher la raquette */
function display_pad()
{
	display_rect(pad_x, canvas_height - pad_height, pad_width, pad_height);
}

/* Afficher du texte */
function display_text(text, size, x, y, is_centered)
{
	context.font = size + "px Verdana";
	if (is_centered) {
		context.textAlign = "center";
	}
	context.fillText(text, x, y);
	context.textAlign = "left";
}

/* Afficher les vies */
function display_lives()
{
	// TODO: Changer pour des balles
	display_text("LIVES: " + player_lives, 25, 5, canvas_height - 20, false);
}

/* Afficher les briques */
function display_bricks()
{
	for (var i = 0; i < brick_rows; i++) {
		for (var j = 0; j < brick_cols; j++) {
			if (bricks[i][j] === 1) {
				display_rect(j * (brick_width + brick_padding), i * (brick_height + brick_padding), brick_width, brick_height);
			}
		}
	}
}

/* Afficher l'ecran titre (titlescreen) */
function display_ts()
{
	display_text("CLICK TO PLAY", 25, canvas_width / 2, canvas_height / 2, true);
}

/* Nettoyer la frame */
function clear_screen()
{
	context.clearRect(0, 0, canvas_width, canvas_height);
}


/****************************************************************/

/*
 * Fonctions d'initialisation
 */

/* Remplit et met a 1 le tableau de briques */
function init_bricks_array()
{
	for (var x = 0; x < brick_rows; x++) {
		bricks[x] = [];
		for (var y = 0; y < brick_cols; y++) {
			bricks[x][y] = 1;
		}
	}
}

/* Fixe la position de depart et la vitesse de la balle */
function init_ball()
{
	// Centre la balle 
	ball_x = canvas_width / 2;
	ball_y = canvas_height / 2;
	ball_dx = 2;
	ball_dy = 4;
}

/* Execute toutes les initialisations et lance le jeu */
function game_init()
{
	clear_screen(); // Effacer l'ecran titre

	init_ball();
	init_bricks_array();
	
	game_loop();
}

/****************************************************************/

/*
 * Fonctions du jeu
 */

/* Afficher la frame */
function draw_current_frame()
{
	clear_screen();
	display_ball(ball_x, ball_y, ball_r);
	display_pad();
	display_bricks();
	display_lives();
}

/* Gere les events clavier et souris */
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
		/* TODO: restart */
	});

	$(document).mousemove(function(e) {
		/* TODO: Empecher la raquette de sortir
		if (e.pageX > canvas_left_offset && e.pageY < canvas_right_offset) {
			pad_x = e.pageX - canvas_left_offset - pad_width / 2;
			console.log("Inside if");
		}
		*/

		pad_x = e.pageX - canvas_left_offset - pad_width / 2;
	});
}

/* Gere les mouvements et collisions de la balle */
function move_ball()
{
	var current_ball_row = Math.floor((ball_y - ball_r) / row_height); 
	var current_ball_col = Math.floor(ball_x / col_width);
	//console.log("row: " + current_ball_row + "\ncol:" + current_ball_col);

	// Collisions briques
	if (current_ball_row < brick_rows && current_ball_row >= 0
	    && current_ball_col < brick_cols && current_ball_col >= 0) {
		if (bricks[current_ball_row][current_ball_col] === 1) {
			ball_dy = -ball_dy; // On inverse
			bricks[current_ball_row][current_ball_col] = 0; // On marque la brique comme cassee
		}
	}

	// Collisions ball_x
	if (ball_x + ball_dx > canvas_width || ball_x + ball_dx < 0) {
		ball_dx = -ball_dx;	
	}

	// Collisions ball_y et pad 
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

	// Deplace la balle
	ball_x += ball_dx;
	ball_y += ball_dy;

	// Vies TODO
	if (is_ball_out) {
		//player_lives--;
	}
}

/****************************************************************/

/*
 * MAIN
 * Point de depart du jeu
 */

display_ts();
canvas.click(game_init); // Demarre le jeu au clic TODO: empecher clic apres
handle_events();

/* Game loop, call par game_init */
function game_loop(timer)
{
	//console.log("Frames: " + timer);
	move_ball();
	draw_current_frame();
	window.requestAnimationFrame(game_loop);
}
