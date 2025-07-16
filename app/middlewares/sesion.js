import jwt from 'jsonwebtoken';
import { SECRET_KEY_JWT } from '../config/config.js'; // Asegúrate de tener la clave secreta para verificar el token

export const sesionMid = (req, res, next) => {
    const token = req.cookies.access_token; // Obtenemos el token de las cookies

    if (!token) {
        req.user = null; // Si no hay token, el usuario está no autenticado
        return next(); // Continuamos con la siguiente función middleware
    }

    try {
        // Verificamos el token y extraemos la información del usuario
        const data = jwt.verify(token, SECRET_KEY_JWT);
        req.user = data; // Guardamos la información del usuario en req.user
    } catch (error) {
        req.user = null; // Si el token no es válido, lo marcamos como no autenticado
    }

    next(); // Continuamos con la siguiente función middleware
};
