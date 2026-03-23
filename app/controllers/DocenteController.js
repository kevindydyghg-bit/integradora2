const Alumno = require('../models/Alumno');
const { getConnectionStatus } = require('../models/Conexion');

const DocenteController = {
    async dashboard(req, res) {
        const alumnos = Alumno.obtenerTodos();
        const alertas = Alumno.listarAlertas();
        const db = await getConnectionStatus();

        const conectados = alumnos.filter((item) => item.dispositivo?.estado === 'conectado').length;
        const activos = alertas.filter((item) => item.estado === 'activa').length;

        return res.json({
            ok: true,
            data: {
                resumen: {
                    total_alumnos: alumnos.length,
                    conectados,
                    alertas_activas: activos,
                    promedio_grupal: alumnos.length
                        ? Math.round(alumnos.reduce((acc, item) => acc + Number(item.progreso || 0), 0) / alumnos.length)
                        : 0
                },
                alumnos,
                alertas,
                base_datos: db
            }
        });
    },

    listarAlertas(req, res) {
        const alertas = Alumno.listarAlertas();
        return res.json({ ok: true, data: alertas });
    },

    resolverAlerta(req, res) {
        const { id } = req.params;
        const { docente } = req.body;
        const alerta = Alumno.resolverAlerta(id, docente);

        if (!alerta) {
            return res.status(404).json({ ok: false, message: 'Alerta no encontrada.' });
        }

        return res.json({ ok: true, message: 'Alerta marcada como resuelta.', data: alerta });
    }
};

module.exports = DocenteController;