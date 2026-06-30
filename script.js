// 1. ARREGLO DE OBJETOS (criterio 2.1.3)
const experiencias = [
  { id: 1, nombre: "Capillas de Mármol", categoria: "Navegación", lugar: "Puerto Río Tranquilo",
    precio: 35000, cuposDisponibles: 8, descripcion: "Navegación en bote por las formaciones de mármol del Lago General Carrera.", icono: "⛵" },
  { id: 2, nombre: "Cerro Castillo", categoria: "Trekking", lugar: "Villa Cerro Castillo",
    precio: 60000, cuposDisponibles: 6, descripcion: "Trekking de un día por el sendero base del Cerro Castillo.", icono: "🥾" },
  { id: 3, nombre: "Pesca con Mosca", categoria: "Pesca", lugar: "Río Simpson",
    precio: 50000, cuposDisponibles: 5, descripcion: "Jornada de pesca con mosca guiada en el Río Simpson.", icono: "🎣" },
  { id: 4, nombre: "Patrimonio Cultural", categoria: "Cultura", lugar: "Cochrane",
    precio: 25000, cuposDisponibles: 10, descripcion: "Recorrido por el patrimonio histórico y cultural de Cochrane.", icono: "📷" },
  { id: 5, nombre: "Kayak en Fiordos", categoria: "Navegación", lugar: "Caleta Tortel",
    precio: 55000, cuposDisponibles: 7, descripcion: "Travesía en kayak por los fiordos de Caleta Tortel.", icono: "🛶" },
  { id: 6, nombre: "Avistamiento de Fauna", categoria: "Navegación", lugar: "Laguna San Rafael",
    precio: 65000, cuposDisponibles: 4, descripcion: "Navegación de avistamiento de fauna en la Laguna San Rafael.", icono: "🐧" }
];

// 2. RENDER DINÁMICO AL DOM (criterio 2.1.1)
function renderExperiencias(lista) {
  const contenedor = document.getElementById("experiencias");
  contenedor.textContent = ""; // limpiamos antes de volver a dibujar

  lista.forEach(exp => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    const titulo = document.createElement("h3");
    titulo.textContent = exp.icono + " " + exp.nombre;

    const lugar = document.createElement("p");
    lugar.textContent = "📍 " + exp.lugar;

    const categoria = document.createElement("p");
    categoria.textContent = "Categoría: " + exp.categoria;

    const precio = document.createElement("p");
    precio.textContent = "$" + exp.precio;

    const cupos = document.createElement("p");
    cupos.textContent = "Cupos: " + exp.cuposDisponibles;

    const descripcion = document.createElement("p");
    descripcion.textContent = exp.descripcion;
    descripcion.classList.add("descripcion", "oculto");

    const botonVerMas = document.createElement("button");
    botonVerMas.textContent = "Ver más";
    botonVerMas.addEventListener("click", () => {
      descripcion.classList.toggle("oculto");
      botonVerMas.textContent = descripcion.classList.contains("oculto") ? "Ver más" : "Ver menos";
    });

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(lugar);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(cupos);
    tarjeta.appendChild(botonVerMas);
    tarjeta.appendChild(descripcion);

    contenedor.appendChild(tarjeta);
  });
}

// 3. FILTROS POR CATEGORÍA (Semana 5)
function filtrarPorCategoria(categoria) {
  if (categoria === "Todos") {
    renderExperiencias(experiencias);
  } else {
    const filtradas = experiencias.filter(exp => exp.categoria === categoria);
    renderExperiencias(filtradas);
  }
}

const botonesFiltro = document.querySelectorAll(".filtro");
botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
    filtrarPorCategoria(boton.dataset.categoria);
  });
});

// 4. POBLAR EL SELECT DEL FORMULARIO DESDE EL ARREGLO
function poblarSelectExperiencias() {
  const select = document.getElementById("experiencia");
  experiencias.forEach(exp => {
    const opcion = document.createElement("option");
    opcion.value = exp.id;
    opcion.textContent = exp.nombre;
    select.appendChild(opcion);
  });
}

// 5. FUNCIONES DE APOYO PARA ERRORES
function mostrarError(idSpan, mensaje) {
  document.getElementById(idSpan).textContent = mensaje;
}

function limpiarErrores() {
  document.querySelectorAll(".error").forEach(span => span.textContent = "");
}

function descontarCupo(id, personas) {
  const exp = experiencias.find(e => e.id === id);
  exp.cuposDisponibles -= personas;
}

// 6. VALIDACIÓN DEL FORMULARIO (criterio 2.1.2)
function validarFormulario(event) {
  event.preventDefault();
  limpiarErrores();

  let valido = true;

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const experienciaId = document.getElementById("experiencia").value;
  const personas = parseInt(document.getElementById("personas").value);
  const fecha = document.getElementById("fecha").value;

  if (nombre === "") {
    mostrarError("errorNombre", "El nombre es obligatorio");
    valido = false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    mostrarError("errorEmail", "El email es obligatorio");
    valido = false;
  } else if (!regexEmail.test(email)) {
    mostrarError("errorEmail", "El email no tiene un formato válido");
    valido = false;
  }

  if (experienciaId === "") {
    mostrarError("errorExperiencia", "Selecciona una experiencia");
    valido = false;
  }

  if (!personas || personas < 1) {
    mostrarError("errorPersonas", "Indica un número de personas válido");
    valido = false;
  }

  if (fecha === "") {
    mostrarError("errorFecha", "La fecha es obligatoria");
    valido = false;
  }

  // Validar que no se pasen del cupo disponible
  if (experienciaId !== "" && personas) {
    const exp = experiencias.find(e => e.id === parseInt(experienciaId));
    if (exp && personas > exp.cuposDisponibles) {
      mostrarError("errorPersonas", "No hay suficientes cupos disponibles (quedan " + exp.cuposDisponibles + ")");
      valido = false;
    }
  }

  if (valido) {
    const exp = experiencias.find(e => e.id === parseInt(experienciaId));
    descontarCupo(exp.id, personas);
    document.getElementById("mensajeExito").textContent = "¡Reserva confirmada para " + nombre + "!";
    document.getElementById("formReserva").reset();
    renderExperiencias(experiencias); // refrescamos cupos en las tarjetas
  } else {
    document.getElementById("mensajeExito").textContent = "";
  }
}

document.getElementById("formReserva").addEventListener("submit", validarFormulario);

// 7. INICIALIZACIÓN: lo primero que corre al cargar la página
renderExperiencias(experiencias);
poblarSelectExperiencias();
