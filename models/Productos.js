const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const productosSchema = new Schema({
	nombre: {
		type: String,
		trim: true
	},
	precio: {
		type: Number
	},
	stock: Number,
	categoria: {
		type: Schema.ObjectId,
		ref: 'Categorias'
	},
	imagen: {
		type: Array
	}

});

module.exports = mongoose.model('Productos', productosSchema);