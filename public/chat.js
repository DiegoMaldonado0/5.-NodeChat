// Make Connection
var socket = io.connect(window.location.origin);

// Query DOM

var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');


// Emit Events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });

    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
});


// Paleta de colores predefinida
const colors = ['#F9B3C1', '#A3C1DA', '#070059', '#FFFFFF', '#F9E79F', '#710061'];

// Función para asignar un color basado en el nombre del usuario
function getColorFromName(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Devuelve un color de la lista basado en el hash del nombre
    return colors[Math.abs(hash) % colors.length];
}


// Listen for Events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    const userColor = getColorFromName(data.handle); //Define el color del usuario
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); //Para tomar la hora actual
    
    const isUserMessage = data.handle === handle.value; //Para saber si el mensaje es del usuario actual
    
    output.innerHTML += `
        <p class="${isUserMessage ? 'user-message' : 'other-message'}">
            <strong style="color: ${userColor};">${data.handle}</strong>: ${data.message}
            <span class="timestamp">${timestamp}</span>
        </p>
    `;
})

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
