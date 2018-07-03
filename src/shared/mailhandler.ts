import * as http from 'http';
import config from './config';

/* 
this function sends a error message to the system API, which may be running on a different server
The system API has access to SMTP-server and a logging database
*/
export async function externalMail() {
  try {
    console.log(
      `Sending request to ${config.get('systemhost')}:${config.get(
        'systemport'
      )}${config.get('systemmailpath')}`
    );

    const options = {
      host: config.get('systemhost'),
      path: config.get('systemmailpath'),
      port: config.get('systemport'),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    var req = http.request(options, response => {});
    req.on('error', err => console.log('Error sending to system '));
    req.write('{}');
    req.end();
  } catch (err) {
    console.log('Error while requesting shipment of outgoing mails');
    console.log('---------------------------------------');
    console.log(err);
    console.log('---------------------------------------');
  }
}
