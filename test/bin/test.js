import { TestRunner } from "../framework/TestRunner.js";
import { MonkeyRescueTest } from "../MonkeyRescueTest.js";

const testRunner = new TestRunner({
    tests: [
        MonkeyRescueTest
    ]
});
testRunner.run();
