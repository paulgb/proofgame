import * as React from 'react';

export abstract class Proposition {
    abstract toString(): string
}

export class PropSymbol extends Proposition {
    constructor(public symbol: string) { super() }

    toString() {
        return this.symbol;
    }
}

export class Inference extends Proposition {
    constructor(public antecedent: Proposition, public consequent: Proposition) {
        super()
    }

    toString() {
        return `(${this.antecedent.toString()} → ${this.consequent.toString()})`;
    }
}