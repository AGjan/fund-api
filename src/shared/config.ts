import * as convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8083,
    env: 'PORT'
  },
  systemhost: {
    doc: 'System API host',
    format: '*',
    default: 'ag-db02.c1.sdc-hosting.com',
    env: 'SYS_HOST'
  },
  systemport: {
    doc: 'System API host port number',
    format: '*',
    default: '8082',
    env: 'SYS_HOST_PORT'
  },
  systemerrorpath: {
    doc: 'System API host error path',
    format: '*',
    default: '/system/mail/error',
    env: 'SYS_HOST_ERROR'
  },
  systemlogpath: {
    doc: 'System API host error path',
    format: '*',
    default: '/system/log',
    env: 'SYS_HOST_LOG'
  },
  systemmailpath: {
    doc: 'System API host error path',
    format: '*',
    default: '/system/mail/shipoutbox',
    env: 'SYS_HOST_ERROR'
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: ' ',
      env: 'DB_HOST'
    },
    port: {
      doc: 'Database host port number',
      format: 'port',
      default: 80,
      env: 'DB_PORT'
    },
    database: {
      doc: 'Database name',
      format: String,
      default: ' ',
      env: 'DB_NAME'
    },
    user: {
      doc: 'Database user',
      format: String,
      default: ' ',
      env: 'DB_USER'
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'none',
      env: 'DB_PASSWORD'
    }
  },
  mail: {
    host: {
      doc: 'SMTP Server name',
      format: String,
      default: 'mailrelay1.c2.sdc-hosting.com',
      env: 'SMTP_HOST'
    },
    port: {
      doc: 'SMTP Server Port number',
      format: 'port',
      default: 25,
      env: 'SMTP_PORT'
    },
    system_address: {
      doc: 'Mail receiver for alert/log mails',
      format: String,
      default: 'kontakt@fundmarket.dk',
      env: 'ALERT_EMAIL'
    }
  }
  }
);

export default config;

// Load environment dependent configuration
const env = config.get('env');

config.loadFile(`src/secret/${env}.json`);

// Perform validation
config.validate({ allowed: 'strict' });
