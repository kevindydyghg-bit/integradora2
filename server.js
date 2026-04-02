const express = require('express');
const cors = require('cors');
const db = require('./config/database'); // Asegúrate de que este archivo exista como lo armamos antes

const app = express();
const PORT = 3000;

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Permite a Node leer los datos JSON que manda el Frontend

// ==========================================
// RUTA 1: LOGIN REAL CON LA BASE DE DATOS
// ==========================================
app.post('/api/login', async (req, res) => {
    // Extraemos lo que el usuario escribió en el HTML
    const { nombreUsuario, passwordUsuario } = req.body;
    
    try {
        // Buscamos si existe ese nombre y esa contraseña exactos
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, id_rol FROM USUARIO WHERE nombre = ? AND contrasena = ?',
            [nombreUsuario, passwordUsuario]
        );
        
        if (rows.length > 0) {
            // Usuario encontrado: mandamos "success: true" y sus datos
            res.json({ success: true, usuario: rows[0] });
        } else {
            // No encontrado: error 401 (No autorizado)
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

// ==========================================
// RUTA 2: OBTENER ALUMNOS PARA EL DASHBOARD
// ==========================================
app.get('/api/alumnos', async (req, res) => {
    try {
        // Consultamos solo a los usuarios que son Estudiantes (id_rol = 2)
        const [rows] = await db.query('SELECT id_usuario, nombre FROM USUARIO WHERE id_rol = 2');
        res.json(rows);
    } catch (error) {
        console.error("Error al consultar alumnos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Edu Integral corriendo en http://localhost:${PORT}`);
});