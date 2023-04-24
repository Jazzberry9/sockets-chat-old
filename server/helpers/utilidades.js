const createMessage = (nombre, mensaje) => {
    return {
        nombre,
        mensaje,
        fecha: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
}

module.exports = {
    createMessage
}