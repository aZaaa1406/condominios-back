import adminService from "../services/admin.service.js"

export const registerResident = async (req, res) => {
    try {
        const residentData = req.body;
        const registerUser = await adminService.register(residentData);
        return res.status(200).json({
            status: 200,
            message: "Residente registrado correctamente"
        });
    } catch (error) {
        console.error(error.message);

        return res.status(400).json({
            status: 400,
            message: error.message || "Error desconocido"
        });
    }
}

export const subirDocumento = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo" });
        }
        const titulo = req.body.titulo || "Documento sin título";
        const token = req.cookies.access_token;
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname;
        const mimeType = req.file.mimetype;
        const uploadResult = await adminService.uploadDocument(fileBuffer, token, titulo, fileName, mimeType);
        if (uploadResult) {
            return res.status(200).json({ message: "Documento subido correctamente" });
        } else {
            return res.status(400).json({ message: "No se pudo subir el documento" });
        }
        
    } catch (error) {
        console.error("Error al subir el documento:", error);
        return res.status(500).json({ message: error.message || "Error al subir el documento" });
    }
}

export const registrarCuota = async (req, res) => {
    const cuotaData = req.body;
    try {
        const result = await adminService.registrarCuota(cuotaData);
        if (!result) {
            throw new Error("Error al registrar la cuota");
        }
        return res.status(200).json({
            status: 200,
            message: "Cuota registrada correctamente",
        });
    } catch (error) {
        console.error(error.message);

        return res.status(400).json({
            status: 400,
            message: error.message || "Error desconocido"
        });
    }
}
export const getHouses = async (req, res) => {
    try {
        const houses = await adminService.getHouses();
        return res.status(200).json(houses);
    } catch (error) {
        console.error("Error retrieving houses:", error);
        return res.status(500).json({ message: "Error retrieving houses" });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await adminService.getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json({ message: "Error retrieving users" });
    }
}

export const getCuotasChart = async (req, res) => {
    try {
        const cuotas = await adminService.getCuotasChart()
        return res.status(200).json(cuotas);
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message || "Error desconocido"
        });

    }
}
export const getCuotasTable = async (req, res) => {
    try {
        const cuotas = await adminService.getCuotasTable();
        return res.status(200).json(cuotas);
    } catch (error) {
        console.error("Error retrieving cuotas table:", error);
        return res.status(400).json({ message: error.message || "Error retrieving cuotas table" });
    }
}
export const getProveedores = async (req, res) => {
    try {
        const proveedores = await adminService.getProveedores();
        return res.status(200).json(proveedores);
    } catch (error) {
        console.error("Error retrieving proveedores:", error);
        return res.status(500).json({ message: "Error retrieving proveedores" });
    }
}
export const getIncidenciasTable = async (req, res) => {
    try {
        const incidencias = await adminService.getIncidenciasTable();
        return res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error retrieving incidencias table:", error);
        return res.status(500).json({ message: "Error retrieving incidencias table", error: error.message });
    }
}
export const getProveedoresAsignacion = async (req, res) => {
    try {
        const proveedores = await adminService.getProveedoresAsignacion()
        return res.status(200).json(proveedores)
    } catch (error) {
        res.status(500).json({ message: "Error retrieving proveedores" });
    }
}
export const asignarProveedor = async (req, res) => {
    console.log(req.body);
    const idProveedor = req.body.id_proveedor;
    const idIncidencia = req.body.id_incidencia;
    //{ id_proveedor: 1, id_incidencia: 1 }
    try {
        const result = await adminService.asignarProveedor(idProveedor, idIncidencia);
        if (!result) {
            return res.status(400).json({ message: "Error al asignar el proveedor" });
        }
        return res.status(200).json({
            status: 200,
            message: "Proveedor asignado correctamente"
        });
    } catch (error) {

    }
}
export const getDocumentos = async (req, res) => {
    try {
        const documentos = await adminService.getDocumentos();
        return res.status(200).json(documentos);
    } catch (error) {
        console.error("Error retrieving documentos:", error);
        return res.status(500).json({ message: "Error retrieving documentos" });
    }
}
export const getIncidenciasActivas = async (req, res) => {
    try {
        const incidencias = await adminService.getIncidenciasActivas();
        return res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error retrieving active incidencias:", error);
        return res.status(500).json({ message: "Error retrieving active incidencias" });
    }
}

export const getDataDashboard = async (req, res) => {
    try {
        const data = await adminService.getDataDashboard();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error retrieving dashboard data:", error);
        return res.status(500).json({ message: "Error retrieving dashboard data" });
    }
}
