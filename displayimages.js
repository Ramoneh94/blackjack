// suits are named in an array 
const SUITS = ["hearts", "clubs", "spades", "diamonds"];
const ROYALS = ["jack", "queen", "king", "ace"];
// then the royals are given value as ints
const ROYALS_VALUES = [11, 12, 13, 14];
const BASE = 2;
const MAX = 10;

// Card Object is the Card
let CardObject = function(value, suit, royalty) {
    this.value = value;
    this.suit = suit;
    this.royalty = royalty;
}


// this is supposed to get the image from the folder
CardObject.prototype.getImage = function() {
    if (this.royalty)
        return 'img/' + this.royalty + this.suit + '.png';
    return false;
}

// this checks runs an if statement to check if the card is a royal
CardObject.prototype.isRoyal = function() {
    if (this.royalty)
        return true;
    return false;
}


// this may be redundant since I already have a deck built in game.js
function buildDeck() {
    let deck = [];
    buildNonFace(deck);
    buildRoyalty(deck);
    return deck;
}

// not sure what this does, is this for the back of the card?
// or is it to build a seperate deck of cards that are not royals
function buildNonFace(deck) {
    for (i in SUITS) {
        for (k = BASE; k <= MAX; k++) {
            const card = new CardObject(k, SUITS[i], null);
            deck.push(card);
        }
    }
}

// i assume this is a seperate deck that builds royals 
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

let deckObject = function(CardObject) {
    deckObject.CardObject
}