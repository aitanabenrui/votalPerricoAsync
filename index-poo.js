//API perritos con clases
class Dog {
    constructor(img, breed, likes = 0, dislikes = 0){ //define los atributos de cada perrito creado
        this.img = img; //url de la imágn del perro
        this.breed = breed; //nombre de la raza
        this.likes = likes; //contador de likes
        this.dislikes = dislikes; //contador de dislikes
    }

    //métodos likes y dislikes que se encargan de incremntar el valor
    likes(){
        this.likes++;
    }

    dislikes(){
        this.dislikes++;
    }

    //metodo para hacer la card
    card(){
        return `<div class="card">
        <img src="${this.img}" alt="Perro" />
        <br />
        <p><span class="like-count">${this.likes}</span>❤️ <span class="dislike-count">${this.dislikes}</span>🤮</p>
        <button class="like">Preciosísimo</button> <button class="dislike">Feísisimo</button>
        </div>`;
    }

    isFeisimo(){
        return this.dislikes > 0;
    }

    isPreciosisimo(){
        return this.likes > 0;
    }
} 



class DogList {
    constructor(id) {
        this.dogs = [];
        this.filtersApplied = {
            dislike: false,
            like: false,
            breeds: []
        };
        this.breedsCount = {};
        this.container = document.querySelector(id);
    }

    display(dogList){
        this.container.innerHTML = ''; //resetear el html
        dogList.forEach(dog => {
            this.container.innerHTML += dog.card();
        });
    }

    applyFilter(){
        const filteredDogs = this.dogs.filter((dog)=>{
            //filtrar por like y dislike
            if(this.filtersApplied.like && !dog.isPreciosisimo) return false;
            if(this.filtersApplied.dislike && !dog.isFeisimo) return false;

            //filtrar por raza
            if(this.filtersApplied.breeds.length > 0 && this.filtersApplied.breeds.includes(dog.breed))
                return false;

            return true;
        });

        this.display(filteredDogs); 
    }

    switchLikeFilter(){
        this.filtersApplied.like = !this.filtersApplied.like;
    }

    switchDislikeFilter(){
        this.filtersApplied.dislike = !this.filtersApplied.dislike;
    }

    setBreedFilter(breed){
        if(this.filtersApplied.breeds.includes(breed)){
            this.filtersApplied.breeds = this.filtersApplied.breeds.filter((iBreed)=>{
                iBreed !== breed;
            })
        } else {
            this.filtersApplied.breeds.push(breed);
        }
    }

    //metodo para añadir al principio
    async addDogStart(breed){ //si hay una raza seleccionada le pasamos un string con la raza
        const randomImg = await getRandomDogImage(breed);
        const dog = new Dog(randomImg, this.extractBreedFromImage(randomImg));
        this.dogs.unshift(dog);
        //añadir en el objeto breedsCount (hacer función que lo añada)
    }

    async addDogEnd(breed){ //si hay una raza seleccionada le pasamos un string con la raza
        const randomImg = await getRandomDogImage(breed);
        const dog = new Dog(randomImg, this.extractBreedFromImage(randomImg));
        this.dogs.push(dog);
    }

    async addFiveDog(breed){ //si hay una raza seleccionada le pasamos un string con la raza
        for(let i = 0; i < 5; i++){ 
            const randomImg = await getRandomDogImage(breed);
            const dog = new Dog(randomImg, this.extractBreedFromImage(randomImg));
            this.dogs.push(dog);
        }
    }

    extractBreedFromImage(imageUrl){
        const regex = /breeds\/([^\/]+)\//; // Extrae el nombre de la raza de la URL
        const match = imageUrl.match(regex);
        
        if (match && match[1]) {
            let parts = match[1].split("-"); // Separar por "-"
            let breed = parts.length > 1 
              ? `${parts[1]}--${parts[0]}`  // Si hay subraza, invertir el orden
              : parts[0];                    // Si no hay subraza, mantener igual
            return breed;
        }
        return "Desconocida"; // Si no se puede extraer, devolver "Desconocida"
      };
}

//hacer que los botones de filtros llamen a la función correcta
const select = document.querySelector("#breeds-picker"); //selecciona el desplegable donde elegir las razas
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
          option.textContent = `${breedSurname} ${breed}`;
          optgroup.appendChild(option); //se añade la etiqueta option a optgroup
        });
        select.appendChild(optgroup); //una vez añadidas todas las subrazas al padre optgroup, este se añad al padre "select"
      }
  }
  
  console.log(breedNamesArray); 
  };

const breedsPicker = document.querySelector("#breeds-picker");
let selectedBreed = ''; //aquí guardaremos la raza seleccionada en el select
  //addEventListener para detectar el CAMBIO DE RAZA y actualizar la raza selccionada
breedsPicker.addEventListener('change', (event)=>{ //función anónima que se ejecuta cuando el valor de un elemento del selct cambia.
    selectedBreed = event.target.value; //event.target se refiere al elemento que disparó el evento y value es el valor del elemento targeteado
    console.log('Filtrando por raza: ', selectedBreed) //vemos si se actualiza
  }) //una vez cambiada la raza usaremos esta variable para pasarsela a getRandomDogImage

const list = new DogList('#dog-list');

//listener para el botón de añadir un perro al final
document.querySelector('#add-1-perrico').addEventListener('click', async function () { //debe ser asincrona la función porque necesitamos un await, esto funciona porque addPerrico() también es asíncrona
    await list.addDogEnd(selectedBreed);
    list.applyFilter();
    console.log('click');
});

//listener para el botón de añadir un perro al principio
document.querySelector('#add-1-perrico-start').addEventListener('click', async function () {
    await list.addDogStart(selectedBreed);
    list.applyFilter();
    console.log('click');
});
  //listener para el botón de añadir 5 perros
document.querySelector('#add-5-perricos').addEventListener('click', async function () {
    await list.addFiveDog(selectedBreed); //esto hace que se ejecuten todas las llamadas a la función a la vez, y que no siga l código hasta que todas se ejecuten
    list.applyFilter(); //aplica los filtros y luego renderiza
});

console.log(list.breedsCount);