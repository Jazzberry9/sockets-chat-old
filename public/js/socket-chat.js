var socket = io();

const params = new URLSearchParams(window.location.search);

if (!params.has('nombre' || !params.has('sala'))) {
    window.location = 'index.html'
    throw new Error('El nombre o la sala son necesarios!')
}

const user = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
}

socket.on('connect', function () {
    console.log('Conectado al servidor');

    // si se conecta, callback function y decir que hacer ( resp es del server)
    socket.emit('usuarioConectado', user, function (resp) {
        // console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp)
    })
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

socket.on('mensajePrivado', function (privateDm) {
    console.log('Private message:', privateDm);
})

// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function (resp) {
//     console.log('respuesta server: ', resp);
// });

socket.on('crearMensaje', function (message) {
    renderizarMensajes(message, false)
    scrollBottom()
});
socket.on('user-connected', function (connected) {
    console.log(connected);
    renderizarMensajes(connected, false)
});
socket.on('listOfUsers', function (people) {
    renderizarUsuarios(people)
});