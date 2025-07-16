import {Router} from 'express';
import { getAreas, getCuotas, registerMascota, registerPayment, registerVehiculo, getCategorias, registerIncidencia } from '../controllers/resident.controller.js';

const residentRoutes = Router();

residentRoutes.get('/areas', getAreas);
residentRoutes.get('/get-cuotas', getCuotas)
residentRoutes.get('/categorias', getCategorias)
residentRoutes.post('/register-payment', registerPayment)
residentRoutes.post('/register-vehiculo', registerVehiculo)
residentRoutes.post('/register-mascota', registerMascota)
residentRoutes.post('/register-incidencia', registerIncidencia)
export default residentRoutes;