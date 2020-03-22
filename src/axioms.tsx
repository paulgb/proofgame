import { Proposition, Inference } from './proofs';

export abstract class Axiom {
    abstract expression: string;

    match(proposition: Proposition) {
        return this.apply(proposition) == null;
    }

    abstract apply(proposition: Proposition): Proposition | null;
}

export class Hilbert1 extends Axiom {
    expression = '(A → (B → A))';

    apply(p: Proposition) {
        if (p instanceof Inference) {
            let rule = new Inference(p.consequent, p);
            return rule;
        }
        return null;
    }
}

export class Hilbert2 extends Axiom {
    expression = '(A → (B → C)) → ((A → B) → (B → C))';

    apply(p: Proposition) {
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
        return null;
    }
}
