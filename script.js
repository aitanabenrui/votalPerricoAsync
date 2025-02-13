const perricosArray = []; //Un array que almacenará las URL de las imágens de perros para renderizarlas en la página


console.log(perricosArray);

// addPerrico();

//esta linea de abajo no haría falta porque ya se ha definido en la función renderPerrico. 
const dogList = document.querySelector('#dog-list'); //modifica por id el div con id dog-list
//doglist es una variable que selecciona el elemento HTML con el ID dog-list. Este es el contenedor donde se insertaran las tarjetas de los perros
//lo que hace es seleccionar el primer elemento en el DOM que tiene el id='dogList'. el cual corresponde al contenedor en el que se va a agregar las tarjetas de los perros
//es un punto de referencia donde colocar cada nueva tarjeta de perro dogCard.

//función que agrega eventos a los botones Precioso y feísimo: agrega eventListeners a los botones precioso y feísimo para cada dogCard
function addSocialListeners(){

 // Función para los votos positivos: para cada botón de precioso, se añade un eventListener, busca al hermano anterior y le suma 1 
//Selecciona todos los botones con la clase .like (botón precioso), por cada botón se agrega un evento que incrementa el número de votos
document.querySelectorAll('.like').forEach((buttonNode) => { //seleccióna todos los botones con la clase like
    if(!buttonNode.hasAttribute('data-listened')) { // Verifica si ya tiene un listener: si el botón no tiene el atrinuto data-listened, la condición será verdadera y el bloque de código dentro del if se ejecuta
        //.hasAttribute es un método que comprueba si un elemento html tien un atributo específico
        //si el botón ya tiene el atributo data-listened, no añadirá un nuevo listener
        buttonNode.addEventListener('click', function () { //al hacer click busca el elemento anterior (el contador de likes) e incrementa el número mostrado en el span .like-count
            console.log('me gusta clickado');
            const hermanico = buttonNode.previousElementSibling; //accede al hermano anterior del botón, que en el html es el elemento <p> que contien el contador de likes. Encuentra el span con la clase .like-count dentro de ese <p> y le suma 1 al número mostrado en ese <span>
            const likeCountNode = hermanico.querySelector('.like-count'); //selecciona el elemento del html span con la class 'like-count'
            likeCountNode.innerText = Number(likeCountNode.innerText) + 1  //y al elemento con class -like-count, le suma 1.
        });
        buttonNode.setAttribute('data-listened', 'true'); // Marca el botón como "escuchado"
        //agrega el atributo data-listened al boton buttonNode
    }
});

//Función para los votos negarivos: para cada botón de feísimo se añade un eventListener, busca al hermano anterior y le suma 1
document.querySelectorAll('.dislike').forEach((buttonNode) => { //buttonNode es el botón en el que se hace clic (.like o .dislike).
    if(!buttonNode.hasAttribute('data-listened')) { 
        buttonNode.addEventListener('click', function () {         //previousElementSibling accede al contenedor inmediatamente anterior (el que contiene los contadores like-count o dislike-count).
            console.log('me gusta clickado');
            const hermanico = buttonNode.previousElementSibling;
            const dislikeCountNode = hermanico.querySelector('.dislike-count');
            dislikeCountNode.innerText = Number(dislikeCountNode.innerText) + 1
            });
            buttonNode.setAttribute('data-listened', 'true'); // Marca el botón como "escuchado"
        }
    });
}

//EN ESTA VERSIÓN DEL CÓDIGO AÑADIREMOS PARTE DEL HTML CON APPENDCHILD USANDO CREATEELEMENT-------------------------------------------------------------------------------------------------------------------------------------------

//esta función se encarga de añadir las cards de perritos

function renderPerrico(dogImage, addToStart = false){ //recibe la URL de la imagen de perro
    //crea la tarjeta del perro con la imagen, botones y contadores de votos
    const newDogCard = document.createElement('div'); //creamos un div que contenga la info de la card de perrito
    newDogCard.className = 'dogCard'; //al div le asignamos la clase dogCard previamente definida en el css
    //añadimos ahora el resto de la card a innerHTML
    newDogCard.innerHTML = `<img class="image" id="perro" alt="imagen de perro" src="${dogImage}"> 
            <div class="cardVote" > 
                <div class="voteCard">
                    <p>😍 <span class="like-count"></span></p>
                    <button class="like">Precioso</button> 
                </div>
                <div class="voteCard">
                    <p>🤢 <span class="dislike-count"></span></p>
                    <button class="dislike">Feísimo</button>
                </div>
            </div>`;
    
        //const dogList = document.querySelector('#dog-list');
        //como definimos dogList al inicio del código podemos usarlo ahora para el appendChild

    if (addToStart) { //selecciona el contenedor dogList y añade el nuevo elemento
        dogList.prepend(newDogCard); // Añadir al principio del div con id dog-list el elemento que acabamos de crear
    } else {
        dogList.appendChild(newDogCard); // Añadir al final del div la card newDogCard
    }

    //finalmente añadiremos los event listeners uan vez metidas las nuevas tarjetas en el DOM
    addSocialListeners(); //llama a addSocialListeners para que los nuevos botones funcionen
}

