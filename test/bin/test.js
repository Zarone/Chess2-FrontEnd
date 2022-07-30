import { TestRunner } from "../framework/TestRunner";
import { MonkeyRescueTest } from "../MonkeyRescueTest";

const testRunner = new TestRunner({
    tests: [
        MonkeyRescueTest
    ]
});
testRunner.run();
