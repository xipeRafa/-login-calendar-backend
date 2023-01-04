
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { crearUsuario, usuariosGet } = require('../controllers/register');


const router = Router();

router.post('/', [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ], crearUsuario 
);

router.get('/', usuariosGet );

module.exports = router;