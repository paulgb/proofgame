import * as React from 'react';

import { PropSymbol, Inference, Proposition } from './proofs';

type PropositionComponentProps = {
    proposition: Proposition,
}

export class PropositionComponent extends React.Component<PropositionComponentProps, {}> {
    render(): JSX.Element {
        if (this.props.proposition instanceof PropSymbol) {
            return this.props.proposition.symbol as any;
        } else if (this.props.proposition instanceof Inference) {
            return <div style={{ fontFamily: 'monospace', display: 'inline-block' }}>(
                        <PropositionComponent proposition={this.props.proposition.antecedent} />
                → <PropositionComponent proposition={this.props.proposition.consequent} />)
            </div>
        } else {
            return 'unknown class' as any;
        }
    }
}

type GameClickableProps<T> = {
    children: JSX.Element | string,
    value: T,
    onClick?: (value: T) => void,
}

export class GameClickable<T> extends React.Component<GameClickableProps<T>, {}> {
    constructor(props: GameClickableProps<T>) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        if (this.props.onClick) {
            this.props.onClick(this.props.value);
        }
    }

    render(): JSX.Element {
        let style = {
            cursor: 'pointer',
            border: '1px solid #eee',
            borderRadius: '3px',
            textAlign: 'center',
            marginBottom: '4px',
            padding: '9px',
        };

        return <div style={style} onClick={this.clickHandler}>
            {this.props.children}
        </div>;
    }
}

