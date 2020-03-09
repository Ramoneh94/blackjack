/*  JavaScript implementation of blackjack

main issues:

1. First, cannot figure out how to combine the javascript library card.js 
with blackjack code to replace text with actual images.

2. When the player presses stay, it should automatically go the dealer, 
but instead the player has to press "stay" twice and it results in an interrupted game flow. 
issue RESOLVED - As of 3/3/2020. 10:13AM

*/

//an object to hold all of the variables for the blackjack app
// to avoid global variable drama
// rename later easier variable  
const blackjack = {};

// Store important elements in variables for later manipulation
// basic game functions
blackjack.pcards = document.getElementById('pcards');
blackjack.dcards = document.getElementById('dcards');
blackjack.hitButton = document.getElementById('hit');
blackjack.stayButton = document.getElementById('stay');
blackjack.playButton = document.getElementById('play');
blackjack.textUpdates = document.getElementById('textUpdates');
blackjack.buttonBox = document.getElementById('buttonBox');
blackjack.phandtext = document.getElementById('phand');
blackjack.dhandtext = document.getElementById('dhand');
blackjack.tracker = document.getElementById('tracker');
blackjack.newgame = document.getElementById('newgame');
blackjack.choice = document.getElementById('choice');

// initialize variables to track hands/cards/etc.
blackjack.playerHand = [];
blackjack.dealerHand = [];
blackjack.deck = [];


// MAIN PROBLEM: how to display suits as imgs? Then second problem: how to assign values to imgs 
blackjack.suits = ['clubs <span class="bold">&#9827</span>', 'diamonds <span class="redcard">&#9830</span>', 'hearts <span class="redcard">&#9829</span>', 'spades <span class="bold">&#9824</span>'];
// replace values with ints? 
blackjack.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];


/* 

this section of code was provided by Reddit user u/Wambo_jambo 
and it helped point me in the right direction, I feel like I am close 
to figuring out how to connec the values with the imgs, but for now I have 
to comment this part out so that I can use the app without bugs.

const SUITS = ["hearts", "clubs", "spades", "diamonds"];
const ROYALS = ["jack", "queen", "king", "ace"];
const ROYALS_VALUES = [11, 12, 13, 14];
const BASE = 2;
const MAX = 10;

let CardObject = function(value, suit, royalty) {
    this.value = value;
    this.suit = suit;
    this.royalty = royalty;
}

CardObject.prototype.getImage = function() {
    if (this.royalty)
        return 'img/' + this.royalty + this.suit + '.png';
    return false;
}

CardObject.prototype.isRoyal = function() {
    if (this.royalty)
        return true;
    return false;
}

function buildDeck() {
    let deck = [];
    buildNonFace(deck);
    buildRoyalty(deck);
    return deck;
}

function buildNonFace(deck) {
    for (i in SUITS) {
        for (k = BASE; k <= MAX; k++) {
            const card = new CardObject(k, SUITS[i], null);
            deck.push(card);
        }
    }
}

function buildRoyalty(deck) {
    for (i in SUITS) {
        for (k in ROYALS) {
            const card = new CardObject(ROYALS_VALUES[k], SUITS[i], ROYALS[k]);
            deck.push(card);
        }
    }
}

let mainDeck = buildDeck();
window.console.log(mainDeck);

for (i in mainDeck) {
    const body = document.getElementsByTagName('body')[0];
    let p = document.createElement('p');
    p.innerHTML = mainDeck[i].value + ' | ' + mainDeck[i].suit + ' | ' + mainDeck[i].royalty;
    body.appendChild(p);
    window.console.log(mainDeck[i].getImage());
}


 */
blackjack.gameStatus = 0; // flag that game has not yet been won
blackjack.wins = 0; // flag that game has not yet been won
blackjack.draws = 0; // flag that game has not yet been won
blackjack.losses = 0; // flag that game has not yet been won
blackjack.games = 0; // flag that game has not yet been won

// Object Constructor for a card. !!! ALWAYS USE NEW WHEN MAKING A NEW CARD!!!
function card(suit, value, name) {
    this.suit = suit; // string of c/d/h/s
    this.value = value; // number 1 - 10
    this.name = name; // string of the full card name
};



