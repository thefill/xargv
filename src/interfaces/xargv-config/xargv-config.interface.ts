export interface IXargvConfig {
    // path to bin that should be executed
    binPath: string;
    // this is the env variable name all your extra args will be placed in
    containerName?: string;
    // List of mudules that should be required before cli execution e.g. dotenv/config
    require?: string[];
    // list of keys that should be matched to first values passed without '--'
    unnamedArgKeys: string[];
    // list of all args passed that should be passed as foreign var
    foreignKeys?: string[];
    // default args - args you dont want to define all over the package.json
    defaultArgs?: {
        [argKey: string]: string
    };
}
