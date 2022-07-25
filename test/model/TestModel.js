export class TestModel {
    constructor (tester, args) {
        this.tester = tester;
        for ( const k in args ) this[k] = args[k];
    }
}
