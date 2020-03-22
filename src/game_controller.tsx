import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PropSymbol, Inference, Proposition } from './proofs';
import { Axiom } from './axioms';
import { GameClickable, PropositionComponent } from './game_elements';

/*

    Click behavior:
        Nothing Selected
            Click prop from workshop
                Select that prop; fade in axioms that apply
            Click prop from inventory
                Select that prop; fade out workshop and inventory props that do not apply
            Click axiom
                axioms are disabled when nothing is selected
    
    Allowed:
        inventory, inventory: apply MP
        workshop, axiom: apply axiom
        workshop, workshop: create inferrence

*/

type GameControllerProps = {
    axioms: Axiom[],
    hypotheses: Proposition[],
    symbols: PropSymbol[],
};

type GameControllerState = {
    selected: Proposition | null,
    provenProps: Proposition[],
    unprovenProps: Proposition[],
};

export class GameController extends React.Component<GameControllerProps, GameControllerState> {
    constructor(props: GameControllerProps) {
        super(props);

        this.state = {
            provenProps: [],
            unprovenProps: [],
            selected: null,
        }
    }

    render() {
        let inventory = this.props.hypotheses.concat(this.state.provenProps);
        let workshop = (this.props.symbols as Proposition[]).concat(this.state.unprovenProps);

        return <div>
            <h1>Inventory</h1>
            {
                inventory.map((p, i) => <GameClickable value={p} key={i}>
                    <PropositionComponent proposition={p} />
                </GameClickable>)
            }
            <h1>Axioms</h1>
            {
                this.props.axioms.map((a, i) => <GameClickable value={a} key={i}>
                    {a.expression}
                </GameClickable>)
            }
            <h1>Workshop</h1>
            {
                workshop.map((p, i) => <GameClickable value={p} key={i}>
                    <PropositionComponent proposition={p} />
                </GameClickable>)
            }
        </div>;
    }
}
