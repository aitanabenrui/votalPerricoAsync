async function getRandomDogImage(breed) {
    // verificamos si la raza contiene una subraza (si es una subraza la raza se verá algo como "subraza--raza")
    const isSubBreed = breed.includes('--'); //valor booleano true o false

    let url; //definimos una variable url
    if (isSubBreed) {
      // Si es una subraza, el formato será 'raza/subraza'
      const [subBreed, mainBreed] = breed.split('--'); // Dividimos el valor para obtener la subraza y la raza principal
      url = `https://dog.ceo/api/breed/${mainBreed}/${subBreed}/images/random`; // Endpoint para la subraza
    } else if (breed === '') {
      // Si no hay raza seleccionada, obtenemos una imagen aleatoria
        url = 'https://dog.ceo/api/breeds/image/random';
    } else {
      // Si es una raza principal, usamos el endpoint de la raza
        url = `https://dog.ceo/api/breed/${breed}/images/random`;
    }

    try {
        const response = await fetch(url); //obtiene la url según si no hay raza, si es raza o subraza
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json.message; // La imagen está en el campo 'message' de la respuesta JSON
        } catch (error) {
        console.error(error.message);
    }
}


//función que devuelve el array de razas de perro

const getDogBreeds = async () =>{
    const url = 'https://dog.ceo/api/breeds/list/all'; //link para conseguir la info, es un endpoint de tipo get
    try {
        const response = await fetch(url); //permite obtener los datos de la api, fetch es igual que buscar en el navegador al hacer intro
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json(); //convierte la respuesta en json

        return json.message; //en esta url el message es un objeto de razas
    } catch (error) {
        console.error(error.message);
    }
}