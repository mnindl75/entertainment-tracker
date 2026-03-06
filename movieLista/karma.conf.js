// Karma configuration for Angular CLI
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false,
        },
        reporters: ['progress', 'kjhtml'],
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
            },
        },
        singleRun: true,
        browserDisconnectTolerance: 2,
        browserDisconnectTimeout: 10000,
        browserNoActivityTimeout: 60000,
    });
};
