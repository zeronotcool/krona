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

let numeroInicial = 1;  // número en que empezamos a extraer información
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
        /*
        fs.writeFile('output.html', htmlContent, 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir el fichero:', err);
            } else {
                console.log('Fichero escrito correctamente.');
            }
        });
        */

        // Obtiene la fecha del comic
        //const writerText = $('a[data-tracking-label="categories-top-more-4"]').text();
        //const pencillerText = $('a[data-tracking-label="categories-top-more-5"]').text();
        //const dateText = $('a[data-tracking-label="categories-top-more-41"]').text();
        const dateText = extractDate(response.data);
        const writersText = extractField('Writers', $);
        const pencillersText = extractField('Pencilers', $);        

        console.log('Fecha: ' + dateText)
        console.log('Escritores: ' + writersText);
        console.log('Dibujantes: ' + pencillersText);
        //console.log(dateText);

    } catch (error) {
        console.log(`Se produjo un error: ${error}`);
    }

}

/*

    Función para parsear autores

*/

const extractField = (label, $) => {
    const h3Element = $(`h3.pi-data-label:contains("${label}")`);
    if (h3Element.length > 0) {
        const divElement = h3Element.next('div.pi-data-value');
        const anchorElements = divElement.find('a');
        if (anchorElements.length > 0) {
            // Eliminar duplicados y procesar cada enlace por separado
            const uniqueValues = [...new Set(anchorElements.map((index, element) => $(element).text().trim()))];
            return uniqueValues.join(',');
        } else {
            return '';
        }
    } else {
        return '';
    }
};

function extractDate(html) {
    // Cargar el HTML con Cheerio
    const $ = cheerio.load(html);
  
    // Seleccionar el segundo <h2> elemento que contiene la fecha
    const dateElement = $('h2').filter(function () {
      // Filtrar por el contenido de enlaces dentro del <h2> que contengan una coma (indicativo de mes y año)
      return $(this).find('a').length >= 2 && $(this).text().includes(',');
    });
  
    // Extraer y concatenar el texto de los enlaces dentro del <h2>
    const month = dateElement.find('a').first().text().trim();
    const year = dateElement.find('a').last().text().trim();
  
    // Devolver la fecha en el formato deseado
    return `${month}, ${year}`;
  }

/*

    Programa inicial

*/

const urlInicial = `${urlVolumen}${numeroInicial}`
console.log(`Iniciando KRONA`);
console.log(`Extrayendo URL ${urlInicial}`);
fetchData(urlInicial);