const menu = document.querySelector('.menu');
const play = document.querySelector('#play');
const game = document.querySelector('.game');
const wrapper = document.querySelector('.wrapper');
const player1CashDisplay = document.querySelector('#player1-cash');
const player2NameDisplay = document.querySelector('#player2-name');
const player2CashDisplay = document.querySelector('#player2-cash');
const player3NameDisplay = document.querySelector('#player3-name');
const player3CashDisplay = document.querySelector('#player3-cash');
const player4NameDisplay = document.querySelector('#player4-name');
const player4CashDisplay = document.querySelector('#player4-cash');
const playerMovementMessage = document.querySelector('.player-movement-message');
const movementMessage = document.querySelector('#movement-message');
const drawnCards = document.querySelector('.drawn-cards');
const potNumberDisplay = document.querySelector('#pot-number');
const currentBidDisplay = document.querySelector('#current-bid');
const x2 = document.querySelector('#x2');
const x3 = document.querySelector('#x3');
const x4 = document.querySelector('#x4');
const fold = document.querySelector('#fold');
const check = document.querySelector('#check');
const call = document.querySelector('#call');
const rise = document.querySelector('#rise');
const allIn = document.querySelector('#all-in');
const cardOne = document.querySelector('.card-one');
const cardTwo = document.querySelector('.card-two');

let names = ["Jan", "Piotr", "Krzysztof", "Andrzej", "Marek", "Tomasz", "Paweł", "Michał", "Adam", "Stanisław", "Anna", "Maria", "Katarzyna", "Małgorzata", "Agnieszka", "Ewa", "Elżbieta", "Zofia", "Barbara", "Jadwiga"];

let round = 1;
let pot = 0;
let bid = 0;
let currentBiggestBid = 20;
let howManyPlayed = 0;

let cardsDrawn = [];
let player1deck = [];
let player2deck = [];
let player3deck = [];
let player4deck = [];

let player1Cash = 500;
let player2Cash = 500;
let player3Cash = 500;
let player4Cash = 500;

let player1IsPlaying = true;
let player2IsPlaying = true;
let player3IsPlaying = true;
let player4IsPlaying = true;

let player1IsAllIn = false;
let player2IsAllIn = false;
let player3IsAllIn = false;
let player4IsAllIn = false;


// Menu
game.style.display = "none";

play.addEventListener('click', () => {
    playSound('../audio/click.mp3');
    menu.style.display = "none";
    game.style.display = "block";

    setTimeout(() => {
        roundSystem();
    }, 2500);
})


// Dźwięk najeźdzania na karty
let soundPlaying = false;

cardOne.addEventListener('mouseover', () => {
    if(!soundPlaying) {
        soundPlaying = true;
        playSound('../audio/card.mp3');
        setTimeout(() => {
            soundPlaying = false;
        }, 500);
    }
});

cardTwo.addEventListener('mouseover', () => {
    if(!soundPlaying) {
        soundPlaying = true;
        playSound('../audio/card.mp3');
        setTimeout(() => {
            soundPlaying = false;
        }, 500);
    }
});

// Aktualizacje wyświetlacza
function nameUpdate() {
    function getRandomName() {
        let randomIndex = Math.floor(Math.random() * names.length);
        return names.splice(randomIndex, 1)[0];
    }

    player2NameDisplay.innerHTML = getRandomName();
    player3NameDisplay.innerHTML = getRandomName();
    player4NameDisplay.innerHTML = getRandomName();
}
nameUpdate();

function valueUpdate() {
    player1CashDisplay.innerHTML = `Pieniądze: ${player1Cash} PLN`;
    player2CashDisplay.innerHTML = `: ${player2Cash} PLN`;
    player3CashDisplay.innerHTML = `: ${player3Cash} PLN`;
    player4CashDisplay.innerHTML = `: ${player4Cash} PLN`;
    currentBidDisplay.innerHTML = `Stawka: ${bid} PLN`;
    potNumberDisplay.innerHTML = `Pula: ${pot} PLN`;
}
valueUpdate();


