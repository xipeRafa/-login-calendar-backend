
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/generarJWT');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 50, desde = 0 } = req.query;
    const query = { state : true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite )) 
    ]);

    res.json({
        total,
        usuarios
    });
}

const crearUsuario = async(req, res = response ) => {

    const { email, password } = req.body; // obtenemos el body

    try {
        let usuario = await Usuario.findOne({ email }); // validar si existe usuario
        if ( usuario ) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
        }

        usuario = new Usuario( req.body );
        const salt = bcrypt.genSaltSync(); // Encriptar contraseña

        usuario.password = bcrypt.hashSync( password, salt );
        await usuario.save();

        const token = await generarJWT( usuario.id, usuario.name );   // Generar JWT
    
        res.status(201).json({ ok: true, uid: usuario.id, name: usuario.name, token })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
    }
}

module.exports = { crearUsuario, usuariosGet }