var newGame = function() {
    // remove newgame button and show hit/stay buttons
    blackjack.newgame.classList.add("hidden");

    // reset text and variables for newgame
    blackjack.dcards.innerHTML = "";
    blackjack.dcards.innerHTML = "";
    blackjack.playerHand = [];
    blackjack.dealerHand = [];
    blackjack.gameStatus = 0;

    // Create the new deck
    blackjack.deck = createDeck();

    // Deal two cards to the player and two cards to the dealer
    blackjack.playerHand.push(blackjack.deck.pop());
    blackjack.playerHand.push(blackjack.deck.pop());

    // check for player victory
    if (handTotal(blackjack.playerHand) === 21) {
        blackjack.wins += 1;
        blackjack.games += 1;
        blackjack.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        blackjack.textUpdates.innerHTML = "You won! You got 21 on your initial hand!";
        track();
        blackjack.gameStatus = 2; // game is won
        return;
    }

    blackjack.dealerHand.push(blackjack.deck.pop());
    blackjack.dealerHand.push(blackjack.deck.pop());

    // check for dealer victory    
    if (handTotal(blackjack.dealerHand) === 21) {
        blackjack.games += 1;
        blackjack.losses += 1;
        blackjack.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        blackjack.textUpdates.innerHTML = "You lost! The dealer had 21 on their initial hand.";
        track();
        blackjack.gameStatus = 2; // game is won
        return;
    }

    // draw the hands if neither won on the initial deal
    drawHands();
    blackjack.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    blackjack.textUpdates.innerHTML = "The initial hands are dealt!";

};

