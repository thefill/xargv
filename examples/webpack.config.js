const path = require('path');

if (!process.env.EXTERNAL_CONFIGURATION) {
    throw new Error('No package path provided via argv-runner!');
}
const localConfig = JSON.parse(process.env.EXTERNAL_CONFIGURATION);

module.exports = {
    entry: localConfig.functionName ? path.resolve(__dirname, `../../${localConfig.package}/src/${localConfig.functionName}/index.ts`) : path.resolve(__dirname, `../../${localConfig.package}/index.ts`),
    devtool: 'source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, '../../tsconfig.json')
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: localConfig.functionName ? 'index.js' : 'bundle.js',
        path: localConfig.functionName ? path.resolve(__dirname, `../../${localConfig.package}/dist/${localConfig.functionName}`) : path.resolve(__dirname, `../../${localConfig.package}/dist`),
        libraryTarget: 'commonjs'
    },
    target: "node",
    stats: "errors-only"
};
