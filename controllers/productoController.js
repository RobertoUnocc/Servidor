const Productos= require('../models/Productos')
// IMG
const multer = require('multer');
const shortid= require('shortid');

const configuracionMulter = {
	storage : fileStorage = multer.diskStorage({
		destination : (req,file,cb) =>{
			cb(null, __dirname+'../../uploads/');
		},
		filename : (req,file,cb) => {
			const extension = file.mimetype.split('/')[1];
			cb(null, `${shortid.generate()}.${extension}`);
		}
	}),
	fileFilter(req,file,cb) {
		if(file.mimetype ===  'image/jpeg' ||  file.mimetype==='image.png'){
			cb(null, true)
		}else{
			cb(new Error('Formato no Válido'))
		}
	}
}

//pasar la configuracion y el campo
// image es el campo del Modelo
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo
exports.subirImagen = (req,res,next) => {
	upload(req,res, function(error){

		if(error) {
			res.json({
				mensaje:error,
				success:false
			})
			// return next();
		}
		else{
			return res.json({ success: true,fileName: res.req.file.filename })
		}
		next()

	})
}
// , image: res.req.file.path, fileName: res.req.file.filename 


// agrega un nuevo Cliente
exports.nuevoProducto = async (req,res,next) => {
	const Producto= new Productos(req.body);

	try{

		// verificar si hay un producto subido

		// if(req.file.filename){
		// 	Producto.imagen = req.file.filename
		// }

		await Producto.save();
		res.json({
			mensaje : 'Se agrego un nuevo Producto'
		});

	}catch (error){
		console.log(error)
		next();
	}
}


// muesra todos los productos
exports.mostrarProductos = async (req,res,next) => {
	try{
		const Producto= await Productos.find({})
		res.json({
			Producto
		});

	}catch (error){
		console.log(error)
		next();
	}
}


// muestra Producto id
exports.mostrarProducto = async (req,res,next) => {
	const producto= await Productos.findById(req.params.idProducto);

	if(!producto){
		res.json({
			mensaje: 'Ese producto no existe'
		})
		next();
	}
	// Mostrar el producto
	res.json(producto)

}

exports.actualizarProducto  = async (req,res,next) =>{

	try{
		
		// construir un nuevo Producto
		let nuevoProducto = req.body;

		// verificar si hay una imagen nueva subida
		if (req.file) {
			nuevoProducto.imagen = req.file.filename;
		} else {
			let productoAnterior = await Productos.findById(req.params.idProducto);
			// si no subiste una imagen
			nuevoProducto.imagen = productoAnterior.imagen;
		}


		// actualizamos
		let producto = await Productos.findOneAndUpdate({ _id : req.params.idProducto},
			nuevoProducto,{
				new : true
			});

		res.json(producto);

	}catch(error){
		console.log(error)
		next();
	}
}


exports.eliminarProducto  = async (req,res,next) =>{
	try{
		await Productos.findOneAndDelete({ _id : req.params.idProducto});

		res.json({
			mensaje: 'El Producto ha sido eliminado'
		});

	}catch(error){
		console.log(error)
		next();
	}
}

//Busqueda de Productos
exports.buscarProducto = async (req,res,next) => {
	try{
		// Obtener el Query
		const {query} = req.params;
		const producto = await Productos.find({ nombre: new RegExp(query, 'i') });
		res.json(producto)
	}catch (error){
		console.log(error)
		next();
	}
}


exports.eliminarImagen  = async (req,res,next) =>{
	const imagen=req.params.idImagen;
	console.log(imagen)
	if(imagen){
		var fs = require('fs'); 
		fs.unlink( __dirname+'../../uploads/'+imagen,error=>{
			if(error){
				console.log("Imagen no encontrada");
				next();
			}else{
				res.json({
					mensaje:'Imagen Eliminado'
				})
			}
		})
		
	}
	else{
		console.log("Seleccione una imagen")
		next()
	}	
}