//----------------------------------------------------------------------------------------------------------------------------------------------
//creo que este código es redundante, no se por qué esto está definido así
//Las tarjetas se generan directamente en el DOM al agregar perritos con renderPerrico
//No hay funcionalidades que destruyan o modifiquen significativamente el DOM, por lo que no es necesario recurrir al array para re-renderizarlo.
// implementando un botón "Reiniciar" o guardando el estado de la aplicación), el bloque de código que actualiza perricosArray al agregar un perrito dejaría de ser redundante.
function renderPerricoArray(){
    dogList.innerHTML = ''; // Limpiar el contenido de la lista de perros

    perricosArray.forEach((dogImage)=>{ //itera sobre perricosArray y renderiza todas las imágenes
        //const votes = votesArray[index] || {precioso:0, feisimo:0}; //inicializamos votos si no existen
        renderPerrico(dogImage);
        console.log('innerHtml posición', index, dogList.innerHTML);
    });

    addSocialListeners(); //llama a addSocialListeners para que los nuevos botones funcionen
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//función para añadir los perritos con votos + y -, los que están en empate y un botón para poder volver a la vista de todas las cards
//la idea es crear funciones que definan una variable "dogCard" la cual contendrá todas las cards de perritos existentes generadas en ese momento
//se seleccionarán todas con querySelectorAll, y para cada una de ellas mirará en el span con id like-count y dislike-count.
//comparará los valores y si se acciona el botón de ver los votos positivos, la función hará invisibles todas las tarjetas que no cumplan con el requisito
const positive = document.querySelector('#positives'); 
const negative = document.querySelector('#negatives'); 
const add1dog = document.querySelector('#add-1-perrico');
const add5dog = document.querySelector('#add-5-perrico');
const add1dogStart = document.querySelector('#add-1-perrico-start');

const addPositiveVotes = ()=>{
    //seleccionamos todas las tarjetas de perritos
    const dogCards = document.querySelectorAll('.dogCard'); //metemos en una variable todas las dogCard existentes
    
    dogCards.forEach((card)=>{ //para cada card de perrito definimos la cantidad de likes y dislikes que tiene
        const likeCount = Number(card.querySelector('.like-count').innerText || 0); // Votos positivos, si no tiene votos se le asigna 0 a likeCount.
        const dislikeCount = Number(card.querySelector('.dislike-count').innerText || 0); // Votos negativos

        if (likeCount > dislikeCount) { //si tiene mas likes que dislikes, entonces dejará el estilo original de la card
            card.style.display = ''; // Mostrar si tiene más votos positivos, Restablece el estilo de la tarjeta
        } else {
            card.style.display = 'none'; // Ocultar si no tiene más votos positivos
        }
    });
    add1dog.disabled = true;
    add5dog.disabled = true;
    add1dogStart.disabled = true;
};

// Función para mostrar perritos con votos negativos
const addNegativeVotes = () => {
    // Seleccionamos todas las tarjetas de perritos
    const dogCards = document.querySelectorAll('.dogCard');

    dogCards.forEach((card) => {
        const likeCount = Number(card.querySelector('.like-count').innerText || 0); // Votos positivos
        const dislikeCount = Number(card.querySelector('.dislike-count').innerText || 0); // Votos negativos

        if (dislikeCount > likeCount) {
            card.style.display = ''; // Mostrar si tiene más votos negativos, Restablece el estilo de la tarjeta
        } else {
            card.style.display = 'none'; // Ocultar si no tiene más votos negativos, también se puede eliminar el innerHTML hacer un filter con los perritos que tineen esta propiedad y rendrizar de nuevo solo los que cumplen la propiedad (en el caso de que tuvieramos la información metida en un objeto por ejemplo)
        }
    });
};

//Ahora definimos una función para perritos empatados

const tiedVotes = () =>{
    // Seleccionamos todas las tarjetas de perritos
    const dogCards = document.querySelectorAll('.dogCard');

    dogCards.forEach((card) => {
        const likeCount = Number(card.querySelector('.like-count').innerText || 0); // Votos positivos
        const dislikeCount = Number(card.querySelector('.dislike-count').innerText || 0); // Votos negativos

        if (dislikeCount === likeCount && dislikeCount && likeCount ) { //si el número de likes es igual al número de dislikes y además se ha votado, es decir, no tienen los votos a 0
            card.style.display = ''; // Mostrar si tiene más votos negativos, Restablece el estilo de la tarjeta
        } else {
            card.style.display = 'none'; // Ocultar si no tiene más votos negativos
        }
    });
    add1dog.disabled = true;
    add5dog.disabled = true;
    add1dogStart.disabled = true;
}

// Función para mostrar todos los perritos nuevamente: restablecer la visualización de todas las tarjetas de perritos en la página
const resetView = () => {
    const dogCards = document.querySelectorAll('.dogCard'); //selecciona todas las cartas de perros 
    dogCards.forEach((card) => { //para cada una de ellas vuelve a dejar el estilo original
        card.style.display = ''; // Mostrar todas las tarjetas, Restablece el estilo de la tarjeta
    });
    //13-02-2025 si no hay perricos, habilitar el botón de añadir 
    if(dogCards.length > 0){
    add1dog.disabled = false;
    }
    add5dog.disabled = false;
    add1dogStart.disabled = false;
};

// Función para agregar un perrico aleatorio al array, llama a la función d la API para obtener una URL del perro

const addPerrico = async (addToStart = false)=>{ //cambiará a true si apretamos el botón
    const perricoImg = await getRandomDogImage(); //la función getRandomDogImage se declara en el archivo api.js
    console.log(perricoImg);
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //este bloque de código es redundante: como addPerrico llama a renderPerrico inmepdiatamente después, además perricosArray no se usa más adelante en ningúan función relevante
    //renderPerrico ya maneja el posicionamiento, no hay dependencia entre el array y el DOM
    //el bloque no sería redundante si se necesitara el array de perritos para un porpósito específico del DOM
    if(addToStart){
        perricosArray.unshift(perricoImg);
    } else {
        perricosArray.push(perricoImg); //añad la url al array perricosArray y la renderiza en la página con la función renderPerrico
    }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    renderPerrico(perricoImg, addToStart); // Re-renderizar la lista con la nueva imagen
    addSocialListeners(); //activa los eventos

    //13-02-2025
    // Desactivar botón al añadir el primer perrico
    add1dog.disabled = true;
};

// Función para agregar 5 perricos: definimos una función asíncrona con un for que no dejará de ejecutarse hasta que i > 5, es decir que pushee al array perricosArrar 5 imágenes random
const add5Perricos = async () => {
    for (let i = 0; i < 5; i++) {
        addPerrico(); 
    }
    addSocialListeners(); //activa los eventos
};

// Renderizar los perricos al cargar la página
// renderPerricoArray(); //esto hace que la página tenga de primeras imagenes con perritos y no queremos eso, queremos que la página no tenga ningún perrito 

//Listeners para los botones de añadir perritos

// Agregar evento al botón "Añadir 1 perrico más"
document.querySelector('#add-1-perrico').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    addPerrico();
});

