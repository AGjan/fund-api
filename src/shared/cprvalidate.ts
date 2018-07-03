import * as https from 'https';
import * as xml2js from 'xml2js';
import * as url from 'url';
import config from './config';
import { readFile } from './util';

const PID_CONFIG = config.get('nemid_pid');

const URL = url.URL;

export async function cprValidate(pid, cpr) {

  const body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:loc="http://localhost/" xmlns:java="java:dk.certifikat.pid.webservices">
    <soapenv:Header/>
    <soapenv:Body>
      <loc:pid>
        <loc:pIDRequests>
          <java:PIDRequest>
            <java:CPR>${cpr}</java:CPR>
            <java:PID>${pid}</java:PID>
            <java:b64Cert></java:b64Cert>
            <java:id></java:id>
            <java:serviceId>${PID_CONFIG.provider}</java:serviceId>
          </java:PIDRequest>
        </loc:pIDRequests>
      </loc:pid>
    </soapenv:Body>
  </soapenv:Envelope>
  `.trim();

  const key = await readFile(PID_CONFIG.key_file);
  const cert = await readFile(PID_CONFIG.cert_file);

  const { host, path } = PID_CONFIG;

  try {
    const data = await request('https://' + host + path, {
      body,
      key,
      cert,
      port: 443,
      method: 'POST',
      headers: {
        'Content-type': 'text/xml',
        'User-Agent': 'Mozilla/4.0',
        'Accept-Language': 'en-US,en',
        'Content-length': Buffer.byteLength(body)
      }
    });
    const xml = await parseXML(data);
    const answer =
      xml['soap:Envelope']['soap:Body'][0]['ns2:pidResponse'][0][
        'ns2:result'
      ][0]['PIDReply'][0]['statusTextDK'][0];
    return answer;
  } catch (error) {
    return 'Fejl ved validering af CPR';
  }
}

function parseXML(data) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function request(url, options) {
  const { pathname, hostname } = new URL(url);

  let { body, ...httpOptions } = options;

  httpOptions.path = pathname;
  httpOptions.hostname = hostname;

  return new Promise((resolve, reject) => {
    const request = https.request(httpOptions, result => {
      result.setEncoding('utf-8');
      let body = '';
      result.on('data', chunk => {
        body += chunk;
      });

      result.on('end', () => {
        resolve(body);
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.write(body);
    request.end();
  });
}