// Aktualizacje
function restPlayersUpdate(playerName, playerCash) {
    if(player2NameDisplay.textContent == playerName) {
        player2Cash = playerCash;
    }
    if(player3NameDisplay.textContent == playerName) {
        player3Cash = playerCash;
    }
    if(player4NameDisplay.textContent == playerName) {
        player4Cash = playerCash;
    }
}

function restPlayersPlayingUpdate(playerName) {
    if(player2NameDisplay.textContent == playerName) {
        player2IsPlaying = false;
    }
    if(player3NameDisplay.textContent == playerName) {
        player3IsPlaying = false;
    }
    if(player4NameDisplay.textContent == playerName) {
        player4IsPlaying = false;
    }
}

// Wyświetlanie komentarza
function messageSystem(message, time) {
    movementMessage.innerHTML = message;
    playerMovementMessage.style.opacity = 1;

    setTimeout(function() {
        playerMovementMessage.style.opacity = 0;
        movementMessage.innerHTML = "";
    }, time);
}


// Blokowanie możliwości wyboru ruchu
function blockMove() {
    fold.classList.add('btn-disabled');
    fold.removeEventListener('click', foldMove);
    check.classList.add('btn-disabled');
    check.removeEventListener('click', checkMove);
    call.classList.add('btn-disabled');
    call.removeEventListener('click', callMove);
    rise.classList.add('btn-disabled');
    rise.removeEventListener('click', riseMove);
    allIn.classList.add('btn-disabled');
    allIn.removeEventListener('click', allInMove);
    x2.classList.add('btn-disabled');
    x2.removeEventListener('click', x2Move);
    x3.classList.add('btn-disabled');
    x3.removeEventListener('click', x3Move);
    x4.classList.add('btn-disabled');
    x4.removeEventListener('click', x4Move);
}


// Losowanie kart
function drawCard(deck) {
    const index = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
}

for (let cards = 0; cards < 5; cards++) {
    cardsDrawn.push(drawCard(deck));
}

function playerCardsDrawing(playerDeck, deck) {
    playerDeck.push(drawCard(deck));
    playerDeck.push(drawCard(deck));
}

playerCardsDrawing(player1deck, deck);
playerCardsDrawing(player2deck, deck);
playerCardsDrawing(player3deck, deck);
playerCardsDrawing(player4deck, deck);

cardOne.innerHTML = `<img src="img/deck/${player1deck[0]}.png" alt="">`;
cardTwo.innerHTML = `<img src="img/deck/${player1deck[1]}.png" alt="">`;


