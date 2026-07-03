//Estas son las APIS de donde se van a sacar los personajes y sus datos
const API_URL = "https://thesimpsonsapi.com/api/characters";
const CDN_URL = "https://cdn.thesimpsonsapi.com/500";
//Estas son las referencias al DOM(html)
const contenedor = document.getElementById("cartaPj");
const mensaje = document.getElementById("mensajeEstado");
const inputBuscar = document.getElementById("buscarPj");
//Variable donde se van almacenar los personajes para no volver a consultar a la API
let personajes = [];

//En esta función se traen los personajes de la API y se almacenan en "personajes".

async function obtenerPersonajes() {
    try {
       
//Acá con el fetch hacemos la peticion a la API para obtener sus datos en bruto y los almacenamos en la constante
        const respuesta = await fetch(API_URL);
 //En esta parte al hacer el "respuesta.json()" lo que hacemos es pasar los datos en bruto de la anterior linea a un objeto manipulable, (estaría haciendo de esos datos un arreglo con informacion limpia)
        const datos = await respuesta.json();
        
 //Acá se le asigna los datos limpios a la variable personajes
        personajes = datos.results;
 //En esta parte se cargan los personajes y se captura con catch un error si es que la anterior consulta a la API falla
        mostrarPersonajes(personajes)
    }catch (error){
        console.log(error);
        mensaje.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los personajes</div>`;
    }
}
// Se utiliza el try/catch para poder controlar que pasa en caso de que ocurra un error

//Esta función recibe el parametro de lista porque la voy a usar en dos situaciones una es esta, y la otra es para mostrar solo los que coincidan con la busqueda
function mostrarPersonajes(lista){
    //Esto limpia el contenido del contenedor para que al cargar nuevos personajes o buscar no se repitan
    contenedor.innerHTML = "";
    // Esto dice que si la lista de personajes está vacía, detiene la ejecución del código y muestra un mensaje de alerta
    if(lista.length === 0) {
        mensaje.innerHTML = `<div class="alert alert-warning">No se encontraron personajes</div>`;
    //Con esto termina y sale de la función
        return;
    }

    mensaje.innerHTML = "";
    //En esta parte al forEach le decimos"por cada personaje hace esto"
    lista.forEach((personaje) => {
    //Esto es para las imagenes donde accedemos a la propiedad portrait_path de cada objeto que nos da una ruta relativa para saber la imagen del personaje
        const imagen = CDN_URL + personaje.portrait_path;
    //Acá se usa el "+=" porque usar solo el "=" replazaría todo el contenido por cada vuelta del forEach dejando solo la ultima card, usando el "+=" significa "tomá lo que ya hay, y agregá esto al final" asi por vuelta va a ir agregando cada una de las tarjetas
        contenedor.innerHTML += `
         <div class="col-md-3">
        <div class="card h-100">
          <img src="${imagen}" class="card-img-top" alt="${personaje.name}">
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">Ocupación: ${personaje.occupation}</p>
            <p class="card-text">Estado: ${personaje.status}</p>
            <button class="btn btn-primary btn-detalle" data-id="${personaje.id}">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
        `;
    });
}
//Acá hacemos el buscador de los personajes con la función filtrarPersonajes
function filtrarPersonajes () {
//Declaramos esta constante de texto que es el nombre que ingresa el usuario en el buscador donde tomamos el valor del inputBuscar y con el .trim decimos que borre todos los espacios vacios y con el toLowerCase forzamos que el texto sea en minuscula así no existen diferencias entre mayúsculas y minusculas.
    const texto = inputBuscar.value.trim().toLowerCase();
//Esto dice que "Si texto es estrictamente igual a vacio entonces se devuelve el valor de la función mostrarPersonajes" (osea que se no se va a mostrar ningun cambio, solo se van a ver los personajes tal como están)
    if (texto === "") {
        mostrarPersonajes(personajes);
        return;
    }
//Acá declaramos una constante con valor personajes.filter que es literalmente "dame un nuevo arreglo con los elementos que cumplen esta condición"
    const filtrados = personajes.filter((personaje) => 
//Esta sería la condición para que el personaje pase el filtro, el ".includes(texto)" revisa que el texto que se escribió esta dentro de personaje.name en caso de que esté va a dar verdadero y va a llamar a la función que va a mostrar el personaje que se está buscando, caso contrario no mostrará una alerta que dice "no se encontraron personajes"
        personaje.name.toLowerCase().includes(texto)
    );
    mostrarPersonajes(filtrados);
}