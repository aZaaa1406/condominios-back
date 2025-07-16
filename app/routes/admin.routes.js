import { Router } from "express";
import { registerResident, subirDocumento, registrarCuota, getHouses, getUsers, getCuotasChart, getCuotasTable, getProveedores, getIncidenciasTable, getProveedoresAsignacion, asignarProveedor, getDocumentos, getIncidenciasActivas, getDataDashboard} from "../controllers/admin.controller.js";
import { upload } from '../utils/multer.js';

const adminRoutes = Router();

adminRoutes.post('/register', registerResident);
adminRoutes.post('/uploadFile', upload.single('documento'), subirDocumento);
adminRoutes.post('/register-cuota', registrarCuota)
adminRoutes.post('/asignar-proveedor', asignarProveedor)
adminRoutes.get('/get-houses', getHouses)
adminRoutes.get('/get-users', getUsers)
adminRoutes.get('/data-pie-chart', getCuotasChart)
adminRoutes.get('/data-table-cuotas', getCuotasTable)
adminRoutes.get('/get-proveedores', getProveedores)
adminRoutes.get('/get-incidencias-table', getIncidenciasTable)
adminRoutes.get('/get-proveedores-asignacion', getProveedoresAsignacion)
adminRoutes.get('/get-documentos', getDocumentos);
adminRoutes.get('/get-incidencias-activas', getIncidenciasActivas)
adminRoutes.get('/get-data-dashoboard', getDataDashboard)
export default adminRoutes;