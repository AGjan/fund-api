import * as Router from 'koa-router';
import { reportGenerate } from '../report/generate';
import * as oracledb from 'oracledb';

import {
  getMMFunds,
  getPosition,
  insertSubscription,
  insertRedemption
} from './queries';

oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;

const router = new Router();

let conn;
const AGuser = 'AG';
const AGpsw = 'Foraar16';
const AGhost = 'ag-db01.c2.sdc-hosting.com/AG01P';

router.get('/', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  ctx.body = await getMMFunds(ctx.query,conn);

  await conn.release();
});

router.get('/position', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  const data = await getPosition(ctx.query, conn);

  const options = {
    breakcol: 'TYPE_CODE',
    breaktitle: 'TYPE',
    sumcols: ['MARKETVALUE_PC']
  };
  ctx.body = {
    data: reportGenerate(
      'Beholdningsoversigt',
      '',
      ctx.query.asofdate,
      data,
      options
    )
  };

  await conn.release();
});


/**
 * Create new subscription order 
 * request.body
 * {
 * "email":<email>,
 * "text":<text>
 * }
 */
router.post('/subscription', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  const data = await insertSubscription(ctx.request.body, conn);
  ctx.body = data;

  await conn.release();
});

/**
 * Create new redemption order 
 * request.body
 * {
 * "email":<email>,
 * "text":<text>
 * }
 */
router.post('/redemption', async ctx => {
  conn = await oracledb.getConnection({
    user: AGuser,
    password: AGpsw,
    connectString: AGhost
  });

  const data = await insertRedemption(ctx.request.body, conn);
  ctx.body = data;

  await conn.release();
});


export default [router.routes(), router.allowedMethods()];