// Agregar evento al botón "Añadir 5 perricos más"
document.querySelector('#add-5-perrico').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    add5Perricos();
});

// Agregar evento al botón "Perritos con votos +"
document.querySelector('#positive-votes').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    addPositiveVotes();
});

// Agregar evento al botón "Perritos con votos -"
document.querySelector('#negative-votes').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    addNegativeVotes();
});

// Agregar evento al botón "Perritos empatados"
document.querySelector('#tied-votes').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    tiedVotes();
});

//Agregar el evento al botón "Mostrar todos de nuevo"
document.querySelector('#reset-view').addEventListener('click', function(event){
    event.preventDefault(); // Evitar el envío del formulario
    resetView();
});

//Agregar el evento al botón "Añadir 1 perrito al principio"

document.querySelector('#add-1-perrico-start').addEventListener('click', function(){
    addPerrico(true); 
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//EVENT DELEGATION: se podría usar eventDelegatio en vez de la función addSocialListeners.
//añade un solo addevent listener al div dogList que contiene las tarjetas de los perros
//cuando ocurre un click en cualquier parte de ese div, se verifica si el elemento clicado (event.target) es un botón con la clase .like o .dislike


/* dogList.addEventListener('click', function (event) {
    if (event.target.classList.contains('like')) { //verifica si el click fue en un botón de like
        const likeCountNode = event.target.previousElementSibling.querySelector('.like-count'); //si es así busca el contador de votos like-count en el hermano anterior (previousElementSibling)
        likeCountNode.innerText = Number(likeCountNode.innerText) + 1; //se convierte el texto del contador en número y se le suma 1.
    }

    if (event.target.classList.contains('dislike')) {
        const dislikeCountNode = event.target.previousElementSibling.querySelector('.dislike-count');
        dislikeCountNode.innerText = Number(dislikeCountNode.innerText) + 1;
    }
});
 */

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

/* //aplicación de setTimeout & intervals para añadir targetas de perros cada 10s

setInterval(()=>{
    addPerrico();
}, 10000); 
 */

//A los 15 segundos de entrar en la web, si no he hecho click en ninguno de los botones de añadir perros, que salga un mensaje encima que diga "Pulsa algún botón para añadir perricos"

const popupTimeout = setTimeout(() => {
    // Verificar si no se ha añadido ningún perro (el contenedor está vacío)
    if (dogList.children.length === 0) {
        // Añadir el mensaje directamente dentro del contenedor con innerHTML
        document.querySelector('#popup').style.display = 'block';
    }
}, 3000);

//Listener para que al pulsar donde sea se quite el popup

document.querySelector('#popup').addEventListener('click', () => {
        clearTimeout(popupTimeout); // Cancelar el mensaje si hay interacción
        document.querySelector('#popup').style.display = '';
    });