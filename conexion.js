const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require("tedious").TYPES;

const config = {
  server: "HAZLEYPC",
  authentication: {
    type: "default",
    options: {
      userName: "Hgallo",
      password: "Readnock123",
    },
  },
  options: {
    port: 1433,
    database: "EduLearn",
    trustServerCertificate: true,
  },
};

const connection = new Connection(config);

connection.connect();

connection.on("connect", (err) => {
  if (err) {
    console.error("Error al conectarse a la Base de Datos:", err.message);
    throw err;
  } else {
    executeStatement();
  }
});

function executeStatement() {
  const request = new Request("SELECT * FROM Users", (err, rowCont) => {
    if (err) {
      throw err;
    } else {
      connection.close();
    }
  });

  request.on("row", (columns) => {
    console.log(columns);
  });

  connection.execSql(request);
}