var createDeck = function() {
    var deck = [];
    // loop through suits and values, building cards and adding them to the deck as you go
    for (var a = 0; a < blackjack.suits.length; a++) {
        for (var b = 0; b < blackjack.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";
            if (cardValue > 10) {
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (blackjack.values[b] + " of " + blackjack.suits[a] + " (" + cardValue + ")");
            } else {
                cardTitle += (blackjack.values[b] + " of " + blackjack.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(blackjack.suits[a], cardValue, cardTitle);
            deck.push(newCard);


        }
    }
    //console.log("Deck created! Deck size: " + deck.length)
    deck = shuffle(deck);
    //console.log("Deck shuffled! Deck size: " + deck.length)
    //deckPrinter(deck);
    return deck;
};



// Update the screen with the contents of the player and dealer hands
var drawHands = function() {
    let htmlswap = "";
    let ptotal = handTotal(blackjack.playerHand);
    let dtotal = handTotal(blackjack.dealerHand);
    htmlswap += "<ul>";
    for (let i = 0; i < blackjack.playerHand.length; i++) {
        htmlswap += "<li>" + blackjack.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    blackjack.pcards.innerHTML = htmlswap;
    blackjack.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; // update player hand total
    if (blackjack.dealerHand.length == 0) {
        return;
    }

    // clear the html string, re-do for the dealer, depending on if stay has been pressed or not
    htmlswap = "";
    if (blackjack.gameStatus === 0) {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        blackjack.dhandtext.innerHTML = "Dealer's Hand (" + blackjack.dealerHand[1].value + " + hidden card)"; // hide value while a card is face down
    } else {
        blackjack.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; // update dealer hand total
    }

    for (let i = 0; i < blackjack.dealerHand.length; i++) {
        // if the dealer hasn't had any new cards, don't display their face-down card
        // skip their first card, which will be displayed as hidden card
        // per the above if statement
        if (blackjack.gameStatus === 0) {
            i += 1;
        }
        htmlswap += "<li>" + blackjack.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    blackjack.dcards.innerHTML = htmlswap;
    //console.log("Player has " + blackjack.playerHand.length + " cards, dealer has " + blackjack.dealerHand.length + " cards, and deck has " + blackjack.deck.length + " cards.");

};

// return the total value of the hand 
let handTotal = function(hand) {
    //console.log("Checking hand value");
    let total = 0;
    let aceFlag = 0; // track the number of aces in the hand
    for (let i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (let j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            total += 10;
        }
    }
    // console.log("Total: " + total);
    return total;
}

// Shuffle the new deck
let shuffle = function(deck) {
    // console.log("Begin shuffle...");
    let shuffledDeck = [];
    let deckL = deck.length;
    for (let a = 0; a < deckL; a++) {
        let randomCard = getRandomInt(0, (deck.length));
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);
    }
    return shuffledDeck;
}

let getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // console.log("Min: " + min + " Max: " + max);
    return Math.floor(Math.random() * (max - min)) + min;
    // code based on sample from MDN
}

// print the deck to the console 
// only for for debugging purposes
let deckPrinter = function(deck) {
    for (let i = 0; i < deck.length; i++) {
        console.log(deck[i].name);
    }
    return
}

// Game loop begins when the play button is pressed
blackjack.playButton.addEventListener("click", newGame);

// Hit button pressed:
blackjack.hitButton.addEventListener("click", function() {
    // disable if the game has already been won
    if (blackjack.gameStatus === 2) {
        console.log("Hit clicked when game was over or already clicked.");
        return;
    }

    // deal a card to the player and draw the hands
    blackjack.playerHand.push(blackjack.deck.pop());
    drawHands();


    let handVal = handTotal(blackjack.playerHand);
    if (handVal > 21) {
        bust();
        return;
    } else if (handVal === 21) {
        victory();
        return;
    }
    blackjack.textUpdates.innerHTML = "Hit or stay?</p>";
    return;
});

// Stay button pressed:
blackjack.stayButton.addEventListener("click", function stayLoop() {
    //console.log("(1)Inside stayLoop now");
    // disable ig game already won
    if (blackjack.gameStatus === 2) {
        console.log("Stay clicked when game was over or already clicked.");
        return;
    } else if (blackjack.gameStatus === 0) // i.e. stay was just pressed
    {

        blackjack.buttonBox.classList.add("hidden"); // take away the hit and stay buttons
        let handVal = handTotal(blackjack.dealerHand);
        blackjack.gameStatus = 1; // enter the 'stay' loop
        blackjack.textUpdates.innerHTML = "The dealer reveals their hidden card";
        drawHands();
        setTimeout(stayLoop, 750); // return to the stay loop
    } else if (blackjack.gameStatus === 1) {

        // If dealer has less than 17, hit
        let handVal = handTotal(blackjack.dealerHand);
        if (handVal > 16 && handVal <= 21) // dealer stays and game resolves
        {
            drawHands();
            //console.log("----------Dealer stays, checking hands");
            let playerVal = handTotal(blackjack.playerHand);
            if (playerVal > handVal) {
                victory();
                return;
            } else if (playerVal < handVal) {
                bust();
                return;
            } else {
                tie();
                return;
            }
        }
        if (handVal > 21) {
            victory();
            return;
        } else // hit
        {
            blackjack.textUpdates.innerHTML = "Dealer hits!";
            blackjack.dealerHand.push(blackjack.deck.pop());
            drawHands();
            setTimeout(stayLoop, 750);
            return;
        }
    }
});

let victory = function() {
    blackjack.wins += 1;
    blackjack.games += 1;
    let explanation = "";
    blackjack.gameStatus = 2; // flag that the game is over
    let playerTotal = handTotal(blackjack.playerHand);
    let dealerTotal = handTotal(blackjack.dealerHand);
    if (playerTotal === 21) {
        explanation = "Your hand's value is 21!";
    } else if (dealerTotal > 21) {
        explanation = "Dealer busted with " + dealerTotal + "!";
    } else {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    blackjack.textUpdates.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

let bust = function() {
    blackjack.games += 1;
    blackjack.losses += 1;
    let explanation = "";
    blackjack.gameStatus = 2; // flag that the game is over
    let playerTotal = handTotal(blackjack.playerHand);
    let dealerTotal = handTotal(blackjack.dealerHand);
    if (playerTotal > 21) {
        explanation = "You busted with " + playerTotal + ".";
    }
    blackjack.textUpdates.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

let tie = function() {
    blackjack.games += 1;
    blackjack.draws += 1;
    let explanation = "";
    blackjack.gameStatus = 2; // flag that the game is over
    let playerTotal = handTotal(blackjack.playerHand);
    blackjack.textUpdates.innerHTML = "It's a tie at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

// update the win/loss counter
let track = function() {
    blackjack.tracker.innerHTML = "<p>Wins: " + blackjack.wins + " Draws: " + blackjack.draws + " Losses: " + blackjack.losses + "</p>";
    blackjack.newgame.classList.remove("hidden");
    blackjack.buttonBox.classList.add("hidden");
}

// check the player hand for an ace
let softCheck = function(hand) {
    let total = 0;
    let aceFlag = 0; // track the number of aces in the hand
    for (let i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (let j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true; // the hand is soft, i.e. it can be multiple values because of aces
        }
    }
    return false; // the hand is hard, i.e. it has only one possible value
}