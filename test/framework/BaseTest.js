export class BaseTest {
    constructor () {
        this.results = [];
    }

    get errors () {
        return this.results.filter(r => ! r.passed);
    }

    error (data) {
        this.results.push({ ...data, passed: false });
    }

    pass (data) {
        this.results.push({ ...data, passed: true });
    }

    output (logger) {
        const failed = this.errors.length > 0;

        const name = this.constructor.name;

        let msg = '';
        if ( failed ) {
            msg += `\x1B[31;1m> FAILED ${name}\x1B[0m`
        } else {
            msg += `\x1B[32;1m> PASSED ${name}\x1B[0m`
        }

        logger.log(msg);

        for ( const result of this.results ) {
            let msg = result.passed
                ? `  \x1B[32;2m ✓\x1B[0m `
                : `  \x1B[31;1m ✕\x1B[0m `
            
            msg += result.message;

            if ( result.emessage ) {
                msg += ' (' + result.emessage(result) + ')';
            }

            logger.log(msg);
        }
    }
}
