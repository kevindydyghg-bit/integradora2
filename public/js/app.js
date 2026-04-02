document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. LÓGICA DE LA PANTALLA DE LOGIN (index.html)
    // =========================================================
    const pantallaBienvenida = document.getElementById('pantalla-bienvenida');
    const pantallaLogin = document.getElementById('pantalla-login');
    const btnMostrarLogin = document.getElementById('btn-mostrar-login');
    const btnVolver = document.getElementById('btn-volver');
    const formularioLogin = document.getElementById('formulario-login');

    // Comprobamos si estamos en la pantalla de login antes de ejecutar esto
    if (btnMostrarLogin && btnVolver && formularioLogin) {
        
        // Transición a Formulario
        btnMostrarLogin.addEventListener('click', () => {
            pantallaBienvenida.classList.remove('tarjeta-activa');
            pantallaBienvenida.classList.add('tarjeta-oculta');
            pantallaLogin.classList.remove('tarjeta-oculta');
            pantallaLogin.classList.add('tarjeta-activa');
        });

        // Transición de regreso a Bienvenida
        btnVolver.addEventListener('click', () => {
            pantallaLogin.classList.remove('tarjeta-activa');
            pantallaLogin.classList.add('tarjeta-oculta');
            pantallaBienvenida.classList.remove('tarjeta-oculta');
            pantallaBienvenida.classList.add('tarjeta-activa');
            formularioLogin.reset();
        });

        // Simulación de validación de DB (Se cambiará por fetch a Node después)
        formularioLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nombreIngresado = document.getElementById('nombreUsuario').value.trim();
            const passwordIngresado = document.getElementById('passwordUsuario').value.trim();

            const usuariosDB = [
                { nombre: 'Juan Alvarez', contrasena: 'profe123', id_rol: 1 },
                { nombre: 'Kevin Moreno', contrasena: 'alumno123', id_rol: 2 },
                { nombre: 'Leo Martinez', contrasena: 'alumno456', id_rol: 2 }
            ];

            const usuarioEncontrado = usuariosDB.find(
                (user) => user.nombre.toLowerCase() === nombreIngresado.toLowerCase() && user.contrasena === passwordIngresado
            );

            if (usuarioEncontrado) {
                if (usuarioEncontrado.id_rol === 1) {
                    window.location.href = '../app/views/docente/dashboard.html';
                } else if (usuarioEncontrado.id_rol === 2) {
                    window.location.href = '../app/views/alumno/app_alumno.html';
                }
            } else {
                alert('Tus datos no coinciden. Por favor, revisa tu nombre y contraseña e intenta de nuevo.');
            }
        });
    }

    // =========================================================
    // 2. LÓGICA DEL DASHBOARD DOCENTE (dashboard.html)
    // =========================================================
    const contenedorGrid = document.querySelector('.grid-alumnos');
    
    // Si existe el contenedor del grid (estamos en el dashboard del profe)
    if (contenedorGrid) {
        cargarAlumnosDesdeBD(contenedorGrid);
    }
});

// Función que consulta a Node.js e inyecta las tarjetas
async function cargarAlumnosDesdeBD(contenedor) {
    try {
        // Pedimos los datos al servidor Node.js
        const respuesta = await fetch('http://localhost:3000/api/alumnos');
        const alumnos = await respuesta.json();
        
        // Vaciamos el contenedor por si había código HTML viejo
        contenedor.innerHTML = ''; 

        // Recorremos la lista de alumnos traída de la Base de Datos
        alumnos.forEach(alumno => {
            // Sacamos las iniciales (Ej: Kevin Moreno = KM)
            const iniciales = alumno.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            // Plantilla de la tarjeta tipo Google Classroom
            const htmlTarjeta = `
                <a href="detalle_alumno.html?id=${alumno.id_usuario}" style="text-decoration: none; color: inherit; display: block;">
                    <div class="alumno-card" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 15px -3px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
                        
                        <div class="card-header">
                            <div class="avatar">${iniciales}</div>
                            <div class="info">
                                <h3>${alumno.nombre}</h3>
                                <p>Módulo: <span class="status-on">Conectado</span></p>
                            </div>
                        </div>
                        
                        <div class="card-body">
                            <div class="progress-section">
                                <div class="progress-text">
                                    <span>Tareas Completadas</span>
                                    <strong>0/5</strong>
                                </div>
                                <div class="progress-bar-bg">
                                    <div class="progress-bar-fill" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </a>
            `;
            // Añadimos la tarjeta al grid visual
            contenedor.innerHTML += htmlTarjeta;
        });
    } catch (error) {
        console.error("Error al cargar los alumnos:", error);
        contenedor.innerHTML = '<p style="text-align:center; color:red; padding:20px;">No se pudo conectar con el servidor. Verifica que Node.js esté corriendo.</p>';
    }
}