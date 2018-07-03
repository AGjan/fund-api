import * as BodyParser from 'koa-bodyparser';
import HTTP_STATUS from './http_status';
import { connect } from './db';
import Raven from './raven';
// import { isLoggedIn } from './login';

export const bodyParser = BodyParser();

export async function handleException(ctx, next) {
  try {
    await next();
  } catch (error) {
    // Raven.captureException(error.source || error);
    console.error(error);
    (ctx.status = error.status || HTTP_STATUS.INTERNAL_ERROR),
      (ctx.message = error.message || 'Der skete en fejl.');
  }
}

export async function logRequest(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} | ${ms}ms`);
}

export async function handleCORS(ctx, next) {
  if (ctx.method == 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');

    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-Type,Origin,Accept,fundmarket-token'
    );

    ctx.status = HTTP_STATUS.NO_CONTENT;
  } else {
    ctx.set('Access-Control-Allow-Origin', '*');
    next();
  }
}

export async function setupDatabase(ctx, next) {
  if (ctx.method !== 'OPTIONS') {
    ctx.db = await connect();
    await next();
    ctx.db.release();
  } else {
    next();
  }
}

// export async function requireLogin(ctx, next) {
//   const token = ctx.get('fundmarket-token');
//   const ip = ctx.ip;
//   const loggedIn = await isLoggedIn(token, ip);
//   if (!loggedIn) {
//     ctx.status = HTTP_STATUS.UNAUTHORIZED;
//     ctx.body = {
//       message: 'Ugyldig session'
//     }
//   } else {
//     next();
//   }
// }
