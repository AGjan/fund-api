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
