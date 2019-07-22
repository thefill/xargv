import {Nestd} from 'nestd';
import * as Path from 'path';
import {IXargvConfig, IXargvConfigWrapper} from '../../interfaces/xargv-config';

export class Xargv {

    /**
     * Execute bin
     */
    protected static executeBin(path: string): void {
        try {
            require(Path.resolve(__dirname, path));
        } catch (error) {
            // tslint:disable-next-line
            console.error(`Unable to execute cli process for ${path}`);
            throw new Error(error);
        }
    }

    /**
     * Require modules
     * @param {string[]} moduleNames
     */
    protected static requireModules(moduleNames: string[]): void {
        for (const moduleName of moduleNames) {
            try {
                require(moduleName);
            } catch (error) {
                // tslint:disable-next-line
                console.error(`Unable to require module ${moduleNames}`);
                throw new Error(error);
            }
        }
    }

    protected nestd = new Nestd();
    protected config: IXargvConfigWrapper;
    protected configPath: string;
    protected configDirPath: string;
    protected targetBinPath: string;
    protected commandName: string;

    public async init(): Promise<void> {
        const configData = await this.getConfigData();

        if (!configData) {
            throw new Error('Unable to find xargv config. Please provide one in package.json or as .xagrvrc file.');
        }

        this.config = configData.config;
        this.configPath = configData.path;
        this.configDirPath = Path.dirname(this.configPath);

        // process config & all provided args
        this.processArgs();

        // execute final cli binary
        Xargv.executeBin(Path.resolve(this.configDirPath, this.targetBinPath));
    }

    /**
     * Map passed args to the xargv config, save changes to process.argv and process.env
     */
    protected processArgs(): void {
        const inputArgv: string[] = process.argv.splice(2);

        // if any args passed
        if (!inputArgv || (inputArgv && !inputArgv.length)) {
            throw new Error('No args provided, xargv requires at least command name');
        }

        // get command name as first argv
        this.commandName = inputArgv.shift() as string;
        // get config for the command
        const commandConfig = this.config[this.commandName] as IXargvConfig;
        if (!commandConfig) {
            throw new Error(`Unable to find config for command ${this.commandName}`);
        }

        const containerName = commandConfig.containerName ? commandConfig.containerName : 'XARGV';

        this.targetBinPath = commandConfig.binPath;
        if (!this.targetBinPath) {
            throw new Error(`No bin path provided for the command`);
        }

        const allArgs: { [argKey: string]: string } = {};

        // if we should require any module
        if (commandConfig.require) {
            // map unnamed arg values to keys
            Xargv.requireModules(commandConfig.require);
        }

        // if we expect unnamed args
        if (commandConfig.unnamedArgKeys) {
            // map unnamed arg values to keys
            const unnamedArgs = inputArgv.splice(0, commandConfig.unnamedArgKeys.length);
            commandConfig.unnamedArgKeys.forEach((key, index) => {
                allArgs[key] = unnamedArgs[index];
            });
        }

        // If default args provided add them to the list
        if (commandConfig.defaultArgs) {
            Object.assign(allArgs, commandConfig.defaultArgs);
        }

        // get inline args
        let lastArgKey = '';
        const unmatchedValues: string[] = [];
        inputArgv.forEach((key, index) => {
            // if flag
            if (key.match(/^--/)) {
                lastArgKey = key.replace('--', '');
                // set key for arg as flag
                allArgs[lastArgKey] = '';
            } else {
                // if previous key was a flag and this one is not
                // then that's previous key value
                if (lastArgKey) {
                    allArgs[lastArgKey] = key;
                } else {
                    // its an unmatched value that should be passed to native cli
                    unmatchedValues.push(key);
                }
                // reset flag
                lastArgKey = '';
            }
        });

        // if any key as foreign key
        if (commandConfig.foreignKeys) {

            const foreignArgs: { [argKey: string]: string } = {};

            // separate foreign args from native args
            Object.keys(allArgs).forEach((key) => {
                if (commandConfig.foreignKeys!.includes(key)) {
                    foreignArgs[key] = allArgs[key];
                    delete allArgs[key];
                }
            });

            // set foreign args to env
            process.env[containerName] = JSON.stringify(foreignArgs);
        }

        // merge all native keys & values, also prefix keys with "--"
        const nativeArgs: Array<[string, string]> = Object.entries(allArgs)
            .map((pair) => {
                pair[0] = '--' + pair[0];

                // if no value for key then its a flag
                if (!pair[1].length) {
                    pair.pop();
                }
                return pair;
            });

        // pass output args to argv
        process.argv = process.argv.concat(...nativeArgs, ...unmatchedValues);
    }

    /**
     * Get config if exists
     * @returns {Promise<IXargvConfig | undefined>}
     */
    protected async getConfigData(): Promise<{ config: IXargvConfigWrapper, path: string } | undefined> {
        let config: IXargvConfigWrapper | undefined;
        let path: string | undefined;

        try {
            path = await this.nestd.findClosestUp(['.xargvrc']);
            let configData: Buffer;
            if (path) {
                configData = await this.nestd.read(path);
                config = JSON.parse(configData.toString());
            } else {
                path = await this.nestd.findClosestUp('package.json');
                if (path) {
                    configData = await this.nestd.read(path);
                    const packageConfig: { xargv?: IXargvConfigWrapper } = JSON.parse(configData.toString());
                    config = packageConfig.xargv;
                }
            }
        } catch (error) {
            // tslint:disable-next-line
            console.error('Unable to find xargv config. Please provide one in package.json or as .xagrvrc file.');
            throw new Error(error);
        }

        if (config && path) {
            return {config, path};
        }
    }

}