// System rund
function roundSystem() {
    if(player1Cash == 0) {
        player1IsPlaying = false;
    }
    if(player2Cash == 0) {
        player2IsPlaying = false;
        player2NameDisplay.style.textDecoration = "line-through";
    }
    if(player3Cash == 0) {
        player3IsPlaying = false;
        player3NameDisplay.style.textDecoration = "line-through";
    }
    if(player4Cash == 0) {
        player4IsPlaying = false;
        player4NameDisplay.style.textDecoration = "line-through";
    }
    if ((!player2IsPlaying && !player3IsPlaying && !player4IsPlaying) || (player2IsAllIn && player3IsAllIn && player4IsAllIn) || (player2IsAllIn && !player3IsPlaying && !player4IsPlaying) || (player2IsAllIn && player3IsAllIn && !player4IsPlaying) || (!player2IsPlaying && player3IsAllIn && !player4IsPlaying)) {
            round = 5;
            drawnCards.innerHTML = `<img src="img/deck/${cardsDrawn[0]}.png" alt=""><img src="img/deck/${cardsDrawn[1]}.png" alt=""><img src="img/deck/${cardsDrawn[2]}.png" alt=""><img src="img/deck/${cardsDrawn[3]}.png" alt=""><img src="img/deck/${cardsDrawn[4]}.png" alt="">`;
    }

    messageSystem(`Runda: ${round}`, 2500);

    bid = 0;
    currentBiggestBid = 20;
    howManyPlayed = 0;

    valueUpdate();

    setTimeout(() => {
        if(round == 1) {
            messageSystem(`TY Zaczynasz`, 2500);

            setTimeout(() => {
                player1Move();
            }, 3500);
        }
        if(round == 2) {
            drawnCards.innerHTML = `<img src="img/deck/${cardsDrawn[0]}.png" alt=""><img src="img/deck/${cardsDrawn[1]}.png" alt=""><img src="img/deck/${cardsDrawn[2]}.png" alt="">`;
            messageSystem(`${player2NameDisplay.textContent} Zaczyna`, 2500);

            setTimeout(() => {
                restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
            }, 3500);
        }
        if(round == 3) {
            drawnCards.innerHTML = `<img src="img/deck/${cardsDrawn[0]}.png" alt=""><img src="img/deck/${cardsDrawn[1]}.png" alt=""><img src="img/deck/${cardsDrawn[2]}.png" alt=""><img src="img/deck/${cardsDrawn[3]}.png" alt="">`;
            messageSystem(`${player3NameDisplay.textContent} Zaczyna`, 2500);

            setTimeout(() => {
                restPlayersMove(player3NameDisplay, player3NameDisplay.textContent, player3IsAllIn, player3IsPlaying, player3Cash);
            }, 3500);
        }
        if(round == 4) {
            drawnCards.innerHTML = `<img src="img/deck/${cardsDrawn[0]}.png" alt=""><img src="img/deck/${cardsDrawn[1]}.png" alt=""><img src="img/deck/${cardsDrawn[2]}.png" alt=""><img src="img/deck/${cardsDrawn[3]}.png" alt=""><img src="img/deck/${cardsDrawn[4]}.png" alt="">`;
            messageSystem(`${player4NameDisplay.textContent} Zaczyna`, 2500);

            setTimeout(() => {
                restPlayersMove(player4NameDisplay, player4NameDisplay.textContent, player4IsAllIn, player4IsPlaying, player4Cash);
            }, 3500);
        }
        if(round == 5) {
            playSound('../audio/win.mp3');
            messageSystem(`${determineWinner()} ${pot} PLN`, 10000);
            valueUpdate();

            setTimeout(() => {
                round = 1;
                pot = 0;
                bid = 0;
                currentBiggestBid = 20;

                cardsDrawn = [];
                player1deck = [];
                player2deck = [];
                player3deck = [];
                player4deck = [];

                for (let cards = 0; cards < 5; cards++) {
                    cardsDrawn.push(drawCard(deck));
                }

                playerCardsDrawing(player1deck, deck);
                playerCardsDrawing(player2deck, deck);
                playerCardsDrawing(player3deck, deck);
                playerCardsDrawing(player4deck, deck);

                cardOne.innerHTML = `<img src="img/deck/${player1deck[0]}.png" alt="">`;
                cardTwo.innerHTML = `<img src="img/deck/${player1deck[1]}.png" alt="">`;

                drawnCards.innerHTML = '';

                if(player2Cash == 0 && player3Cash == 0 && player4Cash == 0) {
                    setTimeout(() => {
                        messageSystem(`Pokonałeś wszystkich przeciwników - koniec rozgrywki`, 10000);

                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    }, 1000);

                    return;
                }
                if(player1Cash == 0) {
                    setTimeout(() => {
                        messageSystem(`Nie masz pieniędzy - koniec rozgrywki`, 10000);

                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    }, 1000);

                    return;
                }

                if(player1Cash > 0) {
                    player1IsPlaying = true;
                }
                if(player2Cash > 0) {
                    player2IsPlaying = true;
                    player2NameDisplay.style.textDecoration = "none";
                }
                if(player3Cash > 0) {
                    player3IsPlaying = true;
                    player3NameDisplay.style.textDecoration = "none";
                }
                if(player4Cash > 0) {
                    player4IsPlaying = true;
                    player4NameDisplay.style.textDecoration = "none";
                }

                valueUpdate();
                roundSystem();
            }, 11000);
        }
    }, 3500);
}


