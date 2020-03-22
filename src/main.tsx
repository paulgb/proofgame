import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PropSymbol, Inference, Proposition } from './proofs';
import { GameController } from './game_controller';
import { Hilbert1, Hilbert2 } from './axioms';

class Controller extends React.Component<any, any> {
    render() {
        let axioms = [new Hilbert1(), new Hilbert2()];

        let X = new PropSymbol('🙊');
        let Y = new PropSymbol('🐹');
        let Z = new PropSymbol('🐷');

        let symbols = [
            X,
            Y,
            Z,
        ];

        let hypotheses = [
            new Inference(X, Y),
            new Inference(Y, Z),
        ];

        return <GameController symbols={symbols} hypotheses={hypotheses} axioms={axioms} />;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<Controller />, document.getElementById('root'));
});