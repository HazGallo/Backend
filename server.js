const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 3001;

const sqlConfig = {
  user: "Hgallo",
  password: "Readnock123",
  database: "EduLearn",
  server: "HAZLEYPC",
  port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(express.json()); // Habilita el uso de JSON en las solicitudes

// Obtener todos los usuarios de Teacher
app.get("/api/showTeachers", async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query("SELECT * FROM Teachers");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching data from database" });
  } finally {
    await sql.close();
  }
});

// Obtener todos los usuarios de Teacher
app.get("/api/showStudents", async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query("SELECT * FROM Students");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching data from database" });
  } finally {
    await sql.close();
  }
});

// Insertar un nuevo usuario utilizando un stored procedure
app.post("/api/admins", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);
    // Verifica si el correo electrónico ya está registrado
    const emailCheckResult =
      await sql.query`SELECT COUNT(*) AS count FROM Admins WHERE email = ${email}`;
    const emailCount = emailCheckResult.recordset[0].count;

    if (emailCount > 0) {
      // El correo electrónico ya está registrado
      res.status(400).json({ success: false, message: "Correo registrado" });
    } else {
      // El correo electrónico no está registrado, procede con la inserción
      const result =
        await sql.query`EXEC InsertarAdmins @Username=${username}, @Password=${password}, @Email=${email}`;
      res.json({ success: true, message: "Usuario insertado correctamente" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al insertar usuario en la base de datos" });
  } finally {
    await sql.close();
  }
});

// ... (otros import y configuraciones)

// Ruta para el inicio de sesión de admins
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);

    // Verifica si el correo electrónico existe y la contraseña coincide
    const userCheckResult = await sql.query`
      SELECT * FROM Admins
      WHERE email = ${email} AND password = ${password}
    `;

    if (userCheckResult.recordset.length > 0) {
      // Las credenciales son correctas
      res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      // Las credenciales son incorrectas
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    await sql.close();
  }
});

// Ruta para el inicio de sesión de teachers
app.post("/api/teachers", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);

    // Verifica si el correo electrónico existe y la contraseña coincide
    const userCheckResult = await sql.query`
      SELECT * FROM Teachers
      WHERE email = ${email} AND password = ${password}
    `;

    if (userCheckResult.recordset.length > 0) {
      // Las credenciales son correctas
      res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      // Las credenciales son incorrectas
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    await sql.close();
  }
});

// Ruta para insertar datos por medio de un sp en teachers
app.post("/api/insertteachers", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);
    // Verifica si el correo electrónico ya está registrado
    const emailCheckResult =
      await sql.query`SELECT COUNT(*) AS count FROM Teachers WHERE email = ${email}`;
    const emailCount = emailCheckResult.recordset[0].count;

    if (emailCount > 0) {
      // El correo electrónico ya está registrado
      res.status(400).json({ success: false, message: "Correo registrado" });
    } else {
      // El correo electrónico no está registrado, procede con la inserción
      const result =
        await sql.query`EXEC InsertarTeachers @Username=${username}, @Password=${password}, @Email=${email}`;
      res.json({ success: true, message: "Usuario insertado correctamente" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al insertar usuario en la base de datos" });
  } finally {
    await sql.close();
  }
});

// Ruta para el inicio de sesión de students
app.post("/api/students", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);

    // Verifica si el correo electrónico existe y la contraseña coincide
    const userCheckResult = await sql.query`
      SELECT * FROM Students
      WHERE email = ${email} AND password = ${password}
    `;

    if (userCheckResult.recordset.length > 0) {
      // Las credenciales son correctas
      res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      // Las credenciales son incorrectas
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    await sql.close();
  }
});

// Ruta para insertar datos por medio de un sp en students
app.post("/api/insertstudents", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ success: false, message: "Datos incompletos" });
    return;
  }

  try {
    await sql.connect(sqlConfig);
    // Verifica si el correo electrónico ya está registrado
    const emailCheckResult =
      await sql.query`SELECT COUNT(*) AS count FROM Students WHERE email = ${email}`;
    const emailCount = emailCheckResult.recordset[0].count;

    if (emailCount > 0) {
      // El correo electrónico ya está registrado
      res.status(400).json({ success: false, message: "Correo registrado" });
    } else {
      // El correo electrónico no está registrado, procede con la inserción
      const result =
        await sql.query`EXEC InsertarStudents @Username=${username}, @Password=${password}, @Email=${email}`;
      res.json({ success: true, message: "Usuario insertado correctamente" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al insertar usuario en la base de datos" });
  } finally {
    await sql.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