// Wybór ruchu gracza 1
function player1Move() {
    setTimeout(() => {
        if(!player1IsPlaying) {
            checkMove();
            return;
        }

        game.classList.remove('hide-shadow');
        game.style.boxShadow = "inset 0 0 10vh 0 rgba(45, 76, 53, 0.65)";
        game.classList.add('show-shadow');

        fold.addEventListener('click', foldMove);
        fold.classList.remove('btn-disabled');

        allIn.classList.remove('btn-disabled');
        allIn.addEventListener('click', allInMove);

        if (bid == 0) {
            check.classList.remove('btn-disabled');
            check.addEventListener('click', checkMove);
        }
        if (player1Cash >= bid && bid != 0) {
            call.classList.remove('btn-disabled');
            call.addEventListener('click', callMove);
        }
        if(bid == 0) {
            if (player1Cash >= 20 * 2) {
                rise.classList.remove('btn-disabled');
                rise.addEventListener('click', riseMove);
            }
        }else {
            if (player1Cash >= bid * 2) {
                rise.classList.remove('btn-disabled');
                rise.addEventListener('click', riseMove);
            }
        }
    }, 1000);
}

function foldMove() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: Pasuje`, 2500);

    howManyPlayed++;
    player1IsPlaying = false;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function checkMove() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow')
    messageSystem(`TY: Czeka`, 2500);
    valueUpdate();

    howManyPlayed++;

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function callMove() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: Wyrównuje`, 2500);

    howManyPlayed++;
    player1Cash -= currentBiggestBid;
    pot += currentBiggestBid;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function riseMove() {
    blockMove();
    playSound('../audio/click.mp3');

    if (player1Cash > bid * 2) {
        x2.classList.remove('btn-disabled');
        x2.addEventListener('click', x2Move);
    }
    if (player1Cash > bid * 3) {
        x3.classList.remove('btn-disabled');
        x3.addEventListener('click', x3Move);
    }
    if (player1Cash > bid * 4) {
        x4.classList.remove('btn-disabled');
        x4.addEventListener('click', x4Move);
    }
}

