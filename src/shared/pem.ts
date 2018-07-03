import * as pem from 'pem';

function certReader(bufferOrPath, p12Password, clientKeyPassword): any {
  return new Promise((resolve, reject) => {
    const pemOptions = {
      clientKeyPassword: clientKeyPassword,
      p12Password: p12Password
    };

    pem.readPkcs12(bufferOrPath, pemOptions, (err, cert) => {
      if (err) {
        reject(err);
      } else {
        resolve(cert);
      }
    });
  });
}

export default async function readCert(
  certLocation,
  p12Password,
  clientKeyPassword
) {
  const certFile = await certReader(
    certLocation,
    p12Password,
    clientKeyPassword
  );
  certFile.cert
    .replace(/\r|\n/g, '')
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '');
  return certFile;
}
