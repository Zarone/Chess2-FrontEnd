export const And = (a, b) => o => a(o) && b(o);
export const Not = a => o => ! a(o);

// export const Either = (a, b) => o => a(o) || b(o);

// V8 probably doesn't optimize this but like imagine if it did
export const Either = (a, b) => Not(And(Not(a), Not(b)));
