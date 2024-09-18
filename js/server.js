const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session'); // Importa express-session

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Interbank24**',
    database: 'david_server'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

app.use(bodyParser.json());
app.use(cors()); // Permite todas las solicitudes CORS

// Configura express-session
app.use(session({
    secret: 'your-secret', // Cambia esto por un secreto seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
    db.query(query, [email, hash], (err, result) => {
        if (err) {
            console.error('Error al registrar al usuario:', err);
            res.status(500).send('Error al registrar al usuario');
            return;
        }
        res.send('Usuario registrado exitosamente');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            res.status(500).send('Error al iniciar sesión');
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user; // Guarda la información del usuario en la sesión
                res.json({ message: 'Inicio de sesión exitoso', email: user.email });
            } else {
                res.status(401).send('Correo o contraseña incorrectos');
            }
        } else {
            res.status(401).send('Correo o contraseña incorrectos');
        }
    });
});

app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.send('Sesión cerrada con éxito');
        });
    } else {
        res.status(400).send('No hay sesión activa');
    }
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
