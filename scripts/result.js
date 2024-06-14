function hasPair(cards) {
    const values = cards.map(card => card.slice(0, -1));
    const uniqueValues = new Set(values);

    return uniqueValues.size !== values.length;
}

function hasTwoPair(cards) {
    const values = cards.map(card => card.slice(0, -1));
    const valueCounts = {};

    for (const value of values) {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    const pairs = Object.values(valueCounts).filter(count => count === 2);

    return pairs.length >= 2;
}

function hasThreeOfAKind(cards) {
    const values = cards.map(card => card.slice(0, -1));
    const valueCounts = {};

    for (const value of values) {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    return Object.values(valueCounts).includes(3);
}

function hasStraight(cards) {
    const values = cards.map(card => {
        const value = card.slice(0, -1);
        return isNaN(value) ? (value === 'A' ? 14 : 11 + 'JQK'.indexOf(value)) : parseInt(value);
    });

    values.sort((a, b) => a - b);

    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] - values[i] !== 1) {
            return false;
        }
    }

    return true;
}

function hasFlush(cards) {
    const suits = cards.map(card => card.slice(-1));
    return new Set(suits).size === 1;
}

function hasFullHouse(cards) {
    return hasThreeOfAKind(cards) && hasPair(cards);
}

function hasFourOfAKind(cards) {
    const values = cards.map(card => card.slice(0, -1));
    const valueCounts = {};

    for (const value of values) {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    return Object.values(valueCounts).includes(4);
}

function hasStraightFlush(cards) {
    return hasFlush(cards) && hasStraight(cards);
}

function hasRoyalFlush(cards) {
    return hasStraightFlush(cards) && cards.some(card => card.startsWith('10'));
}

function evaluateHand(playerDeck, communityCards) {
    const allCards = playerDeck.concat(communityCards);
    const handTypes = [
        { type: "pokera królewskiego", check: hasRoyalFlush },
        { type: "pokera", check: hasStraightFlush },
        { type: "kareta", check: hasFourOfAKind },
        { type: "full-house", check: hasFullHouse },
        { type: "kolor", check: hasFlush },
        { type: "strit", check: hasStraight },
        { type: "trójkę", check: hasThreeOfAKind },
        { type: "dwie pary", check: hasTwoPair },
        { type: "parę", check: hasPair }
    ];

    for (const handType of handTypes) {
        if (handType.check(allCards)) {
            return handType.type;
        }
    }

    return "wysoką kartę";
}

function determineWinner() {
    const activePlayers = [];
    if (player1IsPlaying || player1IsAllIn) activePlayers.push({ cash: player1Cash, name: "TY", hand: evaluateHand(player1deck, cardsDrawn) });
    if (player2IsPlaying || player2IsAllIn) activePlayers.push({ cash: player2Cash, name: player2NameDisplay.textContent, hand: evaluateHand(player2deck, cardsDrawn) });
    if (player3IsPlaying || player3IsAllIn) activePlayers.push({ cash: player3Cash, name: player3NameDisplay.textContent, hand: evaluateHand(player3deck, cardsDrawn) });
    if (player4IsPlaying || player4IsAllIn) activePlayers.push({ cash: player4Cash, name: player4NameDisplay.textContent, hand: evaluateHand(player4deck, cardsDrawn) });

    if (activePlayers.length === 0) {
        return "Brak aktywnych graczy.";
    }

    activePlayers.sort((a, b) => {
        const handValues = ["pokera królewskiego", "pokera", "kareta", "full-house", "kolor", "strit", "trójkę", "dwie pary", "parę", "wysoką kartę"];
        return handValues.indexOf(b.hand) - handValues.indexOf(a.hand);
    });

    const winner = activePlayers[0];

    if (winner.name === "TY") {
        player1Cash += pot;
        return `Mając ${winner.hand} wygrywasz`;
    } else {
        if (winner.name === player2NameDisplay.textContent) {
            player2Cash += pot;
        } else if (winner.name === player3NameDisplay.textContent) {
            player3Cash += pot;
        } else if (winner.name === player4NameDisplay.textContent) {
            player4Cash += pot;
        }
        return `${winner.name} mając ${winner.hand} wygrywa`;
    }
}