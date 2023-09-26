//LOGICA PARA CONSULTAS A LA BD

import { pool } from '../db.js';

//obtengo todos los usuarios
export const getUsuarios = async (req,res)=>{ 
    try {
        const [result] = await pool.query('SELECT * FROM usuarios')
    res.json(result)
    } catch (error) {
        return res.status(500).json({     //uso el try catch para el manejo de errores
            message: 'Algo salio mal'
        })
    }
}

//obtengo el usuario que mando por parametro
export const getUsuario = async (req,res)=>{ 
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuario=?', [req.params.id])
    if(rows.length <= 0){
        return res.status(404).json({
            message: 'Usuario not fount'
        })
    }
    res.json(rows[0])
}
