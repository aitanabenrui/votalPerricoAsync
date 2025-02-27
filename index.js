const perricosArray = []; // Este array contendrá los objetos con {image: 'url', breed: 'raza'}
console.log(perricosArray);
const select = document.querySelector("#breeds-picker"); //selecciona el desplegable donde elegir las razas
let selectedBreed = ''; //aquí guardaremos la raza seleccionada en el select
let filteredPerricos; //array de objetos con los perros de la raza que se quiere filtrar
let breedCounters = {}; // objeto que guardará los contadores de cada raza de perros
let activeFilters = []; //array que almacna múltipls razas seleccionadas para poder filtrarlas luego
console.log(activeFilters);

const timeoutId = setTimeout(() => {
  document.querySelector('#add-warning').style.display = '';
}, 3000);

const breedsPicker = document.querySelector("#breeds-picker");
let breedNamesArray = [];

//addEventListener para detectar el CAMBIO DE RAZA y actualizar la raza selccionada
breedsPicker.addEventListener('change', (event)=>{ //función anónima que se ejecuta cuando el valor de un elemento del selct cambia.
  selectedBreed = event.target.value; //event.target se refiere al elemento que disparó el evento y value es el valor del elemento targeteado
  console.log('Filtrando por raza: ', selectedBreed) //vemos si se actualiza
}) //una vez cambiada la raza usaremos esta variable para pasarsela a getRandomDogImage

window.onload = async()=>{
  const dogBreeds = await getDogBreeds(); //esto es el objeto de razas de perros

for (let breed in dogBreeds){
    if(dogBreeds[breed].length === 0){
      breedNamesArray.push(breed);
      let option = document.createElement("option");
      option.value = breed;
      option.textContent = breed;
      select.appendChild(option); //appendChild coloca los nuevos elementos al final del elemento padre
    } else {
      let optgroup = document.createElement("optgroup"); //crae el contenedor optgroup con label breed y valu breed
      optgroup.label = breed; //aparecrá el nombre de la raza principal en la ventana desplegable
      optgroup.value = breed; //lo mismo para el atributo value

      //dentro del forEach metermos cada option que tenga la raza en concreto
      dogBreeds[breed].forEach((breedSurname)=>{

        const breedFullName = `${breedSurname}--${breed}`;
        breedNamesArray.push(`${breedSurname} ${breed}`);
        let option = document.createElement("option"); //crea un elmento option con value breedFullName
        option.value = breedFullName;
        option.textContent = `${breedSurname} ${breed}`;
        optgroup.appendChild(option); //se añade la etiqueta option a optgroup
      });
      select.appendChild(optgroup); //una vez añadidas todas las subrazas al padre optgroup, este se añad al padre "select"
    }
}

console.log(breedNamesArray); 
};

// función para ocultar el mensaje de advertencia, borra el set time out si aún no ha aparecido el mensaje y si ya ha aparecido lo oculta
function clearWarningMessage() {
  clearTimeout(timeoutId);
  document.querySelector('#add-warning').style.display = 'none';
}

//función que gestiona likes y dislikes, añade a cada botón un evento: cuando se clicka se el suma 1 al contador
//add social listeners solo selecciona los botones que ya existen en el DOM cuando se ejecuta, necesitamos añadir las funcionalidads de like y dislike a addPerrico
function addSocialListeners() {
  document.querySelectorAll('.like').forEach((buttonNode) => { //selecciona todos los botones de like y los recorre
    buttonNode.addEventListener('click', function () { //añade un listener
      const hermanico = buttonNode.previousElementSibling; // = etiqueta <p> con los contadores
      const likeCountNode = hermanico.querySelector('.like-count') //busca el span con la clase .like-count;
      const perricoData = getPerricoDataFromNode(buttonNode);  // Función para obtener el objeto perricoData
      perricoData.likes += 1;  // Incrementa el contador de likes en el objeto dentro de perricosArray
      likeCountNode.innerText = perricoData.likes;  // Actualiza el contador en el DOM dentro de la etiqueta span
    });
  });

  document.querySelectorAll('.dislike').forEach((buttonNode) => {
    buttonNode.addEventListener('click', function () {
      console.log(buttonNode.closest('.card'));
      const likeCountNode = buttonNode.closest('.card').querySelector('.dislike-count');
      const perricoData = getPerricoDataFromNode(buttonNode);  // Función para obtener el objeto perricoData
      perricoData.dislikes += 1;  // Incrementa el contador de dislikes
      likeCountNode.innerText = perricoData.dislikes;  // Actualiza el contador en el DOM
    });
  });
};

