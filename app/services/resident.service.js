import residentModel from "../models/resident.model.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY_JWT } from "../config/config.js";

class residentService {
    async getAreas() {
        try {
            const areas = await residentModel.getAreas();
            return areas;
        } catch (error) {
            console.error('Error in residentService.getAreas:', error);
            throw error;
        }
    }
    async getCategorias(){
        try {
            const categorias = await residentModel.getCategorias();
            return categorias;
        } catch (error) {
            console.error('Error in residentService.getCategorias:', error);
            throw error;
        }
    }
    async getCuotas(token) {
        const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
        if (!tokenValidate) {
            throw new Error("Token invalido");
        }
        const userId = tokenValidate.id_usuario;
        console.log(userId);
        const cuotas = await residentModel.getCuotas(userId);
        return cuotas;
    }
    async registerPayment(data, token) {
        try {
            const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Token invalido");
            }
            const userId = tokenValidate.id_usuario;
            console.log(userId);
            const dataUser = {
                ...data,
                id_usuario: userId,
            }
            console.log(dataUser);
            const paymentData = await residentModel.registerPayment(dataUser);
            if (paymentData){
                return true
            }
            return false;

        } catch (error) {

        }
    }
    async registerVehiculo(data, token) {
        try {
            const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Token invalido");
            }
            const userId = tokenValidate.id_usuario;
            const dataUser = {
                ...data,
                id_usuario: userId,
            }
            console.log(dataUser);
            const vehiculoData = await residentModel.registerVehiculo(dataUser);
            if (vehiculoData) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error in residentService.registerVehiculo:', error);
            throw error;
        }
    }
    async registerMascota(data, token) {
        try {
            const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Token invalido");
            }
            const userId = tokenValidate.id_usuario;
            const dataUser = {
                ...data,
                id_usuario: userId,
            }
            console.log(dataUser);
            const mascotaData = await residentModel.registerMascota(dataUser);
            if (mascotaData) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error in residentService.registerMascota:', error);
            throw error; 
        }
    }
    async registerIncidencia(data, token){
        try {
            const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Token invalido");
            }
            const userId = tokenValidate.id_usuario;
            const dataUser = {
                ...data,
                id_usuario: userId,
            }
            const res = await residentModel.registerIncidencia(dataUser);
            if (res) {
                return true;
            }
            return false;

        } catch (error) {
            throw error;
            
        }
    }
}

export default new residentService();