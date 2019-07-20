'use strict';

const argv = process.argv.splice(2, 2);
const configVar = argv[0].replace('--', '');
const configVal = argv[1];

const externalArgs = {
    [configVar]: configVal
};

process.env.EXTERNAL_CONFIGURATION = JSON.stringify(externalArgs);

// Calling jest runner
require('jest/bin/jest');
