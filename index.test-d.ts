import * as types from '.';
import {expectType} from 'tsd';

// builtins
expectType<types.TypesBuiltins>(types.builtins);

// getTypeParser - not existing parser
const noParse1 = types.getTypeParser<string>(types.builtins.NUMERIC);
expectType<string>(noParse1('noParse'));
const noParse2 = types.getTypeParser<string>(types.builtins.NUMERIC, 'text');
expectType<string>(noParse2('noParse'));
const noParse3 = types.getTypeParser<string>(types.builtins.BOOL, 'binary');
expectType<string>(noParse3(Buffer.from([])));

// getTypeParser - existing parser
const booleanParser1 = types.getTypeParser<boolean>(types.builtins.BOOL);
expectType<boolean | string>(booleanParser1('t'));
const booleanParser2 = types.getTypeParser<boolean>(types.builtins.BOOL, 'text');
expectType<boolean | string>(booleanParser2('f'));
const numericParser = types.getTypeParser<number>(types.builtins.NUMERIC, 'binary');
expectType<number | string>(numericParser(Buffer.from([200, 1, 0, 15])));

// setTypeParser
types.setTypeParser(types.builtins.INT8, Number.parseInt);
types.setTypeParser(types.builtins.FLOAT8, Number.parseFloat);
types.setTypeParser(types.builtins.FLOAT8, 'binary', (data: Buffer): number => data[0]);
types.setTypeParser(types.builtins.FLOAT8, 'text', Number.parseFloat);
