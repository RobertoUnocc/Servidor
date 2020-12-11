const Usuarios = require('../models/Usuarios');
const Productos= require('../models/Productos');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
	const usuario = new Usuarios(req.body);
	usuario.password = await bcrypt.hash(req.body.password, 12);

	try {
		await usuario.save();
		res.json({ mensaje: 'Usuario creado correctamente' });
	} catch (error) {
		res.json({ mensaje: 'Hubo un error', error });
	}
}

exports.autenticarUsuario = async (req, res, next) => {
	// Buscar usuario
	const usuario = await Usuarios.findOne({ email: req.body.email })

	if (!usuario) {
		// Si el usuario no existe
		// 401 => no estas autorizado
		await res.status(401).json({ mensaje: 'Este usuario no existe' })
		next();
	} else {
		// Si el usuario existe, verificar el password
		if (!bcrypt.compareSync(req.body.password, usuario.password)) {
			// Si el password es incorrecto
			await res.status(401).json({ mensaje: 'Password Incorrecto' });
			next();
		} else {
			// PAssword correcto, firmar el Token
			const token = jwt.sign({
				role: usuario.role,
				email: usuario.email,
				nombre: usuario.nombre,
				id: usuario._id
			}, 'LLAVESECRETA', { expiresIn: '3h' });

			//120ms  2h  365d
			// Retornar el Token
			res.json({ token });
		}
	}

}


exports.verificarToken = async (req, res, next) => {
	const tok = req.params.token;
	// const tok=req.body.token;
	if (tok) {
		// var decoded = jwt.decode(tok, {complete: true});
		// console.log(decoded.header);
		// console.log(decoded.payload)
		// console.log(decoded.payload.exp)

		try {
			var decoded = jwt.verify(tok, 'LLAVESECRETA');
			// console.log(decoded)
			res.json({
				mensaje: decoded
			});
		} catch (err) {

			// console.log(err);
			res.json({
				mensaje: false
			});
		}

		// 
	} else {
		res.send({
			mensaje: false
		});
		next();
	}
}


exports.addToCart = async (req, res) => {

	console.log(req.body)
	try {
		let duplicate = false;

		const usuario = await Usuarios.findById(req.body.id);
		usuario.cart.forEach((item) => {
			if (item.id == req.body.productId) {
				duplicate = true;
			}
		})
		// if(duplicate) return res.status(200).json("El producto ya se encuentra añadida al carrito");
		// ************************************************************************************
		if (duplicate) {
			const userInfo = await Usuarios.findOneAndUpdate(
				{ _id: req.body.id, "cart.id": req.body.productId },
				{
					$set:
					{
						"cart.$.quantity": req.body.cantidad,
					}
				},
				{ new: true }
			)
			console.log("update", userInfo)
			return res.status(200).json(userInfo.cart);


		} else {
			const userInfo = await Usuarios.findOneAndUpdate(
				{ _id: req.body.id },
				{
					$push: {
						cart: {
							id: req.body.productId,
							quantity: req.body.cantidad
						}
					}
				},
				{ new: true },
			);
			return res.status(200).json(userInfo.cart);
		}

	} catch (error) {
		console.log(error)
		return res.json({ success: false, error });

	}
}

exports.removeFromCart = async (req, res) => {

	try {
		const userCart = await Usuarios.findOneAndUpdate(
			{ _id: req.body.id },
			{
				"$pull":
					{ "cart": { "id": req.body.cart_id } }
			},
			{ new: true }
		)
		return res.status(200).json(userCart);
	} catch (error) {
		console.log(error)
		return res.json({ success: false, error });
	}
}

exports.userCartInfo = async (req, res) => {
	try {
		const usuario = await Usuarios.findById(
			{ _id: req.params.idUsuario },		
		).populate({
			path: 'cart.id',
			model: 'Productos'
		})
		// const pedidos = await Pedidos.find({}).populate('cliente').populate({
		// 	path: 'pedido.producto',
		// 	model: 'Productos'
		// })
		res.json({
			"carrito":usuario.cart
		});

	} catch (error) {
		res.json({error})
	}

}



// ************************
// ************************
/*
router.get('/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        console.log(userInfo)

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })


        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});


router.get('/removeFromCart', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })
        }
    )
})


router.get('/userCartInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })


            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, cartDetail, cart })
                })

        }
    )
})
*/