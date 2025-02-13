async function getRandomDogImage(breed) {
    const url = 
    breed === '' ? 'https://dog.ceo/api/breeds/image/random': `https://dog.ceo/api/breed/${breed}/images/random` ; // Obtiene una imagen aleatoria de perro desde https://dog.ceo/api/breeds/image/random.
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json.message;
    } catch (error) {
        console.error(error.message);
    }
}