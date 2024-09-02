"use client";

import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import { BJCard } from "../components/BJCard"
import { useEffect, useState } from "react"
import { get_value, Hand, init_hand } from "../lib/bj/Hand"
import { deal } from "../lib/bj/Shoe"
import { generate_possible_actions, handle_action_double, handle_action_hit, handle_action_split, handle_action_stand, init_game } from "../lib/bj/Blackjack"
import { BJHand } from "../components/BJHand"

enum GameState {
    BEFORE_START,
    BEFORE_ROUND,
    PLAYER_ACTION,
    PLAYER_AFTER_ACTION,
    DEALER_TURN,
    ROUND_END
}

function gameStateToString(state: GameState): string {
    switch (state) {
        case GameState.BEFORE_START:
            return "Press Play to Begin!";
        case GameState.BEFORE_ROUND:
            return "Place your bet!";
        case GameState.PLAYER_ACTION:
        case GameState.PLAYER_AFTER_ACTION:
            return "";
        case GameState.DEALER_TURN:
            return "Dealer's Turn!";
        case GameState.ROUND_END:
            return "";
    }

}

export default function App() {
    const [game, setGame] = useState(init_game(6, "player", 10000));
    const [playerBet, setPlayerBet] = useState(500);
    const [gameState, setGameState] = useState(GameState.BEFORE_START);

    const [hitEnabled, setHitEnabled] = useState(false);
    const [standEnabled, setStandEnabled] = useState(false);
    const [doubleEnabled, setDoubleEnabled] = useState(false);
    const [splitEnabled, setSplitEnabled] = useState(false);

    const [dealerHand, setDealerHand] = useState<Hand>(init_hand(0));

    const play = () => {
        const initHand = init_hand(playerBet);
        initHand.cards.push(deal(game.shoe));
        initHand.cards.push(deal(game.shoe));
        setGame((game) => {
            game.player.balance -= playerBet;
            return { ...game, player_hands: [initHand], current_hand: 0 };
        });
        setDealerHand(hand => {
            return { ...hand, cards: [deal(game.shoe), deal(game.shoe)] }
        });
        setGameState(GameState.PLAYER_ACTION);
    };

    useEffect(() => {
        console.log("Game state changed to", GameState[gameState]);
        console.log(game);
    }, [game, gameState]);

    useEffect(() => {
        if (gameState === GameState.PLAYER_ACTION) {
            const options = generate_possible_actions(game.player, game.player_hands[game.current_hand]);
            if (options.hit) setHitEnabled(true);
            if (options.stand) setStandEnabled(true);
            if (options.double) setDoubleEnabled(true);
            if (options.split) setSplitEnabled(true);
        } else {
            setHitEnabled(false);
            setStandEnabled(false);
            setDoubleEnabled(false);
            setSplitEnabled(false);
        }
    }, [game, gameState]);

    useEffect(() => {
        if (gameState === GameState.PLAYER_AFTER_ACTION) {
            if (game.current_hand >= game.player_hands.length) {
                setGameState(GameState.DEALER_TURN);
            } else {
                setGameState(GameState.PLAYER_ACTION);
            }
        }
    }, [game, gameState]);

    useEffect(() => {
        if (gameState === GameState.DEALER_TURN) {
            const interval = setInterval(() => {
                if (get_value(dealerHand) < 17) {
                    setDealerHand((prevHand) => ({
                        ...prevHand,
                        cards: [...prevHand.cards, deal(game.shoe)],
                    }));
                } else {
                    setGameState(GameState.ROUND_END);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameState, dealerHand]);

    useEffect(() => {
        if (gameState === GameState.ROUND_END) {
            if (get_value(dealerHand) > 21) {
                console.log("Dealer busts!");
            } else {
                console.log("Dealer wins!");
            }
        }
        
    }, [game, gameState]);


    return (
        <div className="flex flex-col h-screen bg-[#0e0e0e] text-white">
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Blackjack</h1>
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">{gameStateToString(gameState)}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">${game.player.balance}</span>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <SettingsIcon className="w-6 h-6" />
                    </Button>
                </div>
            </header>
            <main className="flex-1 grid grid-cols-[2fr_2fr_1fr] gap-8 p-8">
                <section className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Your Cards</h2>

                    {gameState !== GameState.BEFORE_START ? (
                        <>
                            {game.player_hands.map((hand, index) => (
                                <BJHand key={index} hand={hand} active={game.current_hand < game.player_hands.length && game.current_hand === index} />
                            ))}
                        </>
                    ) :
                        null
                    }
                </section>
                <section className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Dealer's Cards</h2>
                    {gameState !== GameState.BEFORE_START ? (
                        <>
                            <div className="gap-4 grid grid-cols-auto-fill">
                                {dealerHand.cards.map((card, index) => (
                                    <BJCard key={index} suit={card.suit} value={card.value} facedown={gameState < GameState.DEALER_TURN && index === 1} active={gameState === GameState.DEALER_TURN} />
                                ))}
                            </div>
                            {
                                gameState >= GameState.DEALER_TURN ? (
                                    <div className="text-2xl font-bold">Total: {get_value(dealerHand)}</div>
                                ) : null
                            }
                        </>
                    ) :
                        null
                    }
                </section>
                <section className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Game Controls</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Button size="lg" className="hover:border" disabled={!hitEnabled} onClick={() => {
                            setGame(handle_action_hit(game));
                            setGameState(GameState.PLAYER_AFTER_ACTION);
                        }}>Hit</Button>
                        <Button size="lg" className="hover:border" disabled={!standEnabled} onClick={() => {
                            setGame(handle_action_stand(game));
                            setGameState(GameState.PLAYER_AFTER_ACTION);
                        }}>Stand</Button>
                        <Button size="lg" className="hover:border" disabled={!doubleEnabled} onClick={() => {
                            setGame(handle_action_double(game));
                            setGameState(GameState.PLAYER_AFTER_ACTION);
                        }}>Double</Button>
                        <Button size="lg" className="hover:border" disabled={!splitEnabled} onClick={() => {
                            setGame(handle_action_split(game));
                            setGameState(GameState.PLAYER_AFTER_ACTION);
                        }}>Split</Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-bold pr-1">Chips</div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground"
                                onClick={
                                    () => setPlayerBet((bet) => bet - 50)
                                }
                                disabled={playerBet <= 50}
                            >
                                <MinusIcon className="w-6 h-6" />
                            </Button>
                            <span className="text-2xl font-bold">{playerBet}</span>
                            <Button variant="ghost" size="icon" className="text-muted-foreground"
                                onClick={
                                    () => setPlayerBet((bet) => bet + 50)
                                }
                                disabled={playerBet >= 1000}
                            >
                                <PlusIcon className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-4" />

                    <Button size="lg" className="hover:border" onClick={play} disabled={
                        gameState !== GameState.BEFORE_START && gameState !== GameState.ROUND_END
                    }>Play</Button>
                </section>
            </main>
        </div>
    )
}


function MinusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
        </svg>
    )
}


function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function SettingsIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

