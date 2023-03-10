const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/generarJWT');
 

const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({ ok: false, msg: 'El usuario no existe con ese email' });
        }
        
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        const validPassword = bcrypt.compareSync( password, usuario.password );     // Confirmar los passwords
        if ( !validPassword ) {
            return res.status(400).json({ ok: false, msg: 'Password incorrecto' });
        }
        const token = await generarJWT( usuario.id, usuario.name ) // Generar JWT

        res.json({ ok: true, uid: usuario.id, name: usuario.name, token})

    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
    }
}


const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;
    console.log('-=-=-=-=-=-=->>>', req.name)
    const token = await generarJWT( uid, name );  // Generar JWT

    res.json({ ok: true, uid, name, token })
}


module.exports = { loginUsuario, revalidarToken }


