type CardValue = "Ace" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "Jack" | "Queen" | "King";
type CardSuit = "Hearts" | "Diamonds" | "Clubs" | "Spades";

type Card = {
    value: CardValue;
    suit: CardSuit;
};

function init_card(value: CardValue, suit: CardSuit): Card {
    return { value, suit };
}

function create_deck(): Card[] {
    const values: CardValue[] = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
    const suits: CardSuit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const deck: Card[] = [];
    for (let value of values) {
        for (let suit of suits) {
            deck.push(init_card(value, suit));
        }
    }
    return deck;
}


export { init_card, create_deck };
export type { Card, CardValue, CardSuit };