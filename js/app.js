/*Card Array*/
let faces = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],

    /*Simplifying Selectors*/
    $container = $('.container'),
    $scorePanel = $('.score-panel'),
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck'),

    /*Variables*/
    nowTime,
    allOpen = [],
    match = 0,
    min = 00,
    sec = 00,
    hours = 00,
    clearTime = -1,
    letsStop = 0,
    moves = 0,
    wait = 420,
    totalCard = faces.length / 2,

    /*Scoring Tiers*/
    high = 14,
    medium = 16,
    low = 20;

/*Starts timer on window load and formats time*/
let startTimer = window.onload = function() {
    setInterval(function() {
        if (letsStop !== 1) {
            sec++;
        if (sec === 60) {
            min++;
            sec = 00;
    }
    $('.timer').html(min + ':' + sec);
    console.log(min);
    console.log(sec);
    }
    let formattedSec = "0";
    if (sec < 10) {
        formattedSec += sec
    } else {
        formattedSec = String(sec);
    }

    let time = String(min) + ":" + formattedSec;
    $(".timer").text(time);
    }, 1000);

};

/*Resets clock when called*/
function resetTimer() {
    clearInterval(clearTime);
    sec = 0;
    min = 0;
    $(".timer").text("0:00");
};


/*Shuffle function provided by Udacity*/
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*Begins game and shuffles deck when called*/
function init() {

    let allCards = shuffle(faces);
    $deck.empty();
    match = 0;
    moves = 0;
    $moves.text('0');

    /*Loop creates <li> tags and adds class to card array names*/
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }
    addCardListener();
}

/*Function that determines score*/
function rating(moves) {
    let rating = 3;
    if (moves > high && moves < medium) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > medium && moves < low) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > low) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return { score: rating };
}

/*Pop-up alert window, Courtesy of SweetAlert2*/
function gameOver(moves, score) {
	swal({
		allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
		title: 'Congratulations! You Won!',
		text: 'It took you ' + moves + ' Moves and ' + min + ':' + sec + ' to earn ' + score + ' Stars.',
        type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Go again?'
	}).then(function (isConfirm) {
		if (isConfirm) {
            $rating.removeClass('fa-star-o').addClass('fa-star');
            resetTimer();
			init();
        }
	})
}

/*Binds to reset button and resets game when Functions are called*/
$restart.bind('click', function (confirmed) {
    if (confirmed) {
        $rating.removeClass('fa-star-o').addClass('fa-star');
        resetTimer();
        init();
    }
});

/*Main game logic*/
let addCardListener = function () {
    $deck.find('.card').bind('click', function () {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        let card = $this.context.innerHTML;
        $this.addClass('open show');
        allOpen.push(card);

        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match animated rubberBand');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show animated infinite rubberBand');
                }, wait);
                match++;

                /*If cards don't match, call animation*/
            } else {
                $deck.find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
                }, wait / 1.5);
            }

            /*Game Logic Variables*/
            allOpen = [];
            moves++;
            rating(moves);
            $moves.html(moves);
        }

        /*Game over when all cards match*/
        if (totalCard === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

init();