import { query } from '../shared/db';
import HTTP_STATUS from '../shared/http_status';
import * as errorhandler from '../shared/errorhandler';

const sqlGetAccount = `
  select * from f_myaccount()
`;

const sqlLog = `
  insert
    into logtable (
      account_id,
      user_id,
      lvl,
      source,
      msg,
      error_object
    )
    values(
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    );
`;

export async function db_log(lvl, source, msg, caughtError?) {
  let account_id = null;
  let user_id = null;
  try {
    const d1 = await query(sqlGetAccount, []);
    account_id = d1.rows[0].o_account_id;
    user_id = d1.rows[0].o_user_id;
  } catch (error) {
    // ?????
  } finally {
    const info = [account_id, user_id, lvl, source, msg, caughtError];
    try {
      await query(sqlLog, info);
    } catch (error) {
      console.error(error);
    }
  }
}

export default class Logger {
  name: string;

  constructor(name) {
    this.name = name;
  }

  debug(msg) {
    console.log(`${this.name}:`, msg);
    /* db_log('debug', this.name, msg);*/
  }

  info(msg) {
    console.log(`logger info ${this.name} ${msg}`);
    db_log('info', this.name, msg);
  }

  app_error(msg, code, req, error) {
    console.log(`logger app_error ${this.name} ${error}`);
    db_log(
      'app_error',
      this.name,
      `${req.method}:${req.url}:${msg}`,
      JSON.stringify(error)
    );
  }

  system_error(msg, req, error) {
    db_log(
      'system_error',
      this.name,
      `${req.method}:${req.url}:${msg}`,
      JSON.stringify(error)
    );
    errorhandler.systemError(this.name + msg, error);
  }
}
