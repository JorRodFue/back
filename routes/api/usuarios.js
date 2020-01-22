var express = require('express');
var router = express.Router();
// let accionesDBUsuarios = require("../../accionesDB/accionesDBUsuarios").accionesDB
let usuarioDAO = require('../../DAO/usuarioDAO').usuarioDAO
let jwt = require('jwt-simple')
let bcrypt = require('bcryptjs')
let nodemailer = require('nodemailer')
require("dotenv").config();

let env = process.env

// fetch //403

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log("get en /api/usuarios")

  if (req.query['ID']) {
    console.log("han hecho un get /api/usuarios/" + req.query['ID'])

    usuarioDAO.getByID(req.query['ID'])
      .then(results => res.json(results))
      .catch(err => console.log(errr))
  }

  else {
    usuarioDAO.getAll().then((results) => { res.json(results) })
      .catch((err) => { console.log(err) })
  }
});

router.post('/add', function (req, res, next) {
  usuarioDAO.insertData(req.body)
    .then((results) => { console.log(results) })
    .catch((error) => { console.log(error) })

  res.redirect("/")
});

router.post('/create', (req, res) => {
  usuarioDAO.createUsuariosTable()
    .then((results) => { console.log(results) })
    .catch((error) => { console.log(error) })
  res.redirect("/")

})

router.post('/register', async (req, res) => {
  let users
  console.log("/post en register")
  usuarioDAO.getByEmail(req.body.email)
    .then((results) => {
      console.log("usuarios con ese email : ", results.length)
      if (results.length > 0) {

        if (results[0].activado == false) { res.json({ exito: false, mensaje: "El usuario necesita activarse, compruebe su correo", unactive: true, userID: results[0].ID }) }

        else {
          console.log("Email repetido")
          res.json({ exito: false, email_existente: true, mensaje: "No es posible registrarse con ese email" })
        }
      }
      else usuarioDAO.getByUsername(req.body.username)
        .then((users) => {
          if (users.length > 0) {
            console.log("Nickname repetido")
            res.json({ exito: false, username_existente: true, mensaje: "No es posible registrarse con ese usuario" })
          }
          else {
            usuarioDAO.registrarUsuario(req.body)
              .then((result) => {
                console.log("registrado")
                let token = generarToken(result.insertId)
                enviarGmail(req.body.email, token, result.insertId)
                console.log("enviado gmail " + req.body.email, token, result.insertId)
                res.json({ exito: true, contenido: result, mensaje: "Se ha enviado un mensaje a su correo electronico para activar su cuenta" })
              })
              .catch((error) => {
                console.log("no registrado", error)
                res.json({ exito: false, contenido: error })
              })
          }
        }).catch((error) => {
          console.log(error)
          res.json({ exito: false, contenido: error })
        })
    })

    .catch((error) => { res.json({ exito: false, contenido: error }) })

})



router.post('/login', (req, res) => {
  console.log("login post request")
  usuarioDAO.getByEmail(req.body.email)
    .then((results) => {
      if (results.length != 1) {
        console.log("no se encuentra el usuario (o hay mas de uno, que mal)")
        res.json({ exito: false, mensaje: "usuario y/o contraseña incorrectos" })
      }
      else if (results[0] && bcrypt.compareSync(req.body.password, results[0].password)) {
        console.log("login matches!", results[0].email)
        if (!results[0].activado) res.json({ exito: false, mensaje: "Por favor, active su cuenta para continuar", unactive: true, userID: results[0].ID })
        let token = generarToken(results[0].ID)
        res.json({ exito: true, token: token, user: { username: results[0].username, ID: results[0].ID } })
      }
    })
    .catch((error) => {
      console.log(error)
      res.json({ exito: false })
    })
})

router.get('/activation', async (req, res) => {
  console.log("activation")
  let mensaje = "mail de activacion" //?loquesea&loquesea2
  console.log("ha llegado una peticion get a activation con token " + req.query['token'] + " e ID " + req.query['id'])
  try {
    console.log("vamos a detokenizarlo")
    jwt.decode(req.query['token'], env.TOKEN_KEY) //esto mejor con el .ENV y eso
    usuarioDAO.updateFieldById(req.query['id'], "activado", true) //preguntar a MARIO por req.query y el try catch
      .then(async (result) => {
        console.log(result)
        let result2 = await usuarioDAO.getByID(req.query['id'])
        mensaje = "EXITO en la activacion para el usuario " + result2[0].username
      }).catch((err) => {
        console.log(err)
        mensaje = "fracaso en la activacion"
      }).finally(() => { res.render("exito.pug", { mensaje }) })
  } //token y la clave de codificaion
  catch (err) {
    console.log(err)
    if (err) res.render("exito", { mensaje: "ERROR No se ha podido activar la cuenta" })
  }
})

router.post('/reenviarMail', (req, res) => {
  console.log(req.body)
  let token = generarToken(req.body.ID)
  enviarGmail(req.body.email, token, req.body.ID)
  res.json({ mensaje: "email de activación reenviado, revise su correo" })

})




function generarToken(usuario) {

  token = jwt.encode({
    userId: usuario.ID,
    createdAt: null,
    expiresAt: null
  }, env.TOKEN_KEY)
  return token
}

function mandarEmail(email = "frtldrdhl@yahoo.es", token) {
  const mailgun = require("mailgun-js");

  const DOMAIN = "https://api.mailgun.net/v3/sandboxc61e87a07dff4d71b889dcf69b1e2165.mailgun.org";
  const mg = mailgun({ apiKey: "d0b05d8ff32b6980d135de15b7161280-5645b1f9-5c463e11", domain: DOMAIN });
  const data = {
    from: "Mailgun Sandbox <postmaster@sandboxc61e87a07dff4d71b889dcf69b1e2165.mailgun.org>",
    to: email,
    subject: "Hello",
    text: "Testing some Mailgun awesomness!"
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

}



function enviarGmail(email, token, id) {// create reusable transporter object using the default SMTP transport
  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail', // sets automatically host, port and connection security settings
    auth: {
      user: "proyectoNeoland",
      pass: env.GOOGLE_PASS
    }
  });  // setup email data with unicode symbols
  var mailOptions = {
    from: "proyectoNeoland", // sender address
    to: email, // list of receivers
    subject: "Activación de su cuenta", // Subject line
    text: "Muchas gracias por registrarse en proyectoNeoland. Por favor siga el siguiente enlace para activar su cuenta", // plain text body
    html: `<a href="http://localhost:3000/api/usuarios/activation?token=${token}&id=${id}">siga este enlace para registrarse</a>`  // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending mail: ' + error);
    } else {
      console.log('Message sent: %s', info.messageId);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages.
  });
}





module.exports = router;
