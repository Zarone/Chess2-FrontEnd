export class NotTestedResult {
    constructor (message, simulatedOperations, simulatedAssertions) {
        this.message = message;
        this.simulatedOperations = simulatedOperations;
        this.simulatedAssertions = simulatedAssertions;
        this.passed = true;
    }
    output (logger) {
        let asides = [];
        if ( this.simulatedOperations > 0 ) {
            asides.push(`faked ${this.simulatedOperations} operations`);
        }
        if ( this.simulatedAssertions > 0 ) {
            asides.push(`faked ${this.simulatedAssertions} results above`);
        }

        let msg = '   * not tested: ' + this.message;

        if ( asides.length > 0 ) {
            let [common, asides_] = NotTestedResult.commonSplit(asides);
            msg += ' (';
            if ( common.length > 0 ) msg += common.trim() + ' ';
            msg += NotTestedResult.andComma(asides_, { oxford: true });
            msg += ')';
        }
        logger.log(msg);
    }


    // These are just... I was having too much fun with string manipulation

    static commonSplit (strings) {
        if ( strings.length == 1 ) return ['', strings];
        let newStrs = [];
        let common = strings[0];

        for ( let str of strings ) {
            let len = Math.min(common.length, str.length);
            let i = 0;
            while ( i < len && common[i] == str[i] ) i++;
            common = common.substring(0, i);
        }

        for ( let str of strings ) {
            newStrs.push(str.substring(common.length));
        }

        return [common, newStrs];
    }

    static andComma (strings, options) {
        if ( strings.length == 1 ) return strings[0];
        if ( strings.length == 2 ) {
            return strings[0] + ' and ' + strings[1];
        }

        let strings_ = [...strings];
        let last = strings_.pop();
        let txt = '';
        txt += strings_.join(', ');
        
        let lastDelimiter = options?.oxford ?
            ', and ' : ' and ';

        return txt + lastDelimiter + last;
    }
}
