const notParamsButParams = new URLSearchParams(window.location.search);

const nombre = notParamsButParams.get('nombre')
const sala = notParamsButParams.get('sala')


const divUsuario = document.querySelector('#divUsuarios')
const formEnviar = document.querySelector('#formEnviar')
const txtMensaje = document.querySelector('#txtMensaje')
const divChatbox = document.querySelector('#divChatbox')

// funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    // console.log(personas);
    let html = '';
    html +=
        `<li>
            <a href="javascript:void(0)" class="active"> Chat de <span>${sala}</span></a>
        </li>`;
    divUsuario.innerHTML = html;

    personas.forEach(users => {
        const { nombre, id } = users;
        divUsuario.innerHTML += `
        <li class="user-connected">
            <a data-id="${id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" data-id="${id}" alt="user-img" class="img-circle"><span data-id="${id}">${nombre}<small data-id="${id}" class="text-success">online</small></span></a>
        </li>
        `
    })
}
// renderizar mensajes
function renderizarMensajes(mensaje, myself) {

    const currentDate = new Date().toLocaleString('en', { timeZone: 'America/New_York' }).slice(11, 22);
    // const currentDate = mensaje.fecha.slice(11, 16);

    let adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (myself) {
        divChatbox.innerHTML +=
            `<li class="reverse">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />
            </div>
            <div class="chat-time">${currentDate}</div>
        </li>
    `
    } else {
        divChatbox.innerHTML +=
            `<li>
            ${mensaje.nombre !== 'Administrador' ? `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"/>
            </div>` : ''}
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                </div>
                <div class="chat-time">${currentDate}</div>
            </li>`
    }
}

// fix scroll
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// listeners
divUsuario.addEventListener('click', e => {
    const dataId = e.target.dataset.id;
    if (!dataId) {
        throw new Error('Select an user')
    }
})

formEnviar.addEventListener('submit', (e) => {
    e.preventDefault();
    if (txtMensaje.value.trim().length === 0) {
        return
    }

    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje: txtMensaje.value,
    }, function (tool) {
        txtMensaje.value = '';
        renderizarMensajes(tool, true)
        scrollBottom()
    });
})