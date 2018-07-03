import * as Raven from 'raven';
import config from './config';

const dsn = config.get('raven_dsn');

Raven.config(dsn).install();

export function captureException(exception) {
  return new Promise((resolve, reject) => {
    Raven.captureException(exception, (error, id) => {
      if (error) {
        console.error('Failed to send captured exception to Sentry');
        // reject(error);
      } else {
        console.log('Exception captured and sent to Sentry');
        resolve(id);
      }
    });
  });
}

export default {
  captureException
};
