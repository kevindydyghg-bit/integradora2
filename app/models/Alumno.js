
const { demoData, nextId, getRolNombre } = require('./Conexion');
const Tarea = require('./Tarea');

class Alumno {
    static autenticar(identificador, password) {
        const normalizado = String(identificador || '').trim().toLowerCase();

        const usuario = demoData.usuarios.find((item) => {
            const coincideIdentificador = item.usuario.toLowerCase() === normalizado || item.email.toLowerCase() === normalizado;
            return coincideIdentificador && item.password === password;
        });

        if (!usuario) {
            return null;
        }

        return {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            usuario: usuario.usuario,
            rol: getRolNombre(usuario.id_rol),
            iniciales: usuario.iniciales
        };
    }

    static obtenerTodos() {
        return demoData.usuarios
            .filter((usuario) => getRolNombre(usuario.id_rol) === 'alumno')
            .map((usuario) => this.obtenerResumen(usuario.id_usuario));
    }

    static obtenerPorId(idAlumno) {
        const usuario = demoData.usuarios.find((item) => Number(item.id_usuario) === Number(idAlumno));
        if (!usuario) {
            return null;
        }

        const dispositivo = demoData.dispositivos.find((item) => Number(item.id_usuario) === Number(idAlumno));
        const estadistica = demoData.estadisticas.find((item) => Number(item.id_usuario) === Number(idAlumno));
        const sesionActiva = demoData.sesiones.find((item) => Number(item.id_usuario) === Number(idAlumno) && !item.fin_sesion);
        const actividad = demoData.actividades.find((item) => Number(item.id_actividad) === Number(sesionActiva?.id_actividad || 1));

        return {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            usuario: usuario.usuario,
            iniciales: usuario.iniciales,
            rol: getRolNombre(usuario.id_rol),
            dispositivo: dispositivo || null,
            estadistica: estadistica || null,
            sesionActiva: sesionActiva || null,
            actividadActual: actividad || demoData.actividades[0]
        };
    }

    static obtenerResumen(idAlumno) {
        const alumno = this.obtenerPorId(idAlumno);

        if (!alumno) {
            return null;
        }

        const tareas = Tarea.resumenPorAlumno(idAlumno);
        const alerta = demoData.alertas.find(
            (item) => Number(item.id_alumno) === Number(idAlumno) && item.estado === 'activa'
        );

        return {
            id_usuario: alumno.id_usuario,
            nombre: alumno.nombre,
            iniciales: alumno.iniciales,
            dispositivo: alumno.dispositivo,
            actividadActual: alumno.actividadActual,
            estadistica: alumno.estadistica,
            tareas,
            alertaActiva: alerta || null,
            progreso: tareas.progreso || alumno.estadistica?.progreso || 0
        };
    }

    static obtenerTareas(idAlumno) {
        return Tarea.listarPorAlumno(idAlumno);
    }

    static registrarSOS(idAlumno, mensaje) {
        const alumno = this.obtenerPorId(idAlumno);
        if (!alumno) {
            return null;
        }

        const alerta = {
            id_alerta: nextId('alertas', 'id_alerta'),
            id_alumno: Number(idAlumno),
            nombre_alumno: alumno.nombre,
            mensaje: mensaje || 'El alumno requiere apoyo.',
            estado: 'activa',
            fecha_hora: new Date().toISOString(),
            resuelta_por: null
        };

        demoData.alertas.unshift(alerta);
        return alerta;
    }

    static registrarInteraccion(idAlumno, payload = {}) {
        const alumno = this.obtenerPorId(idAlumno);
        if (!alumno) {
            return null;
        }

        let sesion = demoData.sesiones.find((item) => Number(item.id_usuario) === Number(idAlumno) && !item.fin_sesion);

        if (!sesion) {
            sesion = {
                id_sesion: nextId('sesiones', 'id_sesion'),
                id_usuario: Number(idAlumno),
                id_dispositivo: alumno.dispositivo?.id_dispositivo || null,
                id_actividad: payload.id_actividad || 1,
                inicio_sesion: new Date().toISOString(),
                fin_sesion: null,
                tiempo_atencion: payload.tiempo_atencion || 0
            };
            demoData.sesiones.push(sesion);
        }

        const interaccion = {
            id_interaccion: nextId('interacciones', 'id_interaccion'),
            id_sesion: sesion.id_sesion,
            id_actividad: payload.id_actividad || sesion.id_actividad || 1,
            respuesta_usuario: payload.respuesta_usuario || 'Sin respuesta',
            resultado: payload.resultado || 'correcto',
            tiempo_respuesta: Number(payload.tiempo_respuesta || 0),
            tipo_estimulo: payload.tipo_estimulo || 'visual',
            fecha_hora: new Date().toISOString()
        };

        demoData.interacciones.push(interaccion);

        const estadistica = demoData.estadisticas.find((item) => Number(item.id_usuario) === Number(idAlumno));
        if (estadistica) {
            estadistica.total_respuestas += 1;
            if (interaccion.resultado === 'correcto') {
                estadistica.respuestas_correctas += 1;
            }

            const total = estadistica.total_respuestas;
            estadistica.promedio_tiempo = Math.max(1, Math.round(((estadistica.promedio_tiempo * (total - 1)) + interaccion.tiempo_respuesta) / total));
            estadistica.tiempo_atencion = Math.max(estadistica.tiempo_atencion, Number(payload.tiempo_atencion || estadistica.tiempo_atencion));
        }

        return interaccion;
    }

    static resolverAlerta(idAlerta, docenteNombre) {
        const alerta = demoData.alertas.find((item) => Number(item.id_alerta) === Number(idAlerta));
        if (!alerta) {
            return null;
        }

        alerta.estado = 'resuelta';
        alerta.resuelta_por = docenteNombre || 'Docente';
        return alerta;
    }

    static listarAlertas() {
        return demoData.alertas;
    }
}

module.exports = Alumno;
