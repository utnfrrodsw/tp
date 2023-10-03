//LOGICA PARA CONSULTAS A LA BD

const { pool } = require('../../db.js');
const registrarUsuario = require('./registerController.js');
const login = require('./loginController.js');


//obtengo todos los usuarios
const getUsuarios = async (req,res)=>{ 
    try {
        const [result] = await pool.query('SELECT * FROM usuario')
    res.json(result)
    } catch (error) {
        return res.status(500).json({     //uso el try catch para el manejo de errores
            message: 'Algo salio mal'
        })
    }
}

//obtengo el usuario que mando por parametro
const getUsuario = async (req,res)=>{ 
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email=?', [req.params.email])
    if(rows.length <= 0){
        return res.status(404).json({
            message: 'Usuario not fount'
        })
    }
    res.json(rows[0])
}

const userController = {
    getUsuarios,
    getUsuario,
    registrarUsuario,
    login
}


module.exports = userController; 