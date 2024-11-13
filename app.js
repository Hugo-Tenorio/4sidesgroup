new Vue({
    el: '#app',
    data: {
        users: [],
        error: null,
        columns: [
            { name: "Nombre", key: "usuarioNombre", visible: true },
            { name: "Apellido Paterno", key: "usuarioApellidoPaterno", visible: true },
            { name: "Apellido Materno", key: "usuarioApellidoMaterno", visible: true },
            { name: "Email", key: "usuarioEmail", visible: true },
            { name: "Teléfono", key: "usuarioTelefono", visible: true },
            { name: "Acciones", key: "acciones", visible: true }
        ]
    },
    methods: {
        fetchUsers() {
            axios.get('https://www.4sides.com.mx/api/prueba-tecnica/usuarios/index?results=50')
                .then(response => {
                    if (response.data.success && response.data.usuarios) {
                        this.users = response.data.usuarios;
                        this.$nextTick(() => {
                            $('#usuariosTable').DataTable({
                                pageLength: 10,
                                destroy: true,
                                language: {
                                    lengthMenu: "Mostrar _MENU_ registros por página",
                                    zeroRecords: "No se encontraron resultados",
                                    info: "Mostrando página _PAGE_ de _PAGES_",
                                    infoEmpty: "No hay registros disponibles",
                                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                                    search: "Buscar:",
                                    paginate: {
                                        previous: "Anterior",
                                        next: "Siguiente"
                                    }
                                }
                            });
                        });
                    } else {
                        this.error = 'No se encontraron usuarios en la respuesta de la API';
                    }
                })
                .catch(error => {
                    this.error = 'Error al cargar los usuarios';
                    console.error(error);
                });
        },
        toggleColumnVisibility(column) {
            column.visible = !column.visible;
        },
        deleteUser(user) {
            // Elimina el usuario de la lista
            this.users = this.users.filter(u => u !== user);
            alert(`Usuario ${user.usuarioNombre} eliminado.`);
        },
        capturePhoto(user) {
            // Pedir permiso para usar la cámara y capturar una foto
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        const video = document.createElement('video');
                        video.srcObject = stream;
                        video.play();

                        // Crear un botón para capturar la imagen
                        const captureButton = document.createElement('button');
                        captureButton.textContent = 'Capturar Foto';
                        captureButton.classList.add('btn', 'btn-success');
                        
                        document.body.append(video, captureButton);

                        captureButton.addEventListener('click', () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0);

                            // Guardar la imagen en base64 (puedes guardarla o mostrarla)
                            const imageData = canvas.toDataURL('image/png');
                            console.log(`Foto capturada para ${user.usuarioNombre}:`, imageData);

                            // Detener el video y limpiar elementos
                            stream.getTracks().forEach(track => track.stop());
                            video.remove();
                            captureButton.remove();
                            alert(`Foto capturada para ${user.usuarioNombre}.`);
                        });
                    })
                    .catch(error => {
                        console.error('Error al acceder a la cámara:', error);
                        alert('No se pudo acceder a la cámara.');
                    });
            } else {
                alert('La cámara no es compatible en este dispositivo.');
            }
        }
    },
    mounted() {
        this.fetchUsers();
    }
});


//////////////////////////////////Código para modo claro u oscuro

document.addEventListener('DOMContentLoaded', function() {
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    const usuariosTable = document.getElementById('usuariosTable');
    const darkModeIcon = document.getElementById('darkModeIcon');

    // Cargar preferencia del modo desde localStorage
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        usuariosTable.classList.add('table-dark');
        darkModeIcon.classList.replace('fa-moon', 'fa-sun'); // Cambiar a icono de sol
    }

    // Alternar modo oscuro/claro al hacer clic en el botón
    toggleDarkModeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        usuariosTable.classList.toggle('table-dark');
        
        // Alternar icono según el modo
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'true');
            darkModeIcon.classList.replace('fa-moon', 'fa-sun'); // Cambiar a icono de sol
        } else {
            localStorage.setItem('dark-mode', 'false');
            darkModeIcon.classList.replace('fa-sun', 'fa-moon'); // Cambiar a icono de luna
        }
    });
});