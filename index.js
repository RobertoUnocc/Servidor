const express= require('express');
const router= require('./routes/');
const mongoose= require('mongoose');
const cors = require('cors');

// conectar Mongo
// mongodb+srv://carloss1452:carloss1452@cluster0-czb1m.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://carloss:<password>@cluster0-a08aa.mongodb.net/test?retryWrites=true&w=majority
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ecoomerce',{
	useNewUrlParser: true
});



// crear servidor
const app= express();

// habilitar lectura del cuerpo
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// CROS => permiten q un servidor seha consumida por un cliente ya q usan
// puertos diferente
app.use(cors())


// Rutas de la App
app.use('/', router() );

// Para poder ver las imagenes en el CLiente
app.use(express.static('uploads'));


// Puerto
app.listen(5000, () => {
  console.log(`Corriendo en el puerto 5000`)
});

