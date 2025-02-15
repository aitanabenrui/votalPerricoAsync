const perricosArray = ['https://images.dog.ceo/breeds/affenpinscher/n02110627_10439.jpg'];
console.log(perricosArray);
const select = document.querySelector("#breeds-picker"); //selecciona el desplegable donde elegir las razas

const timeoutId = setTimeout(() => {
  document.querySelector('#add-warning').style.display = '';
}, 3000);
// console.log(getRandomDogImage());

const breedsPicker = document.querySelector("#breeds-picker");
let breedNamesArray = [];

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
        optgroup.appendChild(option); //se añade la etiqueta option a optgroup
      });
      select.appendChild(optgroup); //una vez añadidas todas las subrazas al padre optgroup, este se añad al padre "select"
    }
}

console.log(breedNamesArray); 
}

// addPerrico();

function clearWarningMessage() {
  clearTimeout(timeoutId);
  document.querySelector('#add-warning').style.display = 'none';
}

function addSocialListeners() {
  document.querySelectorAll('.like').forEach((buttonNode) => {
    buttonNode.addEventListener('click', function () {
      const hermanico = buttonNode.previousElementSibling;
      const likeCountNode = hermanico.querySelector('.like-count');
      likeCountNode.innerText = Number(likeCountNode.innerText) + 1;
    });
  });

  document.querySelectorAll('.dislike').forEach((buttonNode) => {
    buttonNode.addEventListener('click', function () {
      console.log(buttonNode.closest('.card'));
      const likeCountNode = buttonNode.closest('.card').querySelector('.dislike-count');
      likeCountNode.innerText = Number(likeCountNode.innerText) + 1;
    });
  });
}

function renderPerricoArray() {
  const dogList = document.querySelector('#dog-list');
  dogList.innerHTML = '';

  perricosArray.forEach((dogImage, index) => {
    const htmlAdd = `<div class="card">
  <img src="${dogImage}" alt="Perro" />
  <br />
  <p><span class="like-count"></span>❤️ <span class="dislike-count"></span>🤮</p>
  <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>
</div>`;

    dogList.innerHTML += htmlAdd;
  });

  addSocialListeners();
}

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

const addPerrico = async (addToStart) => {
    const breed = document.querySelector('[name=breeds]').value;
  const perricoImg = await getRandomDogImage(breed);

  if (addToStart) {
    perricosArray.unshift(perricoImg);
  } else {
    perricosArray.push(perricoImg);
  }

  const dogList = document.querySelector('#dog-list');

  const isAnyFilterSelected = document.querySelector('.filter-selected');

  const perricoCardElement = document.createElement('div');
  perricoCardElement.className = 'card';
  perricoCardElement.style.display = isAnyFilterSelected ? 'none' : '';

  perricoCardElement.innerHTML = `
  <img src="${perricoImg}" alt="Perro" />
  <br />
  <p><span class="like-count"></span>❤️ <span class="dislike-count"></span>🤮</p>
  <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>`;

  if (addToStart) {
    dogList.prepend(perricoCardElement);
  } else {
    dogList.appendChild(perricoCardElement);
  }

  const likeButton = perricoCardElement.querySelector('.like');

  likeButton.addEventListener('click', function () {
    const likeCountNode = perricoCardElement.querySelector('.like-count');
    likeCountNode.innerText = Number(likeCountNode.innerText) + 1;
  });

  const dislikeButton = perricoCardElement.querySelector('.dislike');
  dislikeButton.addEventListener('click', function () {
    const likeCountNode = perricoCardElement.querySelector('.dislike-count');
    likeCountNode.innerText = Number(likeCountNode.innerText) + 1;
  });
};

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

function filterPerricos() {
  const isLikeFilterSelected = likeFilterButton.classList.contains('filter-selected');
  const isDislikeSelected = dislikeFilter.classList.contains('filter-selected');
  console.log('filtering', {
    isLikeFilterSelected,
    isDislikeSelected
  });

  document.querySelectorAll('.card').forEach((perricoNode) => {
    // si no hay ningún filtro aplicado, lo muestra
    if (!isLikeFilterSelected && !isDislikeSelected) {
      perricoNode.style.display = '';
      return;
    }
    // si preciosismo aplicado y hay preciosisimo lo muestra
    const likeCount = perricoNode.querySelector('.like-count').innerText;
    if (likeCount !== '' && isLikeFilterSelected) {
      perricoNode.style.display = '';
      return;
    }

    // si feísimo aplicado y hay feísimo lo muestra
    const dislikeCount = perricoNode.querySelector('.dislike-count').innerText;
    if (dislikeCount !== '' && isDislikeSelected) {
      perricoNode.style.display = '';
      return;
    }

    perricoNode.style.display = 'none';
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