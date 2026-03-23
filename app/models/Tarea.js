
const { demoData } = require('./Conexion');

class Tarea {
    static listarPorAlumno(idAlumno) {
        return demoData.tareas.filter((tarea) => Number(tarea.id_alumno) === Number(idAlumno));
    }

    static marcarComoCompletada(idAlumno, idTarea) {
        const tarea = demoData.tareas.find(
            (item) => Number(item.id_alumno) === Number(idAlumno) && Number(item.id_tarea) === Number(idTarea)
        );

        if (!tarea) {
            return null;
        }

        tarea.estado = 'completada';
        tarea.entrega = 'Completada';
        return tarea;
    }

    static resumenPorAlumno(idAlumno) {
        const tareas = this.listarPorAlumno(idAlumno);
        const total = tareas.length;
        const completadas = tareas.filter((item) => item.estado === 'completada').length;
        const pendientes = total - completadas;

        return {
            total,
            completadas,
            pendientes,
            progreso: total === 0 ? 0 : Math.round((completadas / total) * 100)
        };
    }
}

module.exports = Tarea;
