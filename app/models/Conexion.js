
const { DB_ENABLED, testConnection } = require('../../config/database');

const demoData = {
    roles: [
        { id_rol: 1, nombre: 'docente' },
        { id_rol: 2, nombre: 'alumno' }
    ],
    usuarios: [
        {
            id_usuario: 1,
            usuario: 'daniel',
            nombre: 'Daniel Álvarez',
            email: 'admin@edu.com',
            password: '1234',
            id_rol: 1,
            iniciales: 'DA'
        },
        {
            id_usuario: 2,
            usuario: 'kevin',
            nombre: 'Kevin Junior',
            email: 'kevin@edu.com',
            password: '1234',
            id_rol: 2,
            iniciales: 'KJ'
        },
        {
            id_usuario: 3,
            usuario: 'elena',
            nombre: 'Elena Torres',
            email: 'elena@edu.com',
            password: '1234',
            id_rol: 2,
            iniciales: 'ET'
        },
        {
            id_usuario: 4,
            usuario: 'diego',
            nombre: 'Diego Ramírez',
            email: 'diego@edu.com',
            password: '1234',
            id_rol: 2,
            iniciales: 'DR'
        },
        {
            id_usuario: 5,
            usuario: 'ana',
            nombre: 'Ana Paula Gómez',
            email: 'ana@edu.com',
            password: '1234',
            id_rol: 2,
            iniciales: 'AG'
        }
    ],
    dispositivos: [
        { id_dispositivo: 1, id_usuario: 2, nombre_modulo: 'ESP32-KJ', estado: 'conectado' },
        { id_dispositivo: 2, id_usuario: 3, nombre_modulo: 'ESP32-ET', estado: 'conectado' },
        { id_dispositivo: 3, id_usuario: 4, nombre_modulo: 'ESP32-DR', estado: 'desconectado' },
        { id_dispositivo: 4, id_usuario: 5, nombre_modulo: 'ESP32-AG', estado: 'conectado' }
    ],
    actividades: [
        { id_actividad: 1, nombre_actividad: 'Variables', descripcion: 'Introducción a variables y cajas de almacenamiento.' },
        { id_actividad: 2, nombre_actividad: 'Tipos de dato', descripcion: 'Números, texto y valores lógicos.' },
        { id_actividad: 3, nombre_actividad: 'Condicionales', descripcion: 'Tomar decisiones con if y else.' },
        { id_actividad: 4, nombre_actividad: 'Ciclos', descripcion: 'Repetición de instrucciones.' },
        { id_actividad: 5, nombre_actividad: 'Funciones', descripcion: 'Organización y reutilización de código.' }
    ],
    tareas: [
        { id_tarea: 1, id_alumno: 2, titulo: 'Diagrama de Flujo', descripcion: 'Representar el proceso de una variable.', entrega: 'Hoy 23:59', estado: 'pendiente' },
        { id_tarea: 2, id_alumno: 2, titulo: 'Lectura: Condicionales', descripcion: 'Leer y resumir el tema.', entrega: 'Viernes', estado: 'pendiente' },
        { id_tarea: 3, id_alumno: 2, titulo: 'Práctica 1', descripcion: 'Resolver 5 ejercicios básicos.', entrega: 'Completada', estado: 'completada' },
        { id_tarea: 4, id_alumno: 3, titulo: 'Resumen de clase', descripcion: 'Entregar conclusiones de la unidad.', entrega: 'Mañana', estado: 'pendiente' },
        { id_tarea: 5, id_alumno: 3, titulo: 'Actividad guiada', descripcion: 'Resolver retos del módulo.', entrega: 'Completada', estado: 'completada' },
        { id_tarea: 6, id_alumno: 4, titulo: 'Ejercicios de repaso', descripcion: 'Practicar condicionales.', entrega: 'Lunes', estado: 'pendiente' },
        { id_tarea: 7, id_alumno: 5, titulo: 'Proyecto corto', descripcion: 'Crear pseudocódigo.', entrega: 'Jueves', estado: 'pendiente' },
        { id_tarea: 8, id_alumno: 5, titulo: 'Cuestionario', descripcion: 'Responder evaluación diagnóstica.', entrega: 'Completada', estado: 'completada' }
    ],
    estadisticas: [
        { id_estadistica: 1, id_usuario: 2, total_respuestas: 18, respuestas_correctas: 15, promedio_tiempo: 7, tiempo_atencion: 24, progreso: 80 },
        { id_estadistica: 2, id_usuario: 3, total_respuestas: 22, respuestas_correctas: 22, promedio_tiempo: 5, tiempo_atencion: 31, progreso: 100 },
        { id_estadistica: 3, id_usuario: 4, total_respuestas: 9, respuestas_correctas: 5, promedio_tiempo: 14, tiempo_atencion: 11, progreso: 28 },
        { id_estadistica: 4, id_usuario: 5, total_respuestas: 20, respuestas_correctas: 17, promedio_tiempo: 8, tiempo_atencion: 26, progreso: 85 }
    ],
    sesiones: [
        {
            id_sesion: 1,
            id_usuario: 2,
            id_dispositivo: 1,
            id_actividad: 1,
            inicio_sesion: new Date().toISOString(),
            fin_sesion: null,
            tiempo_atencion: 24
        }
    ],
    interacciones: [
        {
            id_interaccion: 1,
            id_sesion: 1,
            id_actividad: 1,
            respuesta_usuario: 'Caja',
            resultado: 'correcto',
            tiempo_respuesta: 6,
            tipo_estimulo: 'visual',
            fecha_hora: new Date().toISOString()
        }
    ],
    alertas: [
        {
            id_alerta: 1,
            id_alumno: 2,
            nombre_alumno: 'Kevin Junior',
            mensaje: 'El alumno solicita apoyo en clase.',
            estado: 'activa',
            fecha_hora: new Date().toISOString(),
            resuelta_por: null
        }
    ]
};

function getCollection(name) {
    return demoData[name];
}

function nextId(collectionName, keyName) {
    const collection = getCollection(collectionName);

    if (!collection.length) {
        return 1;
    }

    return Math.max(...collection.map((item) => Number(item[keyName] || 0))) + 1;
}

function getRolNombre(idRol) {
    return demoData.roles.find((rol) => rol.id_rol === idRol)?.nombre || 'desconocido';
}

async function getConnectionStatus() {
    return testConnection();
}

module.exports = {
    DB_ENABLED,
    demoData,
    getCollection,
    nextId,
    getRolNombre,
    getConnectionStatus
};
