import * as fs from 'fs';
import * as util from 'util';

export const readFile = util.promisify(fs.readFile);
export const writeFile = util.promisify(fs.writeFile);

export const isNumber = n => /^\d+$/.test(n);

export const toBoolean = v => v !== 'false' && Boolean(v);
