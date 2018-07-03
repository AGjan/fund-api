import * as oracledb from 'oracledb';

const sqlGetMMFunds = `
SELECT port.portefoelje "Kode"
     , port.navn  "Navn"
     , pap.isin_kode "ISIN"
     , (select nvl(sum(-tb.maengde),0) mgd 
        from transaktionbeholdning tb
         where tb.portefoelje_id = port.portefoelje_id
          and tb.papir_id = pap.papir_id
          and tb.dato_kode='H'
          and d.d between tb.fradato and tb.tildato
  ) "Cirkulerende"
     , round(pac_skema.vaerdi_num_rc('IFRIV002',sk.n2,sk.n1,1,1),4) "NAV"
     , round(pac_skema.vaerdi_num_rc('IFRIV004',sk.n2,sk.n1,1,1),4) "Emission"
     , round(pac_skema.vaerdi_num_rc('IFRIV005',sk.n2,sk.n1,1,1),4) "Indløsning"
     , pac_skema.svaerdi_txt('IFRIV008',sk.n2,d.d,1,1) "Opgjort"
  From skema_portefoelje sp
     , portefoelje port
     , dates d
     , table (f_skema_koersel(8,port.portefoelje,d.d)) sk
     , papir pap
where sp.skema_id = 8 
  And port.portefoelje_id = sp.portefoelje_id
  And pap.papir_id = f_portpap(sp.portefoelje_id,d.d)
  and d.d = trunc(sysdate,'dd')
  And pap.notering_id is not null
Order by 1
`;

export function getMMFunds({query},conn) {
  return new Promise(async function(resolve, reject) {
    try {
      const result = await conn.execute(sqlGetMMFunds);

      resolve( result.rows );
    } catch (err) {
      reject(err);
    }
  });
}



const sqlGetPosition = `
SELECT v.papirtype_kode type_code
    , pt.betegnelse type
    , v.valuta currency
    , v.aktuel_Vkurs fxrate
    , v.papir security
    , v.papirnavn security_name
    , v.maengde quantity
    , round(v.aktuel_vaerdi,2) marketvalue_qc
    , round(v.aktuel_vaerdi_port,2) marketvalue_pc
  From v_datobeh v
      , sys_papirtype pt
  where v.portefoelje=:port
   and v.tildato = pac_glo.ag_to_date2(:asofdate)
    and pt.papirtype_id = v.papirtype_id
  order by 1
`;

export function getPosition(query, conn) {
  return new Promise(async function(resolve, reject) {
    try {
      let result = await conn.execute(sqlGetPosition, {
        asofdate: {
          type: oracledb.STRING,
          val: query.asofdate
        },
        port: {
          type: oracledb.STRING,
          val: query.port
        }
      });

      resolve(result.rows);
    } catch (err) {
      // catches errors in getConnection and the query
      reject(err);
    }
  });
}

const sqlInsertSubscription = `INSERT INTO v_ordersubscription(email,text,security,quantity) values(:1,:2,:3,:4)`;
const sqlInsertRedemption = `INSERT INTO v_orderredemption(email,text,security,quantity) values(:1,:2,:3,:4)`;

export function insertSubscription(objOrder, conn) {
  return new Promise(async function(resolve, reject) {
    try {
      console.log('New order ', objOrder);
      await conn.execute(sqlInsertSubscription, [objOrder.email, objOrder.text,objOrder.security,objOrder.quantity]);
      resolve({ message: "OK" });
    } catch (err) {
      reject(err);
    }
  });
}

export function insertRedemption(objOrder, conn) {
  return new Promise(async function(resolve, reject) {
    try {
      console.log('New order ', objOrder);
      await conn.execute(sqlInsertRedemption, [objOrder.email, objOrder.text,objOrder.security,objOrder.quantity]);
      
      resolve({ message: "OK" });
    } catch (err) {
      reject(err);
    }
  });
}

