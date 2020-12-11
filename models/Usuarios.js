const mongoose = require('mongoose')

const Schema= mongoose.Schema;

const usuariosSchema= new Schema({
	username:{
		type:String,
		required:[true,"Escoga un nombre de usuario"],
		trim:true
	},
	email : {
		type: String,
		unique: true,
		lowercase: true,
		trim: true
	},
	password :{
		type: String,
		required:true
	},
	role:{
		type: Number,
		default:3
	},
	cart:{
		type:Array,
		default:[]
	}
})

module.exports = mongoose.model('Usuarios',usuariosSchema);
