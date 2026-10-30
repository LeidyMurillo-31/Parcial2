// Variables globales para almacenar datos de la gráfica
let peliculasVendidas = [];
let recaudacionAcumulada = [];
let grafica = null;

// Inicializar la cámara web al cargar el script
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        document.getElementById('camara').srcObject = stream;
    })
    .catch(function(error) {
        console.error("Error al acceder a la cámara:", error);
    });

// Lógica de Login (Paso 3)
function iniciarSesion() {
    let usuario = document.getElementById('usuario').value;
    let clave = document.getElementById('clave').value;

    if (usuario === 'Cinecali' && clave === 'Estrenos') {
        document.getElementById('panelLogin').classList.add('oculto');
        document.getElementById('panelTaquilla').classList.remove('oculto');
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Cálculo aritmético y efecto reloj (Paso 4)
function procesarVenta() {
    let pelicula = document.getElementById('pelicula').value;
    let sala = document.getElementById('sala').value;
    let boletas = parseInt(document.getElementById('boletas').value);
    let cambioAsiento = document.getElementById('cambioAsiento').checked;
    let horaCambio = document.getElementById('horaCambio').value;

    // Validación básica de campos
    if (pelicula === '' || sala === '' || isNaN(boletas) || boletas <= 0) {
        alert('Complete los datos correctamente. Las boletas deben ser mayor a 0.');
        return;
    }

    // Cálculo base de 12,000 por boleta
    let total = boletas * 12000;

    // Recargo del 5% condicionado
    if (cambioAsiento && horaCambio >= "15:00" && horaCambio <= "18:00") {
        total = total + (total * 0.05);
    }

    // Efecto reloj con setTimeout
    document.getElementById('resultado').innerText = "Calculando...";
    
    setTimeout(function() {
        document.getElementById('resultado').innerText = "Recaudación: $" + total;
        actualizarGrafica(pelicula, total);
        validarSeguridad();
    }, 2000);
}

// Validación de seguridad continua (Paso 5)
function validarSeguridad() {
    // Retrasamos el prompt mínimamente para que alcance a renderizar el resultado en pantalla
    setTimeout(function() {
        let palabraClave = prompt("Ingrese la clave de seguridad para registrar nueva función:");
        
        if (palabraClave === 'CINE') {
            document.getElementById('pelicula').value = '';
            document.getElementById('sala').value = '';
            document.getElementById('boletas').value = '';
            document.getElementById('cambioAsiento').checked = false;
            document.getElementById('horaCambio').value = '';
        } else {
            alert("Clave incorrecta. Expulsando del sistema.");
            
            // Limpieza general y retorno al login
            document.getElementById('usuario').value = '';
            document.getElementById('clave').value = '';
            document.getElementById('pelicula').value = '';
            document.getElementById('sala').value = '';
            document.getElementById('boletas').value = '';
            document.getElementById('resultado').innerText = "Recaudación: $0";
            
            document.getElementById('panelTaquilla').classList.add('oculto');
            document.getElementById('panelLogin').classList.remove('oculto');
        }
    }, 100);
}

// Dibujo dinámico de gráfica de líneas (Paso 6)
function actualizarGrafica(pelicula, total) {
    peliculasVendidas.push(pelicula);
    recaudacionAcumulada.push(total);

    let lienzo = document.getElementById('graficaVentas');

    if (grafica !== null) {
        grafica.destroy();
    }

    grafica = new Chart(lienzo, {
        type: 'line',
        data: {
            labels: peliculasVendidas,
            datasets: [{
                label: 'Recaudación ($)',
                data: recaudacionAcumulada,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true
        }
    });
}