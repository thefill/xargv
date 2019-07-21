export interface IXargvConfig {
    binPath: string;
    containerName?: string;
    unnamedArgKeys: string[];
    foreignKeys?: string[];
    defaultArgs?: {
        [argKey: string]: string
    };
}
