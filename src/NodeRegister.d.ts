import { HashMap } from "./type-definitions";
/**
 *Wrapps Node's module instance to perform module resolution
 */
export declare class NodeModuleResolver {
    private nodejsModule;
    private nodeFileNameResolver;
    private nodeContext;
    /**
     * Current nodejs module instance
     * @param nodejsModule
     */
    constructor(nodejsModule: any);
    /**
     * Verifies if module is defined in nodejs loader
     * @param modname
     */
    hasNodeModule(modname: string): boolean | string;
    /**
     * @param modname
     */
    removeCachedNodeModule(modname: string): boolean;
    /**
     * original nodejs file name resolver
     */
    readonly fileNameResolver: Function;
    /**
     * @returns original nodejs module resolver
     */
    readonly originalFileNameResolver: Function;
    /**
     * nodejs module context
     */
    readonly context: any;
    /**
     * nodejs module instance
     */
    readonly nodeModule: any;
    /**
     * original file name resolver
     */
    invokeFilenameResolver(context: any, request: string, parent: any, isMain: any): any;
    setResolver(context: any, resolver?: Function): void;
}
/**
 * Main class to register a file name resolver for
 *  any alias collection object.
 */
export declare class FileNameResolver {
    private nodeContext;
    private aliasCollection;
    private enabled;
    private cached;
    constructor(nodeContext: NodeModuleResolver, aliasCollection: HashMap<string, string>);
    /**
     * Filename resolver, try to resolves any alias otherwise request is passed to original nodejs resolver.
     * @param request
     * @param parent
     * @param isMain
     */
    private customFileNameResolver(request, parent, isMain);
    alias: HashMap<string, string>;
    /**
     *  overrides nodejs _resolveFilename function with our own resolver.
     */
    replaceResolver(): void;
    /**
     * Resolves if an alias is defined by iterating over every alias map
     * otherwise invokes node resolution.
     *
     * @param path current path or module invoked using:
     *    require('@myalias/foo/bar/mymod');
     */
    verifyAliases(path: string): string;
    /**
     *
     * @param path
     */
    getAliasData(path: string): any;
    /**
     *
     */
    stop(): void;
    /**
     *
     */
    reset(): void;
}
/**
 * Perform node extraction operations over current module instance.
 */
export declare class NodeJSExtractor {
    /**
     * @returns current module constructor used by node
     */
    static extractModule(): any;
}
/**
 * Middleware to register/deregister alias for nodejs require system
 */
export declare class NodeRegister {
    private nodeContext;
    private registerAlias;
    /**
     * Create new instance of node register:
     *
     * @param aliases Register a collection of aliases is "aliases param" is passed otherwise no registration is done.
     */
    static useRegister(aliases?: HashMap<string, string>): NodeRegister;
    constructor(nodejsmodule?: any);
    private initialize(nodejsmodule?);
    aliasMap: HashMap<string, string>;
    /**
     * TODO: make it works
     */
    reset(): void;
    /**
     * TODO: make it works
     */
    stop(): void;
    /**
     * add alias verification system to nodejs
     */
    start(): void;
}