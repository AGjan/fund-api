
const sqlGetFunds = `
SELECT pac_skema_json.get(1200,:1) data
from dual
`;

export async function getFunds(conn) {
  const result = await conn.execute(sqlGetFunds, ['IPM']);
  const strJson = result.rows[0].DATA;
  return( JSON.parse(strJson));
}

const sqlGetFund = `
SELECT pac_skema_json.get(1201,:1,:2) data
from dual
`;

export async function getFund(id,conn) {
  const result = await conn.execute(sqlGetFund, ['IPM',id]);
  const strJson = result.rows[0].DATA;
  return( JSON.parse(strJson));
}


