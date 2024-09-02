import { Card, CardContent } from "./ui/card";
import { Card as T_BJCard, CardSuit, CardValue } from "../lib/bj/Card";


function value_repr(value: CardValue): string {
    if (value === '10') return '10';
    return value[0];
}

function suit_repr(suit: CardSuit): string {
    switch (suit) {
        case "Clubs":
            return "♣";
        case "Diamonds":
            return "♦";
        case "Hearts":
            return "♥";
        case "Spades":
            return "♠";
        default:
            return "";
    }
}


type BJCardProps = T_BJCard & {
    "facedown"?: boolean;
    "active"?: boolean;
}

export function BJCard(props: BJCardProps) {
    const { facedown, active, suit, value } = { facedown: false, active: true, ...props };
    const text_color = suit === "Hearts" || suit === "Diamonds" ? "text-red-500" : "text-black";
    return (
        <Card className={`bg-[#333] h-28 w-20 p-4 rounded-lg ${active ? "" : "border-0"} ${text_color}`}>
            <CardContent className="p-4 flex items-center justify-center">
                {!facedown ? (
                    <>
                        <span className="text-4xl font-bold">{value_repr(value)}</span>
                        <span className="text-4xl font-bold">{suit_repr(suit)}</span>
                    </>
                ) : null}

            </CardContent>
        </Card>
    )
}