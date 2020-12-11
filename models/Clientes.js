const mongoose = require('mongoose')

const Schema= mongoose.Schema;

const clientesSchema= new Schema({
	nombre:{
		type: String,
		trim:true
	},
	apellido:{
		type:String,
		trim: true
	},
	telefono:{
		type:String,
		trim: true
	},
	avatar:{
		type:String,
		default:'url'
	},
	usuario:{
		type: Schema.ObjectId,
		ref: 'Usuarios'
	}
});

module.exports = mongoose.model('Clientes',clientesSchema);