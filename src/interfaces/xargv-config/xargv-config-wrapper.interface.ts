import {IXargvConfig} from './xargv-config.interface';

export interface IXargvConfigWrapper {
    // command name matches first ath passed to xargv
    [commandName: string]: IXargvConfig;
}
