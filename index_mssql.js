const sql = require("mssql");
const sqlConfig = {
  user: "Hgallo",
  password: "Readnock123",
  database: "EduLearn",
  server: "HAZLEYPC",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
  },
};

const connection = async () => {
  try {
    const promise = await sql.connect(sqlConfig);
    const result = await sql.query(`SELECT * FROM Users`);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};
connection();
