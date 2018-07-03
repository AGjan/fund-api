import * as pg from 'pg';
import config from './config';
import HTTP_STATUS from './http_status';
//import * as moment from 'moment';

const INVESTOR_DB = config.get('db');

export const pool = new pg.Pool({
  ...INVESTOR_DB,
  max: 1000,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000
});

const NUMERIC_OID = 1700;
pg.types.setTypeParser(NUMERIC_OID, parseFloat);

const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID,'text', (val) => { return val;});

export async function connect() {
  try {
    const client = await pool.connect();
    return new Connection(client);
  } catch (error) {
    console.log('Error trying to connect to PG Pool');
    console.error(error);
  }
}

class Connection {
  client;
  isReleased: boolean;
  shouldRelease: boolean;

  constructor(client) {
    this.client = client;
    this.isReleased = false;
    this.shouldRelease = true;
  }

  release() {
    this.client.release();
    this.isReleased = true;
  }

  async query(...args) {
    try {
      const data = await this.client.query(...args);
      return data;
    } catch (error) {
      throw parseError(error);
    }
  }

  async array(...args) {
    const data = await this.query(...args);
    return data.rows;
  }

  async object(...args) {
    const data = await this.query(...args);
    return data.rows[0];
  }
}

export function sql(strings, ...values) {
  const text = strings.reduce((total, str, i) => {
    return (total += str + `$${i + 1}`);
  }, '');

  return {
    text,
    values
  };
}

export async function query(query, parameters?) {
  try {
    const data = await pool.query(query, parameters);
    return data;
  } catch (error) {
    throw parseError(error);
  }
}

export function parseError(error) {
  console.log('db parse error');
  switch (error.code) {
    case '23503': // foreign key conflict
    case '23514': // check constraint violation
    case '23502': // not null
    case '23000': // integrity_constraint violation
    console.log('Return conflict');
      return Object.assign(error, {
        status: HTTP_STATUS.CONFLICT,
        message: error.hint
      });
    default:
    console.log('Return default');
      return error;
  }
}

export default {
  connect,
  query,
  sql,
  parseError
};