// Función para obtener el objeto perricoData asociado con una tarjeta, encuentra el valor de like y dislike para actualizarlos
function getPerricoDataFromNode(buttonNode) { //recibe como parámetro el botón de like o dislike que el usuario ha presionado
  const card = buttonNode.closest('.card'); // Encuentra el elemento más cercano con la clase 'card'
  const image = card.querySelector('img').src;  // Obtiene la URL de la imagen del perro (que es única para cada perrico)
  return perricosArray.find(perrico => perrico.image === image);  // Busca el perricoData en el array perricosArray usando la imagen como clave
}

//función que renderiza el array de perritos, limpia la lista de perros antes de renderizarla y llama a addSocialListeners para habilitar los eventos
function renderPerricoArray() {
  const dogList = document.querySelector('#dog-list');
  dogList.innerHTML = '';

  perricosArray.forEach((perricoData) => { //como ahora es un objeto cambiamos dogImage por perricoData.image
    const htmlAdd = `<div class="card">
  <img src="${perricoData.image}" alt="Perro" />
  <br />
  <p><span class="like-count">${perricoData.likes}</span>❤️ <span class="dislike-count">${perricoData.dislikes}</span>🤮</p>
  <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>
</div>`;

    dogList.innerHTML += htmlAdd;
  });

  addSocialListeners();
};

//funciones que deshabilitan los botones hasta quee se carguen las cartas de perros
function disableAllAddPerricoButtons() { //deshabilita todos los botones de añadir perritos, esto es para que se deshabiliten hasta que se carguen todas las imágenes
  document.querySelectorAll('.add-button').forEach((buttonNode) => {
    buttonNode.disabled = true;
  });
}

function enableAllAddPerricoButtons() {
  document.querySelectorAll('.add-button').forEach((buttonNode) => {
    buttonNode.disabled = false;
  });
}


//función para filtrar los Perros según la raza: genera un nuevo array con la raza seleccionada y llama a renderFilterdPerricos pasándole el nuevo array
const filterByBreed = () =>{
  if (activeFilters.length === 0){ //si en el array de filtrado no hay razas, no hay filtros activados, muestra todos los perros
    renderPerricoArray(); //se renderizan todos los perros
    return;
  }
//filterdPerricos es una variable que almacena los objetos de las razas de perro a filtrar. En este caso obtendrá los perros cuya raza están en el array activeFilters
//filtra solo los perros que coinicdadn con alguna de las razas activas 
filteredPerricos = perricosArray.filter(perrico => activeFilters.includes(perrico.breed));
  renderFilteredPerricos(filteredPerricos);
};


