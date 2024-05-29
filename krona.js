/*

    Importación de módulos

*/
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

/*

    Declaración de variables

*/

const baseUrl = 'https://dc.fandom.com/wiki/Action_Comics_Vol_1_'
//const urlVolumen = 'https://dc.fandom.com/wiki/Action_Comics_Vol_2_'

let pageNumber = 584;  // número en que empezamos a extraer información
let pageUntil = 595;    // número en el que dejamos de extraer información (0 para llegar al último)
let previousDate = '';
const csvHeaders = 'pageNumber;Cover Date (mes);Writer(s);Penciler(s)\n';
fs.writeFileSync('results.csv', csvHeaders);

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

        // Carga el contenido de la web
        const $ = cheerio.load(response.data);
        const htmlContent = $.html();

        //const coverDate = extractField('Cover Date', $);
        const coverDate = extractDate(response.data);
        /*
        if (previousDate != '') {
            //console.log(`Fecha anterior: ${previousDate}`);
            // Convertir la cadena a un objeto Date
            let dateObj = new Date(previousDate + ' 00:00:00 GMT');

            // Sumar un mes a la fecha
            dateObj.setMonth(dateObj.getMonth() + 1);

            // Obtener el nuevo mes y año
            let newMonth = dateObj.toLocaleString('en-US', { month: 'long' });
            newMonth = newMonth.charAt(0).toUpperCase() + newMonth.slice(1);
            let newYear = dateObj.getFullYear();

            // Crear la nueva cadena de fecha
            let newDate = `${newMonth},${newYear}`;
            //console.log(`Fecha actual debería ser: ${newDate}`);
            //console.log(`Fecha actual: ${coverDate}`);
            if (coverDate != newDate) {
                // Escribir los resultados en el archivo CSV
                console.log(` - ${newDate}`);
                appendResultToCSV('', newDate, '', '');
            }
        }
        previousDate = coverDate;
*/
        
        const writers = extractField('Writer', $);
        const pencilers = extractField('Penciler', $);

        // Escribir los resultados en el archivo CSV
        console.log(`${pageNumber} - ${coverDate} - ${writers} - ${pencilers}`);
        appendResultToCSV(pageNumber, coverDate, writers, pencilers);

        // Continuar iterando con la siguiente página
        pageNumber++;
        const nextUrl = `${baseUrl}${pageNumber}`;
        if (pageUntil != 0) {
            if (pageNumber <= pageUntil) {
                fetchData(nextUrl);
            } else {
                console.log('Se llegó al límite superior');
            }
        } else {
            fetchData(nextUrl);
        }

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

    /*
    const dateText = extractDate(response.data);
    const writersText = extractField('Writers', $);
    const pencillersText = extractField('Pencilers', $);        

    console.log('Fecha: ' + dateText)
    console.log('Escritores: ' + writersText);
    console.log('Dibujantes: ' + pencillersText);
    */
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

/*

    Función para parsear fechas

*/

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

    Función que vuelca el resultado en un csv

*/

const appendResultToCSV = (pageNumber, coverDate, writers, pencilers) => {
    const [coverMonth] = coverDate.split(';');
    const csvData = `${pageNumber};${coverMonth};${writers};${pencilers}\n`;
    fs.appendFileSync('results.csv', csvData);
  };

/*

    Programa inicial

*/

const urlInicial = `${baseUrl}${pageNumber}`
console.log(`Iniciando KRONA`);
console.log(`Extrayendo URL ${urlInicial}`);
fetchData(urlInicial);