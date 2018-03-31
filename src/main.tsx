import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    DragDropContextProvider, DropTarget,
    DragSource, DropTargetSpec, DragSourceSpec,
    DropTargetMonitor, DragSourceMonitor, DragSourceConnector,
    DropTargetConnector
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


import { PropSymbol, Inference, Proposition } from './proofs';

/*

Interaction:

The UI consists of two lists of prepositions: proven and unproven. The "proven" list initially consists
of the hypotheses. The "unproven" list initially consists of all the symbols.

Dragging an unproven preposition over another unproven preposition creates a new preposition using inference.

Dragging an unproven preposition over an axiom creates a proven preposition (assuming it matches the template).

Dragging proven preposition over a proven preposition applies the MP rule, creating a new proven preposition.

*/


type DragablePropositionComponentProps = {
    proposition: Proposition,
    onDropProposition: (dragProposition: Proposition, dropProposition: Proposition) => void
}

type PropositionComponentProps = {
    proposition: Proposition,
}


const propSource = {
    beginDrag(props: DragablePropositionComponentProps) {
        return {
            proposition: props.proposition,
            //onDropProposition: props.onDropProposition
        }
    },

    endDrag(props: PropositionComponentProps, monitor: DragSourceMonitor) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult();

        (dropResult as any).onDropProposition((item as any).proposition, (dropResult as any).proposition);
    },
}

const propTarget: DropTargetSpec<{}> = {
    canDrop(props: {}) {
        return true;
    },

    drop(props: DragablePropositionComponentProps) {
        return {
            proposition: props.proposition,
            onDropProposition: props.onDropProposition
        }
    }
};

function sourceCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function targetCollect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


class PropositionComponent extends React.Component<PropositionComponentProps, {}> {
    render(): JSX.Element {
        if (this.props.proposition instanceof PropSymbol) {
            return this.props.proposition.symbol as any;
        } else if (this.props.proposition instanceof Inference) {
            return <span style={{ fontFamily: 'monospace' }}>(
                        <PropositionComponent proposition={this.props.proposition.antecedent} />
                → <PropositionComponent proposition={this.props.proposition.consequent} />)
            </span>
        } else {
            return 'unknown class' as any;
        }
    }
}

@DragSource('prop', propSource as any, sourceCollect)
@DropTarget('prop', propTarget, targetCollect)
class DraggableProposition extends React.Component<any, any> {
    render() {
        const { connectDragSource, isDragging } = this.props;
        const { connectDropTarget, isOver, canDrop } = this.props;

        let style = {
            padding: '3px 3px 3px 6px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            marginTop: '3px',
            cursor: 'move',
            display: 'inline-block',
            background: isOver ? '#eee' : 'white',
        };

        return connectDragSource(
            connectDropTarget(
                <div style={style}>
                    <PropositionComponent proposition={this.props.proposition} />
                </div>));
    }
}


class Controller extends React.Component<any, any> {
    static AXIOMS: Map<string, (p: Proposition) => Proposition> = new Map([
        ['(A → (B → A))', (p: Proposition): Proposition => {
            if (p instanceof Inference) {
                let rule = new Inference(p.consequent, p);
                return rule;
            }
            console.log('no match');
            return null as any;
        }],
        ['(A → (B → C)) → ((A → B) → (B → C))', (p: Proposition): Proposition => {
            if (p instanceof Inference) {
                if (p.consequent instanceof Inference) {
                    let A = p.antecedent;
                    let B = p.consequent.antecedent;
                    let C = p.consequent.consequent;
                    return new Inference(p, new Inference(
                        new Inference(A, B),
                        new Inference(B, C)
                    ));
                }
            }
            console.log('no match');
            return null as any;
        }]
    ]);

    constructor(props: any) {
        super(props);

        let X = new PropSymbol('🙊');
        let Y = new PropSymbol('🐹');
        let Z = new PropSymbol('🐷');

        this.state = {
            propositions: [
                X,
                Y,
                Z,
            ],
            hypotheses: [
                new Inference(X, Y),
                new Inference(Y, Z),
            ],
            axioms: Array.from(Controller.AXIOMS.keys()).map((k: any) => new PropSymbol(k))
        }
    }

    onDropProposition(dragProposition: Proposition, dropProposition: Proposition) {
        let inference = new Inference(dragProposition, dropProposition);

        this.setState({
            propositions: this.state.propositions.concat([inference])
        });
    }

    onDropHypothesis(dragProposition: Proposition, dropProposition: Proposition) {
        if (dropProposition instanceof Inference) {
            if (!dropProposition.antecedent.equals(dragProposition)) {
                console.log(`${dragProposition} is not the antecedent of ${dropProposition}`);
                return;
            }

            this.setState({
                hypotheses: this.state.hypotheses.concat([dropProposition.consequent])
            })
        } else {
            console.log(`Can't apply MP to ${dropProposition} because it is not an inference.`);
        }
    }

    onDropAxiom(dragProposition: Proposition, dropProposition: Proposition) {
        if (dropProposition instanceof PropSymbol) {
            let rule = (Controller.AXIOMS.get(dropProposition.symbol) as any)(dragProposition);

            if (rule !== null) {
                this.setState({
                    hypotheses: this.state.hypotheses.concat([rule])
                })
            }
        }

    }

    render() {
        let hypComponents = this.state.hypotheses.map((x: any, i: number) =>
            <li key={i}><DraggableProposition onDropProposition={this.onDropHypothesis.bind(this)} proposition={x} /></li>)

        let propComponents = this.state.propositions.map((x: any, i: number) =>
            <li key={i}><DraggableProposition onDropProposition={this.onDropProposition.bind(this)} proposition={x} /></li>)

        let axiomComponents = this.state.axioms.map((x: any, i: number) =>
            <li key={i}><DraggableProposition onDropProposition={this.onDropAxiom.bind(this)} proposition={x} /></li>)



        return <DragDropContextProvider backend={HTML5Backend}>
            <div>
                <p>Hypotheses</p>
                <ul style={{ listStyle: 'none' }}>
                    {hypComponents}
                </ul>

                <p>Axioms</p>
                <ul style={{ listStyle: 'none' }}>
                    {axiomComponents}
                </ul>

                <p>Propositions</p>
                <ul style={{ listStyle: 'none' }}>
                    {propComponents}
                </ul>
            </div>
        </DragDropContextProvider>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<Controller />, document.getElementById('root'));
});