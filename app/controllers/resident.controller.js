import residentService from "../services/resident.service.js";

export const getAreas = async (req, res)=>{
    try {
        const areas = await residentService.getAreas();
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving areas", error: error.message });
    }
}
export const getCategorias = async (req, res)=>{
    try {
        const categorias = await residentService.getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories", error: error.message });
    }
}

export const getCuotas = async (req, res)=>{
    try {
        const token = req.cookies.access_token;
        const cuotas = await residentService.getCuotas(token);
        res.status(200).json(cuotas);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving cuotas", error: error.message });
    }
}
export const registerPayment = async (req, res)=>{
    const token = req.cookies.access_token;
    const data = req.body;
    console.log(token);
    console.log(data);
    try {
        const paymentData = await residentService.registerPayment(data, token);
        if(paymentData){
            return res.status(200).json({ message: "Se realizo el pago correctamente" });
        }
        return res.status(400).json({ message: "Ocurrio un error al procesar el pago" });
    } catch (error) {
        res.status(500).json({ message: "Error registering payment", error: error.message });
    }
    
}
export const registerVehiculo = async (req, res)=>{
    const token = req.cookies.access_token;
    const data = req.body;
    try {
        const vehiculoData = await residentService.registerVehiculo(data, token);
        if(vehiculoData){
            return res.status(200).json({ message: "Vehiculo registrado correctamente" });
        }
        return res.status(400).json({ message: "Ocurrio un error al registrar el vehiculo" });
    } catch (error) {
        res.status(500).json({ message: "Error registering vehicle", error: error.message });
    }
}
export const registerMascota = async (req, res)=>{
    const data = req.body;
    const token = req.cookies.access_token;
    try {
        const mascotaData = await residentService.registerMascota(data, token);
        if(mascotaData){
            return res.status(200).json({ message: "Mascota registrada correctamente" });
        }
        return res.status(400).json({ message: "Ocurrio un error al registrar la mascota" });
    } catch (error) {
        res.status(500).json({ message: "Error registering pet", error: error.message });
    }
}
export const registerIncidencia = async(req, res)=>{
    const data = req.body;
    const token = req.cookies.access_token;
    console.log(data);
    console.log(token);
    try {
        const incidenciaData = await residentService.registerIncidencia(data, token);
        if(incidenciaData){
            return res.status(200).json({ status: 200, message: "Incidencia registrada correctamente" });
        }
        return res.status(400).json({ message: "Ocurrio un error al registrar la incidencia" });
    } catch (error) {
        res.status(500).json({ message: "Error registering incidence", error: error.message });
    }
}