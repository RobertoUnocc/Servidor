const mongoose = require('mongoose')

const Schema= mongoose.Schema;

const pedidosSchema= new Schema({
	usuarios: {
		type: Schema.ObjectId,
		ref: 'Usuarios'
	},

	pedido: [{
		producto :{
			type: Schema.ObjectId,
			ref: 'Productos'
		},
		cantidad:Number,
	}],
	total : {
		type: Number,
	},
	estado:String,
	fecha:Date
})	

// fecha => const fecha = new Date(Number(pedidos.fecha));

module.exports = mongoose.model('Pedidos', pedidosSchema);