const Categorias= require('../models/Categorias')

// agrega un nuevo Cliente
exports.nuevaCategoria = async (req,res,next) => {
	const Categoria= new Categorias(req.body);

	try{
		await Categoria.save();
		res.json({
			mensaje : 'Se agrego una categoría'
		});

	}catch (error){
		// para ver el error en el cliente => Swal / alert 
		res.send(error);
		//console.log(error)
		next();
	}
}

exports.mostrarCategoria  = async (req,res,next) => {

	try{
		const categorias= await Categorias.find({})
		res.json({
			categorias
		});

	}catch (error){
		console.log(error)
		next();
	}
}




exports.actualizarCategoria  = async (req,res,next) =>{

	try{
		const categoria = await Categorias.findOneAndUpdate({ _id : req.params.idCategoria},
			req.body,{
				new : true
			});

		res.json(categoria);

	}catch(error){
		// para ver el error en el cliente
		res.send(error);
		//console.log(error)
		next();
	}
}

exports.eliminarCategoria  = async (req,res,next) =>{
	try{
		await Categorias.findOneAndDelete({ _id : req.params.idCategoria});

		res.json({
			mensaje: 'La categoria se ha sido eliminado'
		});

	}catch(error){
		console.log(error)
		next();
	}
}