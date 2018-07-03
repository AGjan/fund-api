import * as http from 'http';
import HTTP_STATUS from './http_status';
import config from './config';
import { query } from './db';

const sqlPostThread = `
insert 
  into v_mailthread(subject) 
  values($1) returning id
`;

const sqlPostMessage = `
insert 
into v_mailevent(thread_id,code,message) 
values($1,'MSG',$2) returning id
`;

export async function internalMail(msg) {
  try {
    const data1 = await query(sqlPostThread, ['System Error']);
    const thread_id = data1.rows[0].id;
    const data2 = await query(sqlPostMessage, [thread_id, msg]);
  } catch (error) {
    console.log(error);
    console.log(
      'System Failure while trying to deliver interal Mail regarding error'
    );
  }
}

/* 
this function sends a error message to the system API, which may be running on a different server
The system API has access to SMTP-server and a logging database
*/
export async function systemError(subject, error) {
  try {
    console.log(
      `Sending error msg to ${config.get('systemhost')}${config.get(
        'systemport'
      )}${config.get('systemerrorpath')}`
    );

    const options = {
      host: config.get('systemhost'),
      path: config.get('systemerrorpath'),
      port: config.get('systemport'),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    var req = http.request(options, response => {});
    req.on('error', err => console.log('Error sending to system '));
    req.write(JSON.stringify(error));
    req.end();
  } catch (err) {
    console.log('Error while reporting system error');
    console.log('---------------------------------------');
    console.log(err);
    console.log('---------------------------------------');
  }
}

/* 
this function sends a error message to the system API, which may be running on a different server
The system API has access to SMTP-server and a logging database
*/
export async function systemLog(subject, error) {
  try {
    console.log(
      `Sending error msg to ${config.get('systemhost')}${config.get(
        'systemport'
      )}${config.get('systemlogpath')}`
    );

    const options = {
      host: config.get('systemhost'),
      path: config.get('systemlogpath'),
      port: config.get('systemport'),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    var req = http.request(options, response => {});
    req.on('error', err => console.log('Error sending to system '));
    req.write(JSON.stringify(error));
    req.end();
  } catch (err) {
    console.log('Error while reporting system error');
    console.log('---------------------------------------');
    console.log(err);
    console.log('---------------------------------------');
  }
}
