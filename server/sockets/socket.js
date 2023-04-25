const { Usuario } = require('../classes/usuario');
const { io } = require('../server');
const { createMessage } = require('../helpers/utilidades')

const user = new Usuario()
io.on('connection', (client) => {

    client.on('usuarioConectado', (payloadUser, cb) => {
        const { nombre, sala } = payloadUser;
        if (!nombre || !sala) {
            return cb({
                error: true,
                log: 'el nombre/sala son necesarios'
            })
        }
        client.join(sala)
        let persons = user.agregarPersona(client.id, nombre, sala)
        client.broadcast.to(sala).emit('listOfUsers', user.getPersonasPorSala(sala))
        client.broadcast.to(sala).emit('user-connected', createMessage('Administrador', `${persons.nombre} se unio al chat.`))
        cb(user.getPersonasPorSala(sala))
    })

    client.on('crearMensaje', (payload, callback) => {
        const { mensaje } = payload;
        const person = user.getPersona(client.id)
        const message = createMessage(person.nombre, mensaje)
        client.broadcast.to(person.sala).emit('crearMensaje', message)

        callback(message)
    })

    // mensajes privados
    client.on('mensajePrivado', payload => {
        const person = user.getPersona(client.id)
        client.broadcast.to(payload.for).emit('mensajePrivado', createMessage(person.nombre, payload.mensaje))
    })

    client.on('disconnect', () => {
        const usuarioBorrado = user.borrarPersona(client.id);
        client.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', createMessage('Administrador', `${usuarioBorrado.nombre} abandono el chat.`))
        client.broadcast.to(usuarioBorrado.sala).emit('listOfUsers', user.getPersonasPorSala(usuarioBorrado.sala))
    })
});