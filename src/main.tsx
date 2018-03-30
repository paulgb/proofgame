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


type PropositionComponentProps = {
    proposition: Proposition
}

const propSource = {
    beginDrag(props: any) {
        return {
            prop: props.proposition
        }
    },

    endDrag(props: PropositionComponentProps, monitor: DragSourceMonitor) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult()

        console.log('h2', item);
    },
}

const propTarget: DropTargetSpec<{}> = {
    canDrop(props: {}) {
        return true;
    },

    drop(props: {}) {
        //console.log('dropped', props);
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


class PropositionComponent extends React.Component<any, {}> {
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

@DragSource('prop', propSource, sourceCollect)
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
            display: 'inline-block'
        };

        return connectDragSource(
            connectDropTarget(
                <div style={style}>
                    <PropositionComponent proposition={this.props.proposition} />
                </div>));
    }
}


class Controller extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            propositions: [
                new PropSymbol('🙊'),
                new PropSymbol('🐹'),
                new Inference(new PropSymbol('🙊'), new PropSymbol('🐹'))
            ]
        }
    }

    render() {
        let propComponents = this.state.propositions.map((x: any, i: number) => <li key={i}><DraggableProposition proposition={x} /></li>)

        return <DragDropContextProvider backend={HTML5Backend}>
            <ul style={{ listStyle: 'none' }}>
                {propComponents}
            </ul>
        </DragDropContextProvider>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<Controller />, document.getElementById('root'));
});