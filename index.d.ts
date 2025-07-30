import * as _builtins from './lib/builtins';

export const builtins: typeof _builtins.builtins;
export type TypeId = _builtins.builtins;
export type TypesBuiltins = typeof _builtins.builtins;

export type TypeParser<I extends (string | Buffer), T> = (value: I) => T;

export function setTypeParser<T>(oid: number | TypeId, parseFn: TypeParser<string, T>): void;
export function setTypeParser<T>(oid: number | TypeId, format: 'text', parseFn: TypeParser<string, T>): void;
export function setTypeParser<T>(oid: number | TypeId, format: 'binary', parseFn: TypeParser<Buffer, T>): void;

export function getTypeParser<T>(oid: number | TypeId): TypeParser<string, T | string>;
export function getTypeParser<T>(oid: number | TypeId, format: 'text'): TypeParser<string, T | string>;
export function getTypeParser<T>(oid: number | TypeId, format: 'binary'): TypeParser<Buffer, T | string>;
