import { Card } from "./Card";

type Hand = {
    cards: Card[];
    bet: number;
};

function init_hand(bet: number): Hand {
    return { cards: [], bet};
}

function add_card(hand: Hand, card: Card): void {
    hand.cards.push(card);
};

function get_value(hand: Hand): number {
    let value = 0;
    let aces = 0;
    for (let card of hand.cards) {
        if (card.value === "Ace") {
            aces += 1;
            value += 11;
        } else if (card.value === "Jack" || card.value === "Queen" || card.value === "King") {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }
    return value;
};

export { init_hand, add_card, get_value };
export type { Hand };