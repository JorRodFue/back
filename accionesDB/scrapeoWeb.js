const axios = require('axios').default
const fs = require('fs')
const cheerio = require('cheerio')
require("dotenv").config();
let env = process.env
let googleKey = env.googleKey
let googleStreetKey = env.googleStreetKey


let funcionesScrapeo = {


    scrapearWeb(url = "", evento = null, log = false, test = false) {
        let prom = new Promise((resolve, reject) => {
            axios.get(url)
                // tor.get(url)
                .then((response) => {
                    //inicializamos las variables a null para su inserción en DataBase
                    let direccionScrap = null
                    let barrioScrap = null
                    let descripcionScrap = null
                    let imageScrap = null
                    let imagenSecundariaScrap = null
                    const $ = cheerio.load(response.data)
                    if (test) console.log($("image-content"))

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

                    console.log("image secundariaScrap : ", imagenSecundariaScrap)


                    if (log) guardarContenidoEnArchivo(response.data, "volcadoScrap")
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
                        // console.log(descripcionScrap)

                    }

                    if ($('.adr') && $('.adr')['0']) {

                        direccionScrap = $('dl.adr').children()[1] ? $('dl.adr').children()[1].children[0].data : null
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

                    this.guardarContenidoEnArchivo(err.response.data)
                })
        })
        return prom
    }
    ,

    guardarContenidoEnArchivo(contenido, archivo = "errores") {
        fs.appendFileSync(`../${archivo}.log`, "\n" + contenido + "\n")
    }



}


module.exports = funcionesScrapeo