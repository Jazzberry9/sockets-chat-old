

class Usuario {
    constructor() {
        this.personas = [];
    }
    // toma un id y nombre del socket
    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala }
        this.personas.push(persona);
        return persona;
    }

    getPersona(id) {
        let persona = this.personas.find(user => user.id === id);
        return persona;
    }

    getAllPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        const personas = this.personas.filter(ppl => ppl.sala === sala)
        return personas;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id !== id)
        return personaBorrada;
    }
}

module.exports = {
    Usuario
}