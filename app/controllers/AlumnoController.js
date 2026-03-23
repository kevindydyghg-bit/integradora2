const Alumno = require('../models/Alumno');
const Tarea = require('../models/Tarea');

const AlumnoController = {
    obtenerResumen(req, res) {
        const { id } = req.params;
        const resumen = Alumno.obtenerResumen(id);

        if (!resumen) {
            return res.status(404).json({ ok: false, message: 'Alumno no encontrado.' });
        }

        return res.json({ ok: true, data: resumen });
    },

    obtenerTareas(req, res) {
        const { id } = req.params;
        const tareas = Alumno.obtenerTareas(id);
        return res.json({ ok: true, data: tareas });
    },

    completarTarea(req, res) {
        const { id, idTarea } = req.params;
        const tarea = Tarea.marcarComoCompletada(id, idTarea);

        if (!tarea) {
            return res.status(404).json({ ok: false, message: 'Tarea no encontrada.' });
        }

        return res.json({ ok: true, message: 'Tarea marcada como completada.', data: tarea });
    },

    registrarSOS(req, res) {
        const { id } = req.params;
        const { mensaje } = req.body;
        const alerta = Alumno.registrarSOS(id, mensaje);

        if (!alerta) {
            return res.status(404).json({ ok: false, message: 'No se pudo registrar la alerta.' });
        }

        return res.status(201).json({ ok: true, message: 'Alerta SOS registrada.', data: alerta });
    },

    registrarInteraccion(req, res) {
        const { id } = req.params;
        const interaccion = Alumno.registrarInteraccion(id, req.body);

        if (!interaccion) {
            return res.status(404).json({ ok: false, message: 'No se pudo registrar la interacción.' });
        }

        return res.status(201).json({ ok: true, message: 'Interacción guardada.', data: interaccion });
    }
};

module.exports = AlumnoController;