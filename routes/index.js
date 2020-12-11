const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController')
const clienteController = require('../controllers/clienteController')
const productoController = require('../controllers/productoController')
const pedidosController = require('../controllers/pedidosController')
const usuariosController = require('../controllers/usuariosController')

// middleware para proteger las rutas
const auth = require('../middleware/auth');


module.exports = function () {


	// // CATEGORIAS //********
	// router.post('/clientes', clienteController.nuevoCliente);
	// // Obtener todos los clientes
	// router.get('/clientes', clienteController.mostrarClientes);
	// // Mostrar un cliente en especifico (ID)
	// router.get('/clientes/:idCliente', clienteController.mostrarCliente)
	// // Actualizar el Cliente
	// router.put('/clientes/:idCliente', clienteController.actualizarCliente);
	// // Eliminar Cliente
	// router.delete('/clientes/:idCliente', clienteController.eliminarCliente);

	// CATEGORIAS //************************************
	router.post('/categorias', categoriaController.nuevaCategoria);
	// Obtener todos los clientes
	router.get('/categorias', categoriaController.mostrarCategoria);
	router.put('/categorias/:idCategoria', categoriaController.actualizarCategoria);
	// Eliminar Cliente
	router.delete('/categorias/:idCategoria', categoriaController.eliminarCategoria);



	// PRODUCTOS //************************************
	router.post('/productos', productoController.nuevoProducto);

	router.post('/productos/uploadImages', productoController.subirImagen);
	router.delete('/productos/:idImagen', productoController.eliminarImagen);

	router.get('/productos', productoController.mostrarProductos);
	router.get('/productos/:idProducto', productoController.mostrarProducto);
	router.put('/productos/:idProducto', productoController.actualizarProducto);
	router.delete('/productos/:idProducto', productoController.eliminarProducto);
	
	router.post('/productos/busqueda/:query', productoController.buscarProducto); // Busqueda
	// router.put('/productos/:idProducto',
	// 	productoController.subirArchivo,
	// 	productoController.actualizarProducto);

	// Carrito //************************************
	


	// -***** PEDIDOS ************************************* //
	router.post('/pedidos/nuevo/:idUsuario', pedidosController.nuevoPedido);	// agregar Pedido
	router.get('/pedidos', pedidosController.mostrarPedidos);				// ver todos los pedidos
	router.get('/pedidos/:idPedido', pedidosController.mostrarPedido);		// ver pedidos por ID
	router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);  	// Actualziar PEdido
	router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);		// eliminar Pedido



	// *******Usuarios*****************************************
	router.post('/crear-cuenta', usuariosController.registrarUsuario);
	router.post('/iniciar-sesion', usuariosController.autenticarUsuario);

	router.post('/addToCart', usuariosController.addToCart);
	router.post('/removeFromCart', usuariosController.removeFromCart);
	router.get('/userCartInfo/:idUsuario', usuariosController.userCartInfo);

	//******* VALIDAR USUARIOS ***********************************
	router.post('/verificar/:token', usuariosController.verificarToken);
	// ****ADMIN*****
	return router;


}	