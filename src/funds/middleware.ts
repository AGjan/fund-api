import * as BodyParser from 'koa-bodyparser';
import HTTP_STATUS from '../shared/http_status';

export const bodyParser = BodyParser();

export async function handleException(ctx, next) {
  try {
    return  await next();
  } catch (error) {
    // Raven.captureException(error.source || error);
    console.log('Middelware ERROR',error.status);

    ctx.status = error.status || HTTP_STATUS.INTERNAL_ERROR;
    ctx.body = {
      message: error.message || 'Der skete en fejl.'
    };
  }
}

export async function logRequest(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} | ${ms}ms`);
}

export async function handleCORS(ctx, next) {
  if (ctx.method === 'OPTIONS') {
    ctx.set(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,POST,DELETE,PATCH'
    );

    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-Type,Origin,Accept,fundmarket-token'
    );

    ctx.set('Access-Control-Allow-Origin', '*');

    ctx.status = HTTP_STATUS.NO_CONTENT;

  } else {
    ctx.set('Access-Control-Allow-Origin', '*');

    return next();
  }
}
