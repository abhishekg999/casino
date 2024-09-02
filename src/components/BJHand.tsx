import { get_value, Hand } from "@/lib/bj/Hand";
import { BJCard } from "./BJCard";
import React from "react";


type BJCardProps = {
    hand: Hand;
    active?: boolean; 
    key?: any;
}

export function BJHand(props: BJCardProps) {
    const { hand, active, key } = { active: true, ...props };
    return (
        <React.Fragment key={key}>
            <div className="gap-4 grid grid-cols-auto-fill">
                {hand.cards.map((card, index) => (
                    <BJCard key={index} suit={card.suit} value={card.value} active={active}/>
                ))}
            </div>
            <div className="text-2xl font-bold">Total: {get_value(hand)}</div>
        </React.Fragment>
    )
}