//función que renderiza los perritos filtrados por raza
const renderFilteredPerricos = (filteredPerricos) =>{ // a esta función se le pasa
  const dogList = document.querySelector("#dog-list");
  dogList.innerHTML = ""; // Limpia la lista antes de renderizar

  filteredPerricos.forEach((perricoData) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${perricoData.image}" alt="Perro" />
      <br />
      <p>
        <span class="like-count">${perricoData.likes}</span>❤️ 
        <span class="dislike-count">${perricoData.dislikes}</span>🤮
      </p>
      <button class="like">Preciosísimo</button> 
      <button class="dislike">Feísisimo</button>`;

    dogList.appendChild(card);
  });

  addSocialListeners(); // Asegúrate de volver a añadir los listeners de like/dislike
};


 //función asíncrona que añade un perrito, obtioene un perrico al alzar con getRandomDogImage, añade al principio o al final y crea un div con la imágen y los botones

//todo el manejo de razas, contadores y botones de filtro se ejecuta cuando se agrega un perro.
// Esto mantiene el flujo del código más claro y organizado, y asegura que los elementos del DOM 
// (como los botones de raza y los contadores) se manejen correctamente en el momento exacto en que se agregan nuevos perros,
// evitando errores de sincronización.
const addPerrico = async (addToStart) => {
    // const breed = document.querySelector('[name=breeds]').value; //selecciona el valor del select
    let breed = selectedBreed; //raza de perro seleccionada
    
    // Si no hay raza seleccionada, obtenemos una imagen aleatoria y detectamos su raza
    const perricoImg = await getRandomDogImage(breed); //desde aquí llamamos a la función getRandomDogImage del archivo js api
//si selectedBreed está vacío ('') como dice en el archivo api.js, se pasará un link de foto de perro aleatorio
  if (!breed) {
    breed = extractBreedFromImage(perricoImg); // Detectar la raza desde la URL de la imagen y añadirla a la variable breed
  }

//creamos un objeto con la imágen y la raza
const perricoData = {
  image: perricoImg,
  breed: breed,
  likes: 0, //contador de likes
  dislikes: 0 //contador de dislikes
};

 // Aquí es donde insertamos el bloque que maneja el contador de razas
  if (!breedCounters[breed]) {
    breedCounters[breed] = 1; // Iniciar el contador en 1 para esta raza
    createBreedFilterButton(breed); // Crear el botón si no existe

  // Asegurarnos de que el botón se creó antes de actualizar el contador
  setTimeout(() => {
      updateBreedCounter(breed); // Actualiza el contador con el valor actual
  }, 50); // Le damos un pequeño margen de tiempo
  } else {
    breedCounters[breed]++; // Si la raza ya existe, incrementamos el contador
    updateBreedCounter(breed); // Actualizar el contador de la raza
}


 // Para añadir el objeto perro al array, al principio o al final dependiendo de addToStart
  if (addToStart) {
    perricosArray.unshift(perricoData);
  } else {
    perricosArray.push(perricoData);
  }


  const dogList = document.querySelector('#dog-list');

  const isAnyFilterSelected = document.querySelector('.filter-selected');

  const perricoCardElement = document.createElement('div');
  perricoCardElement.className = 'card';
  perricoCardElement.style.display = isAnyFilterSelected ? 'none' : '';

  perricoCardElement.innerHTML = `
  <img src="${perricoData.image}" alt="Perro" />
  <br />
  <p><span class="like-count">${perricoData.likes}</span>❤️ <span class="dislike-count">${perricoData.dislikes}</span>🤮</p>
  <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>`;

  if (addToStart) {
    dogList.prepend(perricoCardElement);
  } else {
    dogList.appendChild(perricoCardElement);
  }

  const likeButton = perricoCardElement.querySelector('.like');

  likeButton.addEventListener('click', function () {
    perricoData.likes++;
    const likeCountNode = perricoCardElement.querySelector('.like-count');
    likeCountNode.innerText = perricoData.likes;
  });

  const dislikeButton = perricoCardElement.querySelector('.dislike');
  dislikeButton.addEventListener('click', function () {
    perricoData.dislikes++;
    const likeCountNode = perricoCardElement.querySelector('.dislike-count');
    likeCountNode.innerText = perricoData.dislikes;
  });

  //llamamos a la función que actualiza el contado de la raza
  updateBreedCounter(breed);
};

//función que extrae la raza desde la url de la imágen para poder detectarla
const extractBreedFromImage = (imageUrl) => {
  const regex = /breeds\/([^\/]+)\//; // Extrae el nombre de la raza de la URL
  const match = imageUrl.match(regex);
  
  if (match && match[1]) {
      let breed = match[1].replace("-", "--"); // Formatear raza correctamente
      return breed;
  }
  return "Desconocida"; // Si no se puede extraer, devolver "Desconocida"
};


//función que se encarga de actualizar los contadores de razas de perritos, si la raza aún no tiene un botón, crealo, si ya lo tiene incrementa el contador
const updateBreedCounter = (breed) =>{
  const counterElement = document.querySelector(`#counter-${breed}`);
    if (counterElement) {
        counterElement.innerHTML = breedCounters[breed];
    } else {
        console.warn(`No se encontró el contador para la raza: ${breed}`);
    }
}

//función que crea el botón de la raza si no ha sido creada previamente
const createBreedFilterButton = (breed) => {
  const filterContainer = document.querySelector('.filters'); //selecciona el contenedor de los filstros, de inicio tiene ya los botones de like y dislike
  let button = document.querySelector(`#filter-${breed}`); // busca si ya existe el botón, si no existe dará null

  if(!button){ //si tiene valor falsy (null, 0, undefined, false, '', NaN)
    button = document.createElement('button');
    button.id = `filter-${breed}`;
    button.innerHTML = `${breed} (<span id="counter-${breed}">1</span>)`; 
    button.addEventListener('click', ()=> 
      toggleBreedFilter(breed, button)); //llama a la función toggleBreedFilter
    filterContainer.appendChild(button); //añade dentro del div el botón
    console.log(`Botón creado para: ${breed}`); //indica en consola si se ha creado el botón con la raza
  }
};



//función que filtra por razas, modifica el array activeFiltrs para saber cualse tiene que filtrar
const toggleBreedFilter = (breed, button) =>{
  if(activeFilters.includes(breed)){
    //si la raza ya está activa, la eliminamos del array 
    activeFilters = activeFilters.filter(activeBreed => activeBreed !== breed);
    button.classList.remove('active-filter'); //quita el estilo de filtro activo
    renderPerricoArray(); //muestra todos los perros nuevamente
  } else {
    //si la raza no está activa, la agregamos al array
    activeFilters.push(breed); //si no está activa se pushea dentro del array de razas a filtrar
    button.classList.add('active-filter');
  }
  filterByBreed(); //se usa filtrByBreed para actualizar la lista de perros
}

//definición de eventos para los botones

/* document.querySelector('#filter-button').addEventListener('click', function () {
  filterByBreed(); // Llamamos a la función de filtro cuando se hace clic
}); */

document.querySelector('#add-1-perrico').addEventListener('click', async function () { //debe ser asincrona la función porque necesitamos un await, esto funciona porque addPerrico() también es asíncrona
  clearWarningMessage();
//igual para todos los botones, debemos añadir un await antes de volver a activar el botón
  disableAllAddPerricoButtons(); //al clickar el botón de añadir 1 perrito que se deshabiliten todos los botones
  await addPerrico(); //que llame a addPerrico
  enableAllAddPerricoButtons(); //que vuelva a habilitar los botones después de que addPerrico se haya ejecutado y haya emitido una respuesta
});

document.querySelector('#add-1-perrico-start').addEventListener('click', async function () {
  clearWarningMessage();

  disableAllAddPerricoButtons();
  await addPerrico(true);
  enableAllAddPerricoButtons();
});

document.querySelector('#add-5-perricos').addEventListener('click', async function () {
  clearWarningMessage();

  disableAllAddPerricoButtons();
  await Promise.all([addPerrico(), addPerrico(), addPerrico(), addPerrico(), addPerrico()]); //esto hace que se ejecuten todas las llamadas a la función a la vez, y que no siga l código hasta que todas se ejecuten
  enableAllAddPerricoButtons();
});

const likeFilterButton = document.querySelector('#like-filter');

likeFilterButton.addEventListener('click', function () {
  likeFilterButton.classList.toggle('filter-selected');
  filterPerricos();
});

const dislikeFilter = document.querySelector('#dislike-filter');

dislikeFilter.addEventListener('click', function () {
  dislikeFilter.classList.toggle('filter-selected');
  filterPerricos();
});

//función que filtra por likes y dislikes: (no funcionaba porque antes por default innerText era '' hasta que se votaba, sin mbargo ahora es '0', y antes lo que hacía era filtrar según si tenía o no texto, pero ahora tine texto siempre)
function filterPerricos() {
  const isLikeFilterSelected = likeFilterButton.classList.contains('filter-selected'); //Comprueba si los botones de filtro (likeFilterButton y dislikeFilter) tienen la clase filter-selected, lo que indica si el usuario activó el filtro de "like" o "dislike".
  const isDislikeSelected = dislikeFilter.classList.contains('filter-selected');
  
  console.log('filtering', { //Esto imprime en la consola del navegador un objeto con los estados de los filtros, por ejemplo: filtering { isLikeFilterSelected: true, isDislikeSelected: false }
    isLikeFilterSelected,
    isDislikeSelected
  });

  document.querySelectorAll('.card').forEach((perricoNode) => { //Usa .forEach() para recorrer cada una y decidir si debe mostrarse o esconderse.
    // si no hay ningún filtro aplicado, los muestra todos
    if (!isLikeFilterSelected && !isDislikeSelected) {
      perricoNode.style.display = '';
      return;
    }
    // si preciosismo aplicado y hay preciosisimo lo muestra (no funcionaba porque antes por default innerText era '' hasta que se votaba, sin mbargo ahora es '0')
    const likeCount = parseInt(perricoNode.querySelector('.like-count').innerText, 10); // Convierte el valor de los likes a número
    if (likeCount > 0 && isLikeFilterSelected) {
      perricoNode.style.display = ''; // Muestra el perro si tiene al menos 1 like
      return;
    }

    // si feísimo aplicado y hay feísimo lo muestra
    const dislikeCount = parseInt(perricoNode.querySelector('.dislike-count').innerText, 10); // Convierte el valor de los dislikes a número
    if (dislikeCount > 0 && isDislikeSelected) {
      perricoNode.style.display = '';
      return;
    }

    perricoNode.style.display = 'none';  // Si no cumple con ningún filtro, lo oculta
  });
}

document.querySelector('#dislike-filter').addEventListener('click', function () {
  console.log('dislike filter clicked');
});

renderPerricoArray();

// let automaticPerrosCount = 0;
// const intervalId = setInterval(() => {
//   addPerrico();
//   automaticPerrosCount++;

//   if (automaticPerrosCount === 2) {
//     clearInterval(intervalId);
//   }
// }, 1000);