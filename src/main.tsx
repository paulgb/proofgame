import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragDropContextProvider, DropTarget, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

/*

Interaction:

The UI consists of two lists of prepositions: proven and unproven. The "proven" list initially consists
of the hypotheses. The "unproven" list initially consists of all the symbols.

Dragging an unproven preposition over another unproven preposition creates a new preposition using inference.

Dragging an unproven preposition over an axiom creates a proven preposition (assuming it matches the template).

Dragging proven preposition over a proven preposition applies the MP rule, creating a new proven preposition.

*/

export const ItemTypes = {
    PREPOSITION: 'preposition',
};

const boxSource = {
    beginDrag(props: any) {
        return {
            symbol: props.symbol,
        }
    },

    endDrag(props: any, monitor: any) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult()

        console.log('h2', item);
    },
}

const squareTarget = {
    canDrop(props: any) {
        return true;
    },

    drop(props: any) {
        console.log('dropped');
    }
};

function collect(connect: any, monitor: any) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@DragSource(ItemTypes.PREPOSITION, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.PREPOSITION, squareTarget, collect)
class DraggablePreposition extends React.Component<any, any> {
    render() {
        const { connectDragSource, isDragging } = this.props;
        const { connectDropTarget, isOver, canDrop } = this.props;

        console.log(this.props.children);
        return connectDragSource(
            connectDropTarget(
                <div>{this.props.children}</div>));
    }
}

class Symbol extends React.Component<any, any> {
    render() {
        let style = {
            padding: '3px 3px 3px 10px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            marginLeft: '3px',
            cursor: 'move',
            width: '12px',
        };
        return <div style={style}>{this.props.symbol}</div>;
    }
}

class Controller extends React.Component {
    render() {
        return <DragDropContextProvider backend={HTML5Backend}>
            <div>
                <DraggablePreposition><Symbol symbol='🙊' /></DraggablePreposition>
                <DraggablePreposition><Symbol symbol='🐹' /></DraggablePreposition>
            </div>
        </DragDropContextProvider>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<Controller />, document.getElementById('root'));
});