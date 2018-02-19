export const FILE_ENCODING = "UTF-8";
export const TS_CONFIG = "tsconfig.json";
const nodePath = require("path");
const rtrim = require("rtrim");

/**
 * Helpers to resolve Path alias format and normalization
 */
export class AliasPathUtil {
  /**
   * @param path nodejs request
   * @param alias to verify
   * @returns true if an alias is inside nodejs request otherwise false
   */
  static hasAlias(path: string, alias: string) {
    alias = AliasPathUtil.stripWildcard(alias);
    if (path === null || alias === null || path === "" || alias === "") {
      return false;
    }
    const onlyAlias = path.length === alias.length;
    const hasSubdirectory = path[alias.length] === "/";
    const containsAlias = path.indexOf(alias) === 0;
    return containsAlias && (onlyAlias || hasSubdirectory);
  }

  /**
   * Alias is replaced by its value if is defined inside a request
   * @param request
   * @param alias
   * @param aliasPath
   */
  static getAliasedPath(
    request: string,
    alias: string,
    aliasPath: string
  ): string {
    if (!AliasPathUtil.hasAlias(request, alias)) {
      return request;
    }
    return AliasPathUtil.buildPath(request, alias, aliasPath);
  }

  /**
   * Alias is replaced by its value if is defined inside a request
   *
   * @param request
   * @param alias
   * @param aliasPath
   */
  static buildPath(request: string, alias: string, aliasPath: string): string {
    const rightSide = AliasPathUtil.normalizeRightSide(request, alias);
    const normalizedAlias = AliasPathUtil.normalizeAlias(aliasPath);
    const withDot = aliasPath.startsWith("./") ? "./" : "";
    const result = nodePath.join(normalizedAlias, rightSide);
    return withDot + nodePath.normalize(result);
  }

  /**
   * Removes alias inside nodejs require request
   * @param path
   * @param alias
   *
   * @example
   * require('@foobar/any/mod') => require('/any/mod')
   */
  static normalizeRightSide(path: string, alias: string): string {
    alias = AliasPathUtil.stripWildcard(alias);
    return path.substr(alias.length);
  }

	/**
	 * Removes the trailing "*" from a string (if any)
	 * @param path
	 * @returns {string}
	 */
  static stripWildcard(path: string): string {
    if (path.endsWith("/*")) {
      path = path.substr(0, path.length - 2);
    }

    return path;
  }
  /**
   * Removes trailing slash
   * @param aliasPath value of alias:
   *
   * @example
   *  aliasPath =  {
   *      alias : aliasPath
   *    }
   */
  static normalizeAlias(aliasPath: string): string {
    aliasPath =  AliasPathUtil.stripWildcard(aliasPath);
    return rtrim(aliasPath, "/");
  }
}

/**
 * Data structure to wrap json data
 */
export class HashMap<K, V> implements IterableIterator<V> {
  /**
   * current item index when hashmap is iterated
   */
  private pointer: number = 0;

  /**
   * key set of hashmap
   */
  private keys: string[] = [];

  /**
   * json data to be traversed
   * @param myCollection if not passed any param then an empty json is set.
   */
  constructor(private myCollection: any = {}) {
    this.keys = Object.keys(myCollection);
  }

  /**
   * @param key identifier of value
   * @param value
   */
  add(key: K | string, value: V): HashMap<K, V> {
    this.myCollection[key] = value;
    this.keys.push("" + key);
    this.keys.sort();
    return this;
  }

  /**
   * @param key identifier of value
   */
  has(key: K): boolean {
    return this.keys.indexOf(key + "") > -1;
  }

  /**
   * @param key identifier of value
   */
  remove(key: K): void {
    const currentIndex: number = this.keys.indexOf(key + "");
    delete this.keys[currentIndex];
    delete this.myCollection[key];
  }

  /**
   *
   */
  isEmpty(): boolean {
    return this.myCollection.length === 0;
  }

  /**
   *
   */
  size(): number {
    return this.myCollection.length;
  }

  /**
   *
   * @param json collection of key:value to be merged
   */
  addAll(json: any): HashMap<K, V> {
    for (let alias in json) {
      this.add(alias, json[alias]);
    }
    return this;
  }

  /**
   * @param key
   */
  get(key: K): V {
    return this.myCollection[key];
  }

  /**
   * initialize current map
   */
  removeAll(): void {
    delete this.keys;
    delete this.myCollection;
    this.myCollection = {};
    this.keys = [];
  }

  /**
   * foreach helper
   * @param callback (value, key, array ) => {}
   */
  each(
    callback: (value: V, key: K | string, array: V[]) => any,
    thisArg?: any
  ): void {
    for (let aliasIndex in this.myCollection) {
      const result = callback(
        this.myCollection[aliasIndex],
        aliasIndex,
        this.myCollection
      );
      if (typeof result !== "undefined" && result !== null) {
        return result;
      }
    }
  }

  /**
   * @returns key collection inside json object
   */
  keyset(): string[] {
    return this.keys;
  }

  /**
   * @param map
   */
  merge(map: HashMap<K, V>): HashMap<K, V> {
    this.addAll(map.getAll());
    return this;
  }

  /**
   * @returns json raw object
   */
  getAll() {
    return this.myCollection;
  }

  [Symbol.iterator](): IterableIterator<V> {
    return this;
  }

  public next(): IteratorResult<V> {
    if (this.pointer < this.keys.length) {
      const newKey = this.keys[this.pointer++];
      return {
        done: false,
        value: this.myCollection[newKey]
      };
    }
    return {
      done: true,
      value: null
    };
  }
}

/**
 * provides operatons to find any file in a given root
 */
export interface IFileFinder {
  find(file: string, startPath: string): string;
}
