/**
 * Maintain a BJState object that represents the current state of the game.
 * 
 * Let buttons "Hit", "Stand", "Double", and "Split" actions act on the appropriate BJState object.
 * 
 * Before the game is initialized, you must specify how many decks are in the shoe, the player's ID, and the player's starting money.
 * Use the init_game function to initialize the game and get a BJState object.
 * 
 * Before a round starts: 
 * - Check the size of the shoe. If the shoe is too small*, create a new shoe with the same number of decks.
 * - Check the player's money. If the player has less than the minimum bet, end the game.
 * 
 * Each round of the game is as follows:
 *  - The player must input how much they want to bet.
 *  - Use the deal_hand function to deal the player and dealer their initial hands, which gives the new hand a value of their bet.
 *  - Check if the player has blackjack (using get_value). If so, return the hand.value to the player and pay them 1.5 times their bet, then set the hand.value to 0.
 *  - If the player does not have blackjack, generate the possible actions for the player's current hand.
 *  - Depending on the possible actions, give the player the option to hit, stand, double, or split.
 *  - Depending on the action taken, using the appropriate handle_action function and rerender appropriate components.
 *  - After any action is taken, check if current_hand has busted or reached 21. If so, move to the next hand.
 *  - If the hand has busted, set hand.value to 0.
 *  - After this check, check if all hands have been played (current_hand >= player_hands.length). If so, move to the dealer's turn.
 *  - Otherwise, repeat the process of generating possible actions and allowing the player to take an action.
 *  - Once the player has finished their turn, the dealer must play their hand.
 *  - The dealer must hit until their hand value is 17 or greater.
 * 
 *  - After the dealer has played their hand, compare the dealer's hand to the player's hand.
 *  - For each hand, if the player has a higher value than the dealer, return the hand.value to the player and pay them their bet.
 *  - If the player has a lower value than the dealer, set hand.value to 0.
 * 
 *  - If the player has the same value as the dealer, return the hand.value to the player. (No push)
 * 
 * After a round ends:
 *  - Nothing to do.
 */

import { Hand, init_hand, add_card, get_value, } from "./Hand";
import { Shoe, init_shoe, deal, shuffle } from "./Shoe";
import { Player, init_player, can_bet, bet } from "./Player";

type BJOptions = "hit" | "stand" | "double" | "split";

type BJState = {
    shoe: Shoe;
    player: Player;
    dealer: Hand;
    player_hands: Hand[];
    current_hand: number;
};


type BJPossibleOptions = {
    [key in BJOptions]: boolean;
};
function generate_possible_actions(player: Player, hand: Hand): BJPossibleOptions {
    const actions = {
        'hit': true,
        'stand': true,
    } as BJPossibleOptions;
    if (hand.cards.length === 2 && can_bet(player, hand.bet)) {
        actions.double = true;
        if (hand.cards[0].value === hand.cards[1].value) {
            actions.split = true;
        }
    }
    return actions;
}

function deal_hand(shoe: Shoe, _: Player, bet: number): Hand {
    const hand = init_hand(bet);
    add_card(hand, deal(shoe));
    add_card(hand, deal(shoe));
    return hand;
}

function init_game(num_decks: number, player_id: string, money: number): BJState {
    const shoe = init_shoe(num_decks);
    const player = init_player(player_id, money);
    const dealer = init_hand(0);
    const player_hands = [deal_hand(shoe, player, money)];

    shuffle(shoe);  
    return { shoe, player, dealer, player_hands, current_hand: 0 };
}


function handle_action_hit(state: BJState): BJState {
    const new_state = { ...state };
    add_card(new_state.player_hands[new_state.current_hand], deal(new_state.shoe));
    if (get_value(new_state.player_hands[new_state.current_hand]) >= 21) {
        new_state.current_hand += 1;
    }
    return new_state;
}

function handle_action_stand(state: BJState): BJState {
    const new_state = { ...state };
    new_state.current_hand += 1;
    return new_state;
}

function handle_action_double(state: BJState): BJState {
    const new_state = { ...state };
    bet(new_state.player, new_state.player_hands[new_state.current_hand].bet);
    new_state.player_hands[new_state.current_hand].bet *= 2;
    add_card(new_state.player_hands[new_state.current_hand], deal(new_state.shoe));
    new_state.current_hand += 1;
    return new_state;
}

function handle_action_split(state: BJState): BJState {
    const new_state = { ...state };
    const hand = new_state.player_hands[new_state.current_hand];
    const new_hand = init_hand(hand.bet);
    add_card(new_hand, hand.cards.pop()!);
    add_card(hand, deal(new_state.shoe));
    add_card(new_hand, deal(new_state.shoe));
    new_state.player_hands.push(new_hand);
    return new_state;
}

export type { BJState, BJOptions };
export { generate_possible_actions, init_game, handle_action_hit, handle_action_stand, handle_action_double, handle_action_split };
 