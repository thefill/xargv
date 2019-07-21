import {IXargvConfig} from './xargv-config.interface';

export interface IXargvConfigWrapper {
    [commandName: string]: IXargvConfig;
}
