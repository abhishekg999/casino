type Player = {
    id: string;
    balance: number;
};

function init_player(id: string, money: number): Player {
    return { id, balance: money };
}

function can_bet(player: Player, amount: number): boolean {
    return player.balance >= amount;
}

function bet(player: Player, amount: number): void {
    player.balance -= amount;
}

function receive_payout(player: Player, amount: number): void {
    player.balance += amount;
}

export { init_player, can_bet, bet, receive_payout };
export type { Player }