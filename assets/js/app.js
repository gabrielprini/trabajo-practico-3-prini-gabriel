//Estas son las APIS de donde se van a sacar los personajes y sus datos
const API_URL = "https://thesimpsonsapi.com/api/characters";
const CDN_URL = "https://cdn.thesimpsonsapi.com/500";

//Estas son las referencias al DOM(html)
const contenedor = document.getElementById("cartaPj");
const mensaje = document.getElementById("mensajeEstado");
const inputBuscar = document.getElementById("buscarPj");

const formBuscar = document.getElementById("formBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");

//Variable donde se van almacenar los personajes para no volver a consultar a la API
let personajes = [];

//En esta función se traen los personajes de la API y se almacenan en "personajes".
async function obtenerPersonajes() {
  try {
    //Acá con el fetch hacemos la petición a la API para obtener sus datos
    const respuesta = await fetch(API_URL);

    //Convertimos la respuesta en un objeto manipulable
    const datos = await respuesta.json();

    //Guardamos los personajes
    personajes = datos.results;

    //Mostramos los personajes
    mostrarPersonajes(personajes);
  } catch (error) {
    console.log(error);
    mensaje.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los personajes</div>`;
  }
}

// Se utiliza el try/catch para poder controlar que pasa en caso de que ocurra un error

//Esta función recibe el parámetro lista porque la voy a usar tanto para mostrar todos como para mostrar los filtrados.
function mostrarPersonajes(lista) {
  //Limpiamos el contenedor para que no se repitan las cards
  contenedor.innerHTML = "";

  //Si no hay personajes mostramos un mensaje
  if (lista.length === 0) {
    mensaje.innerHTML = `<div class="alert alert-warning">No se encontraron personajes</div>`;
    return;
  }

  mensaje.innerHTML = "";

  //Recorremos todos los personajes
  lista.forEach((personaje) => {
    const imagen = CDN_URL + personaje.portrait_path;

    contenedor.innerHTML += `
      <div class="col-md-3">
        <div class="card h-100">
          <img src="${imagen}" class="card-img-top" alt="${personaje.name}">

          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>

            <p class="card-text">
              <strong>Ocupación:</strong> ${personaje.occupation}
            </p>

            <p class="card-text">
              <strong>Estado:</strong> ${personaje.status}
            </p>

            <button
              class="btn btn-warning btn-detalle"
              data-id="${personaje.id}">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

//Acá hacemos el buscador de los personajes con la función filtrarPersonajes
function filtrarPersonajes() {
  //Declaramos esta constante de texto que es el nombre que ingresa el usuario en el buscador
  const texto = inputBuscar.value.trim().toLowerCase();

  //Si el buscador está vacío mostramos todos los personajes
  if (texto === "") {
    mostrarPersonajes(personajes);
    return;
  }

  //Filtramos por nombre
  const filtrados = personajes.filter((personaje) =>
    personaje.name.toLowerCase().includes(texto)
  );

  mostrarPersonajes(filtrados);
}

//Obtiene el detalle de un personaje según su id
async function obtenerDetalle(id) {
  try {
    //Pedimos el personaje por id
    const respuesta = await fetch(`${API_URL}/${id}`);

    //Convertimos la respuesta en un objeto
    const personaje = await respuesta.json();

    //Mostramos el modal
    mostrarModal(personaje);

  } catch (error) {
    console.log(error);
    alert("No se pudo cargar el detalle del personaje");
  }
}

//Muestra el detalle dentro del modal
function mostrarModal(personaje) {

  document.getElementById("modalNombre").textContent = personaje.name;

  document.getElementById("modalImagen").src =
    CDN_URL + personaje.portrait_path;

  document.getElementById("modalEdad").textContent =
    personaje.age ?? "Desconocida";

  document.getElementById("modalNacimiento").textContent =
    personaje.birthdate ?? "Desconocida";

  document.getElementById("modalGenero").textContent =
    personaje.gender ?? "Desconocido";

  document.getElementById("modalOcupacion").textContent =
    personaje.occupation;

  document.getElementById("modalEstado").textContent =
    personaje.status;

  document.getElementById("modalFrase").textContent =
    personaje.phrases[0] ?? "Sin frases";

  const modal = new bootstrap.Modal(
    document.getElementById("modalDetalle")
  );

  modal.show();
}

//Cuando termina de cargar el HTML obtenemos los personajes
document.addEventListener("DOMContentLoaded", obtenerPersonajes);

//Buscador en tiempo real
inputBuscar.addEventListener("input", filtrarPersonajes);

//Delegación de eventos para el botón "Ver detalle"
contenedor.addEventListener("click", (event) => {

  if (event.target.classList.contains("btn-detalle")) {

    const id = event.target.dataset.id;

    obtenerDetalle(id);

  }

});

//Al enviar el formulario se limpia la búsqueda
formBuscar.addEventListener("submit", (event) => {

  event.preventDefault();

  inputBuscar.value = "";

  mostrarPersonajes(personajes);

});

//Botón limpiar
if (btnLimpiar) {

  btnLimpiar.addEventListener("click", () => {

    inputBuscar.value = "";

    mostrarPersonajes(personajes);

  });

}