const symbols = ['H', 'D', 'C', 'S'];
const numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const deck = [];

for (const symbol of symbols) {
  for (const number of numbers) {
    deck.push(`${number}${symbol}`);
  }
}