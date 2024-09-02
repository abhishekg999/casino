import { Card, create_deck } from "./Card";
import { shuffle as random_shuffle } from "./utils";
type Shoe = {
    cards: Card[];
    total_decks: number;
    total_cards: number;
};

function init_shoe(num_decks: number): Shoe {
    const cards: Card[] = [];
    for (let i = 0; i < num_decks; i++) {
        cards.push(...create_deck());
    }
    return { cards, total_decks: num_decks, total_cards: num_decks * 52 };
}

function shuffle(shoe: Shoe): void {
    random_shuffle(shoe.cards);
}

function deal(shoe: Shoe): Card {
    return shoe.cards.pop()!;
}

export { init_shoe, shuffle, deal };
export type { Shoe };