function x2Move() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: Podbija x2`, 2500);

    howManyPlayed++;
    currentBiggestBid *= 2;
    player1Cash -= currentBiggestBid;
    bid += currentBiggestBid;
    pot += currentBiggestBid;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function x3Move() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: Podbija x3`, 2500);

    howManyPlayed++;
    currentBiggestBid *= 3;
    player1Cash -= currentBiggestBid;
    bid += currentBiggestBid;
    pot += currentBiggestBid;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function x4Move() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: Podbija x4`, 2500);

    howManyPlayed++;
    currentBiggestBid *= 4;
    player1Cash -= currentBiggestBid;
    bid += currentBiggestBid;
    pot += currentBiggestBid;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}

function allInMove() {
    blockMove();
    playSound('../audio/click.mp3');
    game.classList.remove('show-shadow');
    game.style.boxShadow = "inset 0 0 0 0 rgba(45, 76, 53, 0.65)";
    game.classList.add('hide-shadow');
    messageSystem(`TY: All-in`, 2500);

    howManyPlayed++;
    player1IsPlaying = false;
    player1IsAllIn = true;
    pot += player1Cash;
    player1Cash -= player1Cash;

    valueUpdate();

    setTimeout(() => {
        if(howManyPlayed == 4) {
            howManyPlayed = 0;
            round++;
            roundSystem();
        } else {
            restPlayersMove(player2NameDisplay, player2NameDisplay.textContent, player2IsAllIn, player2IsPlaying, player2Cash);
        }
    }, 3500);
}


// Wybór pozostałych graczy
function restPlayersMove(playerNameDisplay, playerName, playerIsAllIn, playerIsPlaying, playerCash) {
    setTimeout(() => {
        howManyPlayed++;

        if(!playerIsPlaying) {
            messageSystem(`${playerName}: Czeka`, 2500);

            setTimeout(() => {
                if(howManyPlayed == 4) {
                howManyPlayed = 0;
                round++;
                roundSystem();
                } else {
                    if(player2NameDisplay.textContent == playerName) {
                        restPlayersMove(player3NameDisplay, player3NameDisplay.textContent, player3IsAllIn, player3IsPlaying, player3Cash);
                    }
                    if(player3NameDisplay.textContent == playerName) {
                        restPlayersMove(player4NameDisplay, player4NameDisplay.textContent, player4IsAllIn, player4IsPlaying, player4Cash);
                    }
                    if(player4NameDisplay.textContent == playerName) {
                        player1Move();
                    }
                }
            }, 2500);

            return;
        }

        let availableMoves = [];

        if(round == 1 && bid >= 60 && Math.random() < 0.85) {
            availableMoves.push('foldMove');
            randomMove(playerNameDisplay, playerName, playerIsAllIn, playerIsPlaying, playerCash, availableMoves);
            return;
        }
        if(bid == 0) {
            availableMoves.push('checkMove');
        }
        if(playerCash >= bid && bid != 0) {
            availableMoves.push('callMove');
        }
        if(bid == 0) {
            if (playerCash >= 20 * 2) {
                availableMoves.push('riseMove');
            }
        }
        else {
            if (playerCash >= bid * 2) {
                availableMoves.push('riseMove');
            }
        }
        if(playerCash < bid) {
            availableMoves.push('allInMove');
        }

        randomMove(playerNameDisplay, playerName, playerIsAllIn, playerIsPlaying, playerCash, availableMoves);
    }, 1000);
}

function randomMove(playerNameDisplay, playerName, playerIsAllIn, playerIsPlaying, playerCash, availableMoves) {
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    if(move == "foldMove") {
        messageSystem(`${playerName}: Pasuje`, 2500);
        restPlayersPlayingUpdate(playerName);
        playerNameDisplay.style.textDecoration = "line-through";
        availableMoves = [];
    }else if(move == "checkMove") {
        messageSystem(`${playerName}: Czeka`, 2500);
        availableMoves = [];
        valueUpdate();
    }else if(move == "callMove") {
        messageSystem(`${playerName}: Wyrównuje`, 2500);
        availableMoves = [];

        playerCash -= currentBiggestBid;
        pot += currentBiggestBid;

        valueUpdate();
    }else if(move == "riseMove") {
        howMuchRise = [];
        availableMoves = [];

        if(bid == 0) {
            if(playerCash > 20 * 2) {
                howMuchRise.push('x2Move');
            }
            if(playerCash > 20 * 3) {
                howMuchRise.push('x3Move');
            }
        }else {
            if(playerCash > bid * 2) {
                howMuchRise.push('x2Move');
            }
            if(playerCash > bid * 3) {
                howMuchRise.push('x3Move');
            }
        }

        let choice = howMuchRise[Math.floor(Math.random() * howMuchRise.length)];

        if(choice == "x2Move") {
            messageSystem(`${playerName}: Podbija x2`, 2500);

            currentBiggestBid *= 2;
            playerCash -= currentBiggestBid;
            bid += currentBiggestBid;
            pot += currentBiggestBid;
        }else if(choice == "x3Move") {
            messageSystem(`${playerName}: Podbija x3`, 2500);

            currentBiggestBid *= 3;
            playerCash -= currentBiggestBid;
            bid += currentBiggestBid;
            pot += currentBiggestBid;
        }

        howMuchRise = [];
    }else if(move == "allInMove") {
        messageSystem(`${playerName}: All-in`, 2500);
        playerNameDisplay.style.textDecoration = "line-through";
        availableMoves = [];

        pot += playerCash;
        playerCash -= playerCash;
        playerIsPlaying = false;
        playerIsAllIn = true;
    }

    valueUpdate();
    restPlayersUpdate(playerName, playerCash);

    setTimeout(() => {
        if(howManyPlayed == 4) {
        howManyPlayed = 0;
        round++;
        roundSystem();
        } else {
            if(player2NameDisplay.textContent == playerName) {
                restPlayersMove(player3NameDisplay, player3NameDisplay.textContent, player3IsAllIn, player3IsPlaying, player3Cash);
            }
            if(player3NameDisplay.textContent == playerName) {
                restPlayersMove(player4NameDisplay, player4NameDisplay.textContent, player4IsAllIn, player4IsPlaying, player4Cash);
            }
            if(player4NameDisplay.textContent == playerName) {
                player1Move();
            }
        }
    }, 2500);
}