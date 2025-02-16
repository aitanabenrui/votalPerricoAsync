const perricosArray = []; // Este array contendrá los objetos con {image: 'url', breed: 'raza'}
console.log(perricosArray);
const select = document.querySelector("#breeds-picker"); //selecciona el desplegable donde elegir las razas
let selectedBreed = ''; //aquí guardaremos la raza seleccionada en el select
let filteredPerricos; //array de objetos con los perros de la raza que se quiere filtrar

const timeoutId = setTimeout(() => {
  document.querySelector('#add-warning').style.display = '';
}, 3000);

const breedsPicker = document.querySelector("#breeds-picker");
let breedNamesArray = [];

//addEventListener para detectar el CAMBIO DE RAZA y actualizar la raza selccionada
breedsPicker.addEventListener('change', (event)=>{ //función anónima que se ejecuta cuando el valor de un elemento del selct cambia.
  selectedBreed = event.target.value; //evnt.target se refiere al elemento que disparó el evento y value es el valor del elemento targeteado
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
function addSocialListeners() {
  document.querySelectorAll('.like').forEach((buttonNode) => {
    buttonNode.addEventListener('click', function () {
      const hermanico = buttonNode.previousElementSibling;
      const likeCountNode = hermanico.querySelector('.like-count');
      const perricoData = getPerricoDataFromNode(buttonNode);  // Función para obtener el objeto perricoData
      perricoData.likes += 1;  // Incrementa el contador de likes
      likeCountNode.innerText = perricoData.likes;  // Actualiza el contador en el DOM
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
function getPerricoDataFromNode(buttonNode) {
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
  <p><span class="like-count"></span>❤️ <span class="dislike-count"></span>🤮</p>
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
  const breedFilter = selectedBreed; //metemos en una variable la raza que se ha seleccionado en el select

  //filtramos el array de perricosArray por la raza seleccionada ( perricosArray es un array de objetos con la url de la imágen y la raza)
  filteredPerricos = breedFilter === '' || breedFilter === 'Todas las razas'
  ? perricosArray : perricosArray.filter(perrico => perrico.breed === breedFilter ); //la variable filteredPerricos es un nuevo array de objetos con solo la raza de perro seleccionada
  
  renderFilteredPerricos(filteredPerricos); //llamamos a la función qu renderiza los perritos filtrados (array de objetos)
};


//función que renderiza los perritos filtrados por raza
const renderFilteredPerricos = (filteredPerricos) =>{ // a esta función se le pasa
  const dogList = document.querySelector('#dog-list'); //seleccionamos el div que contiene las cartas de perros
  dogList.innerHTML = ''; //vacía su contenido

  console.log('Rendering filtered perricos:', filteredPerricos); // Verificar si los perritos filtrados son correctos

  filteredPerricos.forEach((perricoData =>{ //para cada objeto de perrito que cree una card y la añada con appendChild a dogList
    const card = document.createElement('div');
    card.className = 'card';
    //perricoData.imgae es la propiedad del objeto perricoData que contiene la url de la imágen
    card.innerHTML = `
    <img src="${perricoData.image}" alt="Perro" />
    <br />
    <p><span class="like-count">${perricoData.likes}</span>❤️ <span class="dislike-count">${perricoData.dislikes}</span>🤮</p>
    <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>`;

    dogList.appendChild(card);
  }))
  addSocialListeners(); //y se llama a esta función para añadir la funcionalidad de like y dislike
};


 //función asíncrona que añade un perrito, obtioene un perrico al alzar con getRandomDogImage, añade al principio o al final y crea un div con la imágen y los botones
const addPerrico = async (addToStart) => {
    // const breed = document.querySelector('[name=breeds]').value; //selecciona el valor del select
    const breed = selectedBreed; //raza de perro seleccionada
    const perricoImg = await getRandomDogImage(breed); //desde aquí llamamos a la función getRandomDogImage del archivo js api
//si selectedBreed está vacío ('') como dice en el archivo api.js, se pasará un link de foto de perro aleatorio

//creamos un objeto con la imágen y la raza
const perricoData = {
  image: perricoImg,
  breed: breed,
  likes: 0, //contador de likes
  dislikes: 0 //contador de dislikes
};

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
};


//definición de eventos para los botones

document.querySelector('#filter-button').addEventListener('click', function () {
  filterByBreed(); // Llamamos a la función de filtro cuando se hace clic
});

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