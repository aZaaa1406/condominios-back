import adminModel from "../models/admin.model.js";
import streamifier from 'streamifier';
import { sendMail } from "../utils/mail.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY_JWT } from "../config/config.js";
import { bucket } from "../utils/googleCloud.js";

class adminService {
    async register(residentData) {
        try {
            const registerUser = await adminModel.registerResident(residentData)
            if (!registerUser) {
                throw new Error("Error al registrar el usuario");
            }
            console.log(registerUser);
            sendMail(residentData.email, "Registro exitoso", `Hola ${residentData.nombre}, tu cuenta ha sido creada exitosamente. Tu contraseña es: ${registerUser}`)
            return true;
        } catch (error) {
            throw error;
        }
    }

    async uploadDocument(fileBuffer, token, titulo, fileName, mimeType) {
        const userData = jwt.decode(token, SECRET_KEY_JWT);
        const idUser = userData.id_usuario;

        try {

            const file = bucket.file(`uploads/${fileName}`);
            let publicUrl = ''; // aquí se almacenará la URL

            await new Promise((resolve, reject) => {
                const stream = file.createWriteStream({
                    metadata: {
                        contentType: mimeType,
                    },
                    resumable: false,
                });

                stream.on('error', (err) => reject(err));

                stream.on('finish', () => {
                    publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                    console.log('URL generada:', publicUrl);
                    resolve();
                });

                stream.end(fileBuffer);
            });

            // Aquí puedes usar la URL como gustes
            console.log('📂 Archivo subido con éxito: ', publicUrl);
            const result = await adminModel.saveDocument(idUser, titulo, publicUrl)
            if (result) {
                return true
            }
            return false;
        } catch (error) {
            console.error('❌ Error en uploadDocument:', error);
            throw error;
        }

    }
    async registrarCuota(cuotaData) {
        try {
            const result = await adminModel.registrarCuota(cuotaData);

            if (result) {
                return true
            }
            throw new Error("Error al registrar la cuota");
        } catch (error) {
            throw error;
        }
    }
    async getHouses() {
        try {
            const houses = await adminModel.getHouses();
            return houses;
        } catch (error) {
            throw new Error(`Error al obtener las casas: ${error.message}`);
        }
    }
    async getUsers() {
        try {
            const users = await adminModel.getUsers();
            return users;
        } catch (error) {
            throw new Error(`Error al obtener los usuarios: ${error.message}`);
        }
    }
    async getCuotasChart() {
        const estadoColorMap = {
            pendiente: "#facc15",
            pagado: "#22c55e",
            vencido: "#ef4444",
        };
        const cuotas = await adminModel.getCuotasChart();
        const agrupado = {}

        for (const cuota of cuotas) {
            const key = `${cuota.mes}-${cuota.año}`;
            if (!agrupado[key]) {
                agrupado[key] = {
                    mes: cuota.mes,
                    año: cuota.año,
                    data: []
                }
            }
            agrupado[key].data.push({
                estado: cuota.estado,
                valor: cuota.total,
                fill: estadoColorMap[cuota.estado] || "#000000"
            })
        }
        return Object.values(agrupado);
    }
    async getCuotasTable() {
        try {
            const cuotas = await adminModel.getCuotasTable();
            return cuotas;
        } catch (error) {
            throw error;
        }
    }
    async getProveedores() {
        try {
            const proveedores = await adminModel.getProveedores();
            return proveedores;
        } catch (error) {
            throw error
        }
    }
    async getIncidenciasTable() {
        try {
            const incidencias = await adminModel.getIncidenciasTable();
            return incidencias;
        } catch (error) {
            throw error
        }
    }
    async getProveedoresAsignacion() {
        try {
            const proveedores = await adminModel.getProveedoresAsignacion();
            return proveedores;
        } catch (error) {
            throw error
        }
    }
    async asignarProveedor(id_proveedor, id_incidencia) {
        try {
            const result = await adminModel.asignarProveedor(id_proveedor, id_incidencia);
            if (!result) {
                throw new Error("Error al asignar el proveedor");
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
    async getDocumentos(){
        try {
            const documentos = await adminModel.getDocumentos();
            return documentos;
        } catch (error) {
            console.error("Error al obtener los documentos:", error);
            throw new Error("No se pudieron obtener los documentos");
        }
    }
    async getIncidenciasActivas() {
        try {
            const incidencias = await adminModel.getIncidenciasActivas();
            return incidencias;
        } catch (error) {
            console.error("Error al obtener las incidencias activas:", error);
            throw new Error("No se pudieron obtener las incidencias activas");
        }
    }
    async getDataDashboard(){
        try{
            const response = await adminModel.getDataDashboard()
            return response;
        }catch(error){
            throw error;
        }
    }
}

export default new adminService();