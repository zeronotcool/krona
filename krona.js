/*

    Importación de módulos

*/
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

/*

    Declaración de variables

*/

const urlVolumen = 'https://dc.fandom.com/wiki/Action_Comics_Vol_1_'
//const urlVolumen = 'https://dc.fandom.com/wiki/Action_Comics_Vol_2_'

let numeroInicial = 655;  // número en que empezamos a extraer información
let numeroFinal = 0;    // número en el que dejamos de extraer información (0 para llegar al último)

/*

    Función que obtiene el contenido de la web.

*/

const fetchData = async (url) => {

    try {
        // Obtiene el código HTML
        const response = await axios.get(url);

        // Si la URL no existe detiene el programa
        if (response.status === 404) {
            console.log(`La página ${url} no se encontró. Abortando.`)
            return;
        } else {

        }

        //console.log('Status:', response.status);
        //console.log('Data:', response.data);

        // Carga el contenido de la web
        const $ = cheerio.load(response.data);
        const htmlContent = $.html();

        // Vuelca el contenido a un fichero output.html
        fs.writeFile('output.html', htmlContent, 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir el fichero:', err);
            } else {
                console.log('Fichero escrito correctamente.');
            }
        });

        // Obtiene la fecha del comic
        const dateText = $('a[data-tracking-label="categories-top-more-41"]').text();
        console.log(dateText);

    } catch (error) {
        console.log(`Se produjo un error: ${error}`);
    }

}

/*

    Programa inicial

*/

const urlInicial = `${urlVolumen}${numeroInicial}`
console.log(`Iniciando KRONA`);
console.log(`Extrayendo URL ${urlInicial}`);
fetchData(urlInicial);