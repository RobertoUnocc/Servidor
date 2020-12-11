const jwt= require('jsonwebtoken');

module.exports = (req, res, next) => {

	// autorizacion por el Header
	const authHeader = 	req.get('authorization');

	if(!authHeader){
		const error= new Error('No autenticado,no hay JWT');
		error.statusCode= 401;
		// para q se muestre en pantalla , deja de ejecutarse
		throw error;
	}

	// Obtener el TOken y verificarlo
	// Obtenemos => Authorization: Bearer #token
	const  token = authHeader.split(' ')[1];//separamos el token

	let revisarToken;
	
	try{
		revisarToken = jwt.verify(token, 'LLAVESECRETA');
	}catch(error){
		error.statusCode=500;
		throw error;
	}

	// Si es un token valido pero tiene algun error(expirado)
	if(!revisarToken){
		const error=new Error('No autenticado');
		error.statusCode= 401;
		throw error;
	}

	// SI esta validado todo
	 next();
}
