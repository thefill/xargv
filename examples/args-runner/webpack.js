'use strict';
const chalk = require('chalk');

const argv = process.argv.splice(2, 2);
const configVar = argv[0].replace('--', '');
const configVal = argv[1];
const indexOfFunction = process.argv.indexOf('--function');


const externalArgs = {
    [configVar]: configVal
};

if (indexOfFunction >= 0) {
    const functionsArg = process.argv.splice(indexOfFunction, 2);
    externalArgs['functionName'] = functionsArg[1];
}

const localConfig = externalArgs;
process.env.EXTERNAL_CONFIGURATION = JSON.stringify(localConfig);

console.info(chalk.yellow(`Building ${localConfig.package}...`));

// Calling webpack runner
require('webpack/bin/webpack');
