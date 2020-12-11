const mongoose = require('mongoose')

const Schema= mongoose.Schema;

const categoriasSchema= new Schema({
	categoria:{
		type: String,
		trim:true
	}
});

module.exports = mongoose.model('categorias',categoriasSchema);