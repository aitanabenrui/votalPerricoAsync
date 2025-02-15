async function getRandomDogImage(breed) {
    const url = 
    breed === '' ? 'https://dog.ceo/api/breeds/image/random': `https://dog.ceo/api/breed/${breed}/images/random` ; // Obtiene una imagen aleatoria de perro desde https://dog.ceo/api/breeds/image/random.
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json.message; //message es la ur de la imágen random del perrito ya que devueelve un objeto con propiedades message
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