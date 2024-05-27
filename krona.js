/*

    Importación de módulos

*/
import axios from 'axios';

/*

    Declaración de variables

*/

const urlVolumen = 'https://dc.fandom.com/wiki/Action_Comics_Vol_1_'
//const urlVolumen = 'https://dc.fandom.com/wiki/Action_Comics_Vol_2_'

let numeroInicial = 1;  // número en que empezamos a extraer información
let numeroFinal = 0;    // número en el que dejamos de extraer información (0 para llegar al último)

/*

    Función que obtiene el contenido de la web.

*/

const fetchData = async (url) => {

    try {
        const response = await axios.get(url);

        if (response.status === 404) {
            console.log(`La página ${url} no se encontró. Abortando.`)
            return;
        }

        console.log('Status:', response.status);
        console.log('Data:', response.data);

    } catch (error) {
        console.log('Se produjo un error');
    }

}

/*

    Programa inicial

*/

const urlInicial = `${urlVolumen}${numeroInicial}`
console.log(`Iniciando KRONA`);
console.log(`Extrayendo URL ${urlInicial}`);
fetchData(urlInicial);