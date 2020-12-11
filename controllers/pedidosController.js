const Pedidos= require('../models/Pedidos')

// agrega un nuevo Pedido
exports.nuevoPedido = async (req,res,next) => {
	const pedido= new Pedidos(req.body);

	try{
		await pedido.save();
		res.json({
			mensaje : 'Se agrego un nuevo Pedido'
		});

	}catch (error){
		console.log(error)
		next();
	}
}


// muesra todos los pedidos
exports.mostrarPedidos = async (req,res,next) => {
	try{
		// const pedidos= await Pedidos.find({})

		// const pedidos= await Pedidos.find({}).populate('cliente')

		const pedidos= await Pedidos.find({}).populate('cliente').populate({
			path:'pedido.producto',
			model: 'Productos'
		})
		res.json({
			pedidos
		});

	}catch (error){
		console.log(error)
		next();
	}
}
// muestra un Pedido
exports.mostrarPedido = async (req,res,next) => {
	const pedido= await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
			path:'pedido.producto',
			model: 'Productos'
		});

	if(!pedido){
		res.json({
			mensaje: 'Este Pedido no existe'
		})
		next();
	}
	// Mostrar el producto
	res.json(pedido)
}


// Actualiza un Pedido
exports.actualizarPedido  = async (req,res,next) =>{

	try{
		const pedido = await Pedidos.findOneAndUpdate({ _id : req.params.idPedido},
			req.body,{
			new : true
		});

		res.json(pedido);

	}catch(error){
		console.log(error)
		next();
	}
}

// eliminar Pedido
exports.eliminarPedido  = async (req,res,next) =>{
	try{
		 await Pedidos.findOneAndDelete({ _id : req.params.idPedido});

		res.json({
			mensaje: 'El Pedido ha sido eliminado'
		});

	}catch(error){
		console.log(error)
		next();
	}
}