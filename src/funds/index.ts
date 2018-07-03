import * as Koa from 'koa';
import * as Router from 'koa-router';

import infoModule from './info/index';


import * as os from 'os';
import config from '../shared/config';

import {
  bodyParser,
  handleException,
  logRequest,
  handleCORS,
} from './middleware';

const app = new Koa();
const router = new Router({
  prefix: '/funds'
});

/**/
const env = config.get('env');
const hostname = os.hostname();
const port = config.get('port');

console.log('Starting Funds API');
console.log('Prefix:', '/funds');
console.log('Port:', port);
console.log('Environment:', env);
console.log('Hostname:', hostname);


app.use(handleException);
app.use(logRequest);
app.use(handleCORS);
router.use(bodyParser);

router.use('/info', ...infoModule);


app.use(router.routes()).use(router.allowedMethods());

app.listen(port);