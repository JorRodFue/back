//capa intermediaria que YA devuelve resultados, al resolver promesas de la capa BD , y ademas realiza peticiones HTTP para crear la base de datos y hacer testeos durante el desarrollo

const axios = require('axios').default
const fs = require('fs')
const cheerio = require('cheerio')
let arrayCameras = []

let frecuenciaPeticiones1 = 888
let frecuenciaPeticiones2 = 288

// let brokenLinks = [require("../DATA/monumentos.json")]

let urlPrueba = "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=ca9671ee4a9eb410VgnVCM100000171f5a0aRCRD&vgnextoid=6e059659c34fe610VgnVCM1000001d4a900aRCRD"

require("dotenv").config();
let env = process.env
let googleKey = env.googleKey
let googleStreetKey = env.googleStreetKey

// scrapearWeb(urlPrueba)
// crearArrayCameras()



let eventoDAO = require("../DAO/eventoDAO").eventoDAO
eventoDAO.getByID(3421).then(async (results) => {
    if (results) {
        console.log(results)
        let direccion = results.direccionScrap
        geocoding(direccion).then((result) => { console.log(result.data.results[0].geometry.location) })
    }

}).catch(err => console.log(err))


let corsPrefix = "https://cors-anywhere.herokuapp.com/"
let arrayJsons = [
    { url: "https://datos.madrid.es/egob/catalogo/206717-0-agenda-eventos-bibliotecas.json", supertipo: "Actividades gratuitas en Bibliotecas Municipales en los próximos 60 días", lugar: false, brokenLik: false },
    { url: "https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json", superindex: 1, supertipo: "Actividades Culturales y de Ocio Municipal en los próximos 100 días", lugar: false, brokenLink: false },
    { url: "https://datos.madrid.es/egob/catalogo/212504-0-agenda-actividades-deportes.json", superindex: 2, supertipo: "Agenda de actividades deportivas", lugar: false },
    { url: "https://datos.madrid.es/egob/catalogo/300107-0-agenda-actividades-eventos.json", supertipo: "Agenda de actividades y eventos", lugar: false },
    { url: "https://datos.madrid.es/egob/catalogo/205026-0-cementerios.json", superindex: 4, supertipo: "Cementerios", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/200304-0-centros-culturales.json", supertipo: "Centros Culturales Municipales (incluyen Socioculturales y Juveniles)", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/205732-0-centros-sin-hogar.json", superindex: 6, supertipo: "Centro para personas sin hogar", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/216619-0-wifi-municipal.json", superindex: 7, supertipo: "Instalaciones municipales con zonas wifi gratuitas", lugar: true },


    { url: "https://datos.madrid.es/egob/catalogo/209434-0-templos-otros.json", superindex: 8, supertipo: "Templos e iglesias no católicas", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/217921-0-salas-estudio.json", superindex: 9, supertipo: "Salas de estudio y lectura", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/201747-0-bibliobuses-bibliotecas.json", superindex: 10, supertipo: "Bibliotecas de la ciudad de Madrid", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/200761-0-parques-jardines.json", superindex: 11, supertipo: "Principales parques y jardines municipales", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/300261-0-agenda-proximas-carreras.json", supertipo: "Próximas carreras urbanas", lugar: false, hibrido: true },

    { url: "https://datos.madrid.es/egob/catalogo/205736-0-atencion-mujeres.json", superindex: 13, supertipo: "Puntos de atención a mujeres", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/201105-0-informacion-turismo.json", superindex: 14, supertipo: "Puntos de información turística", lugar: true },
    { url: "https://datos.madrid.es/egob/catalogo/201132-0-museos.json", superindex: 15, supertipo: "Museos de la ciudad de Madrid", lugar: true, hibrido: true },
    { url: "https://datos.madrid.es/egob/catalogo/300356-0-monumentos-ciudad-madrid.json", superindex: 16, supertipo: "Monumentos de la ciudad de Madrid", lugar: true, brokenLink: true },
    { url: "https://datos.madrid.es/egob/catalogo/209426-0-templos-catolicas.json", superindex: 17, supertipo: "Templos e iglesias católicas", lugar: true }




]








let arrayJsonsMalos = [
    // { url: "https://datos.madrid.es/egob/catalogo/205244-0-infancia-familia-adolescentes.json", supertipo: "Centros de Atención para Menores y Familia", lugar: true },
    // ,


]








// este , arreglado en local
// { url: "https://datos.madrid.es/egob/catalogo/205244-0-infancia-familia-adolescentes.json", supertipo: "Centros de Atención para Menores y Familia", lugar: true },






let accionesDB = {
    rellenarDB() {


        for (const [index, json] of arrayJsons.entries()) {
            // hecho asi para que pase el index
            // if (!json.brokenLink) 
            this.getData(json.url)
                .then((results) => {
                    this.insertarDB(results.data['@graph'], index, json)
                    console.log("datos de url recogidos ", json.url)
                })
                .catch((error) => { console.log(error) })
        }

        crearArrayCameras()
    },

    getData(url) {
        //esta funcion recupera datos de una url (PROMESA)
        return axios.get(url)
    }
    ,
    insertarDB(arrayDatos, index = 0, json = null) {//esta funcion llamo a la (promesa con) los datos y lso inserta en la base de datos


        // if (json.supertipo === "Centros de Atención para Menores y Familia") datos = pepe
        // guardarContenidoEnArchivo(results "datos.txt")
        if (arrayDatos) console.log("tamaño de array de datos: ", arrayDatos.length)
        for (const dato of arrayDatos) {
            let objeto = datoAObjeto(dato, index, json)
            // console.log("voy a insertar ", objeto)

            eventoDAO.insertData(objeto)
                .then(async (result) => { })

                .catch((error) => { console.log(error) })



        }//termina el for

    }
    ,
    truncateDB() {
        eventoDAO.truncate().then((results) => {
            console.log(results)
            return results
        }).catch((err) => {
            console.log(err)
            return (err)
        })
    },
    createDB() {
        eventoDAO.createEventosDB().then((results) => {
            console.log(results)
            return results
        }).catch((err) => {
            console.log(err)
            return (err)
        })
    }
    , hacerScrapeo() {
        eventoDAO.getByField("scrapeado", false)
            .then((eventos => {
                console.log("recuperados eventos para scrapear c:  ", eventos.length)
                //NECESITO ESCRAPEAR VARIOS MILES DE PAGINAS; ME BLOQUEA Y DA ERROR 403 ; SOLUCIONES ELEGANTES?
                //TIMEOUT Y SALIR CON PROXY E IR ROTANDOLOS

                // SALIR POR TOR
                let i = 0;
                let peticionesLentas = setInterval(hacerCosasSinAnsia, frecuenciaPeticiones1)
                function hacerCosasSinAnsia() {
                    let eventoScrap = eventos[i]
                    let enlaceScrap



                    if (eventoScrap && eventoScrap.link) enlaceScrap = eventoScrap.link
                    else if (eventoScrap && eventoScrap.relation) enlaceScrap = eventoScrap.relation



                    if (enlaceScrap) scrapearWeb(enlaceScrap, eventoScrap).then(async (scrapPromise) => {

                        console.log("ACTUALIZAMOS EVENTO " + eventoScrap.ID)

                        arrayObjetos = [
                            { field: "imagen", valor: scrapPromise.imagen },
                            {
                                field: "direccionScrap", valor: (scrapPromise.direccionScrap) ? scrapPromise.direccionScrap.replace(/  +/g, ' ').replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim()
                                    : null
                            },

                            { field: "barrioScrap", valor: (scrapPromise.barrioScrap) ? scrapPromise.barrioScrap.replace(/  +/g, ' ').replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim() : null },
                            { field: "scrapeado", valor: 1 },
                            { field: "imagenSecundariaScrap", valor: scrapPromise.imagenSecundariaScrap },
                            { field: "descripcionScrap", valor: scrapPromise.descripcionScrap }]

                        eventoDAO.updateAnyFieldsById(eventoScrap.ID, arrayObjetos)
                            .then((res) => { console.log("EXITO CON EL SCRAPEO") })
                            .catch((err) => { console.log(err) })
                    })
                        .catch((error) => {
                            guardarContenidoEnArchivo(error)
                            console.log(error)
                        })
                    if (i < eventos.length) i++
                    else clearInterval(peticionesLentas)
                }


            }



            ))
            .catch((error) => { console.log(error) })
    }
    ,

    hacerGeocoding() {
        eventoDAO.getNull("latitude").then((eventos) => {

            console.log("hay eventos con latidue nulla", eventos.length)
            for (const evento of eventos) {

                let direccion = (evento.direccionScrap && evento.direccionScrap != "fallido") ? evento.direccionScrap : (evento.direccion) ? evento.direccion : null

                if (direccion) geocoding(direccion).then(async (results) => {
                    if (results.data.results[0]) {
                        let lat = results.data.results[0].geometry.location.lat
                        let lng = results.data.results[0].geometry.location.lng
                        await eventoDAO.updateAnyFieldsById(evento.ID, [{ "field": "latitude", "valor": lat }, { "field": "longitude", "valor": lng }])
                    }
                }


                )
            }

        })
    },

    hacerGeocodingInverso() {
        eventoDAO.getByField("direccionGeocoding", "")
            .then((eventos) => {
                console.log("recuperados eventos para geoloc:  ", eventos.length)
                let j = 0;
                let peticionesLentas2 = setInterval(hacerCosasSinAnsia2, frecuenciaPeticiones2)

                function hacerCosasSinAnsia2() {

                    let evento = eventos[j]

                    if (evento && evento.latitude) {

                        reverseGeoCoding(evento.latitude, evento.longitude).then(async (results) => {
                            if (results && results.data && results.data.results[0]) {
                                let direccion = results.data.results[0].formatted_address.replace(/[^\w\s]/gi, '')

                                eventoDAO.updateFieldById(evento.ID, "direccionGeocoding", direccion)
                                    .then((res) => { console.log("geocoding insertado bien") })
                                    .catch((err) => { console.log(err) })
                            }
                        })
                            .catch((error) => { console.log(error) })
                    }
                    else console.log("evento sin latitud, paso al siguiente , voy por el", j)

                    if (j < eventos.length) j++
                    else clearInterval(peticionesLentas2)
                }
            })

    }
}




function scrapearWeb(url = "", evento = null, log = false) {
    let prom = new Promise((resolve, reject) => {
        axios.get(url)
            // tor.get(url)
            .then((response) => {
                let direccionScrap = null
                let barrioScrap = null
                let descripcionScrap = null
                let imageScrap = null
                let imagenSecundariaScrap = null
                const $ = cheerio.load(response.data)
                let urlsalida = ""
                // let corsurl = "https://cors-anywhere.herokuapp.com/"
                if (url.includes("madrid.es")) urlsalida = "https://www.madrid.es"
                if (url.includes("patrimonioypaisaje")) {
                    let monumentos = true;
                    urlsalida = "https://patrimonioypaisaje.madrid.es/"
                }

                if ($(".carouselNoticia-link")[0]) imagenSecundariaScrap = urlsalida + $(".carouselNoticia-link")[0].attribs.href + " " + urlsalida +
                    $(".carouselNoticia-link")[1] ? $(".carouselNoticia-link")[1].attribs.href + " " + urlsalida : ("")
                        +
                        $(".carouselNoticia-link")[2] ? $(".carouselNoticia-link")[2].attribs.href : ("")

                console.log(imagenSecundariaScrap)


                // guardarContenidoEnArchivo(response.data, "volcado")
                console.log("se va a escrapear : " + url)
                // if (log) console.log(direccion = $('dl.adr').children()[1].children[0].data)

                if ($(".tiny-text") && ($(".tiny-text")['0']) && $(".tiny-text").children()[0]) {
                    console.log("se ha cogido descripcionScrap")
                    let descripcionScrap = ""
                    let i = 0
                    // console.log($(".tiny-text").children()[0])
                    while ($(".tiny-text").children()[i] && $(".tiny-text").children()[i].children[0] && $(".tiny-text").children()[i].children[0].type == "text") {
                        // console.log($(".tiny-text").children()[i.toString()].children[0].data)
                        descripcionScrap += $(".tiny-text").children()[i].children[0].data + "\n"
                        i++
                    }
                    console.log(descripcionScrap)

                }


                if ($('.adr') && $('.adr')['0']) {
                    direccionScrap = $('dl.adr').children()[1].children[0].data
                    barrioScrap = ($('.adr').children().length) > 2 ? $('.adr').children()[$('.adr').children().length - 1].children[0].data : "no viene"

                }
                if ($('.image-content') && $('.image-content').children()[0]) {
                    console.log("cogemos la imagen del image-content")
                    imageScrap = urlsalida + $('.image-content').children()[0].attribs.src
                }

                else if (evento) {
                    imageScrap = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${evento.latitude},${evento.longitude}&fov=80&heading=70&pitch=0&key=${googleStreetKey}`
                    // else if ($('.section-image')['0'] && $('.section-image')['0'].attribs) {
                    // resolve({ imagen: urlsalida + $('#section-image')['0'].attribs.src, url: url, direccionScrap: direccionScrap, barrioScrap: barrioScrap, imagenSecundariaScrap: imagenSecundariaScrap })
                    console.log("imagen por google maps")
                }
                resolve({ imagen: imageScrap, url: url, direccionScrap: direccionScrap, barrioScrap: barrioScrap, imagenSecundariaScrap: imagenSecundariaScrap, descripcionScrap: descripcionScrap })
                // console.log("resolvemos via '.section-image' : " + urlsalida + $('#section-image')['0'].attribs.src)
            }
                //  
                // else {
                //     console.log("NO COGEMOS LA IMAGEN")
                //     guardarContenidoEnArchivo(response.data, "scrapeoFallido")
                //     resolve({ imagen: null, direccionScrap: $('.adr').children()[1].children[0].data, barrioScrap: barrioScrap })
                // }

            )
            .catch((err) => {
                console.log("error axios scrapeando : ", url, (err.response) ? err.response.data : err)
                err.imagen = null
                err.direccionScrap = null
                err.barrioScrap = null

                guardarContenidoEnArchivo(err.response)
            })

    })
    return prom
}



async function geoCoding1500(lat, long) {


    var apikey = '17f759590cd74a19b49e19b2ca1df863';
    var latitude = `'${lat}'`;
    var longitude = `'${long}'`;

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';

    return axios.get(request_url)

}

function reverseGeoCoding(lat, long) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleKey}`
    return axios.get(url)
}
// 

function geocoding(direccion) {

    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion + "&key=" + googleKey


    // url = url.replace(/\s/g, '');
    console.log(url)

    return axios.get(url)
}





reverseGeoCoding(40.3775, -3.75477).then(results => console.log(

    results.data.results[0].formatted_address,
    results.data.results[0].address_components[6].long_name))


function guardarContenidoEnArchivo(contenido, archivo = "errores") {
    fs.appendFileSync(`../${archivo}.log`, contenido + "\n")
}
// let datos = require('../monumentos.js')
// accionesDB.insertarDB(datos)

function crearArrayCameras() {

    const parser = require('fast-xml-parser')
    // const terminalImage = require('terminal-image');
    const got = require('got');

    let url = "https://datos.madrid.es/egob/catalogo/202088-0-trafico-camaras.kml"
    axios.get(url).then((results) => {
        console.log("insertando camaeras")
        let data = parser.parse(results.data)

        for (const dato of data.kml.Document.Placemark) {
            let objeto = {}
            let coordinates = dato.Point.coordinates
            objeto.location = { latitude: coordinates.split(",")[1], longitude: coordinates.split(",")[0] }

            let cameraID = dato.ExtendedData.Data[0].Value.toString()
            objeto.imagen = `http://informo.munimadrid.es/cameras/Camara${cameraID.padStart(5, "0")}.jpg`
            objeto.address = { "street-address": dato.ExtendedData.Data[1].Value }
            objeto.title = "Cámara " + cameraID + " " + dato.ExtendedData.Data[1].Value
            arrayCameras.push(objeto)
        }

    }).then(() => {
        // console.log(arrayCameras)
        accionesDB.insertarDB(arrayCameras, index = 99, json = { superindex: 99, supertipo: "Camaras" })

    })
        .catch((error) => { console.log("error al insertar camaras", error) })

}
function datoAObjeto(dato, index = null, json = null) {
    let objeto = {
        nombre: (dato['title']) ? dato['title'] : null,
        superindex: (json) ? json.superindex : null,
        supertipo: (json) ? json.supertipo : null,
        tipo: (dato['@type']) ? dato['@type'] : null,
        ubicacion: (dato['event-location']) ? dato['event-location'] : null,
        distrito: (dato['address']) && dato['address']['district'] ? dato['address']['district']['@id'] : null,
        area: (dato['address']) && (dato['address']['area']) ? dato['address']['area']['@id'] : null,
        // objetos de profundidad 3 sin for in object keys
        latitude: (dato.location) ? dato['location']['latitude'] : null,
        longitude: (dato.location) ? dato['location']['longitude'] : null,
        direccion: (dato['address']) && (dato['address']['street-address']) ? dato['address']['street-address'] : null,
        direccionScrap: null,
        direccionGeocoding: "",
        barrioScrap: null,
        codigoPostal: (dato['address']) && (dato['address']['postal-code']) ? dato['address']['postal-code'] : null,
        codigoPostalGeocoding: null,
        descripcion: (dato['description']) ? dato['description'] : null,
        descripcionScrap: null,
        ogranization_desc: (dato['organization'] && dato['organization']['desc']) ? dato['organization']['desc'] : null,
        audience: (dato['audience']) ? dato['audience'] : null,
        MadridID: (dato['id']) ? dato['id'] : null,
        fecha_inicio: (dato['dtstart']) ? dato['dtstart'] : null,
        fecha_final: (dato['dtend']) ? dato['dtend'] : null,
        dia: (dato['recurrence']) ? (dato['recurrence']['days']) : null,
        excepto_dias: dato["excluded-days"] ? dato["excluded-days"] : null,
        frecuencia: (dato['recurrence']) ? dato['recurrence']['frequency'] : null,
        link: (dato['link']) ? (dato['link']) : null,
        relation: (dato['relation']) ? (dato['relation']) : null,
        imagen: (dato.imagen) ? dato.imagen : null,
        imagenSecundariaScrap: null,
        duplicado: false,
        scrapeado: false,
        lugar: (json) ? json.lugar : null
    }
    return objeto
}








module.exports = { accionesDB: accionesDB }