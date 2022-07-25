export class TestRunner {
    constructor ({ tests }) {
        this.tests = tests;
    }

    run () {
        const instances = [];

        for ( const TestCls of this.tests ) {
            const test = new TestCls();
            instances.push(test);
            test.setup();
            test.run();
            console.log('errors?', test.errors);
        }

        for ( const instance of instances ) {
            instance.output(console);
        }
    }
}
