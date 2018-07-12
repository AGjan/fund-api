const sqlGetFunds = `
SELECT pac_skema_json.get(1200,:1) data
from dual
`;

export async function getFunds(conn) {
  const result = await conn.execute(sqlGetFunds, ['IPM']);
  const strJson = result.rows[0].DATA;
  return JSON.parse(strJson);
}

const sqlGetFund = `
SELECT pac_skema_json.get(1201,:1,:2) data
from dual
`;

export async function getFund(id, conn) {
  const result = await conn.execute(sqlGetFund, ['IPM', id]);
  const strJson = result.rows[0].DATA;
  console.log(strJson);
  return JSON.parse(strJson);
}

const sqlGetNav = `
SELECT pac_skema_json.get(:1,:2) data
from dual
`;

export async function getNav(conn) {
  const res1 = await conn.execute(sqlGetNav, [8, 'IPM']);
  const obj1 = JSON.parse(res1.rows[0].DATA);

  const res2 = await conn.execute(sqlGetNav, [810, 'IPM']);
  const obj2 = JSON.parse(res2.rows[0].DATA);

  return {
    data: {
      exchangetradedfunds: obj1.exchangetradedfunds,
      fundmarket: obj2.fundmarket
    }
  };
}

const sqlGetValues = `
select to_char(sk.tildato,'yyyy-mm-dd') "asofdate"
     , pac_skema.vaerdi_num_rc('OFM002',p.portefoelje_id,sk.koersel_id,1,1) "nav"
  from portefoelje p
     , skema_parameter sp
     , skema_Koersel sk
where p.portefoelje_id = :1
  and sk.skema_id = 810
  and sp.koersel_id = sk.koersel_id
  and sp.portefoelje_id = p.portefoelje_id
  and not exists (
    Select 1
      From skema_koersel sk2
         , skema_parameter sp2
     Where sk2.skema_id = sk.skema_id
       And sk2.tildato = sk.tildato
       And sp2.koersel_id = sk2.koersel_id
       And sp2.portefoelje_id = p.portefoelje_id
       and sk2.koersel_id > sk.koersel_id
    )
union 
select to_char(sk.tildato,'yyyy-mm-dd') asofdate
     , pac_skema.vaerdi_num_rc('IFRIV002',p.portefoelje_id,sk.koersel_id,1,1) nav
  from portefoelje p
     , skema_parameter sp
     , skema_Koersel sk
where p.portefoelje_id = :1
  and sk.skema_id = 8
  and sp.koersel_id = sk.koersel_id
  and sp.portefoelje_id = p.portefoelje_id
  and not exists (
    Select 1
      From skema_koersel sk2
         , skema_parameter sp2
     Where sk2.skema_id = sk.skema_id
       And sk2.tildato = sk.tildato
       And sp2.koersel_id = sk2.koersel_id
       And sp2.portefoelje_id = p.portefoelje_id
       and sk2.koersel_id > sk.koersel_id
    )
order by 1 desc
`;
export async function getValues(id, conn) {
  const result = await conn.execute(sqlGetValues, [id]);
  return { data: result.rows };
}
