import * as Router from 'koa-router';
import * as oracledb from 'oracledb';
import config from '../../shared/config';

import {
  getFunds,
  getFund,
  getNav,
  getValues
} from './queries';

oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;
oracledb.fetchAsString = [ oracledb.CLOB];

const router = new Router();

let conn;
const db = config.get('db');
const AGuser = db.user;
const AGpsw = db.password;
const AGhost = db.host;

router.get('/', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  ctx.body = await getFunds(conn);

  await conn.release();
});

router.get('/nav', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  ctx.body = await getNav(conn);

  await conn.release();
});

router.get('/:id', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  ctx.body = await getFund(ctx.params.id,conn);

  await conn.release();
});

router.get('/:id/values', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  ctx.body = await getValues(ctx.params.id,conn);

  await conn.release();
});



export default [router.routes(), router.allowedMethods()];
