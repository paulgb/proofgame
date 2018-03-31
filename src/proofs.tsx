import * as React from 'react';

export abstract class Proposition {
    abstract toString(): string

    abstract equals(other: Proposition): boolean
}

export class PropSymbol extends Proposition {
    constructor(public symbol: string) { super() }

    toString() {
        return this.symbol;
    }

    equals(other: Proposition): boolean {
        if (other instanceof PropSymbol) {
            return this.symbol == other.symbol;
        }
        return false;
    }
}

export class Inference extends Proposition {
    constructor(public antecedent: Proposition, public consequent: Proposition) {
        super()
    }

    toString() {
        return `(${this.antecedent.toString()} → ${this.consequent.toString()})`;
    }

    equals(other: Proposition): boolean {
        if (other instanceof Inference) {
            return this.antecedent.equals(other.antecedent) && this.consequent.equals(other.consequent);
        }
        return false;
    }
}
