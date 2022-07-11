foam.POM({
    name: 'chess2--build',
    version: 1,
    projects: [
        { name: '../node_modules/foam3/src/pom' },
        { name: '../node_modules/foam3/src/foam/foobar/pom' },
        // { name: 'src/pom' }
    ],
    foobar: {
        protected: ['foam3', 'src'],
        generate: ['js'],
        build: {
            objectDir: 'build',
            javaOutDir: 'build/src/java'
        },
        target: {
            runDir: 'runtime'
        }
    }
});