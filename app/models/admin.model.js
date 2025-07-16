import { pool } from "../config/db.js";
import { SALT } from "../config/config.js";
import { generate } from "generate-password"; "generate-password"
import bcrypt, { hash } from 'bcrypt';

class adminModel {
    async findByEmail(email) {
        const query = "SELECT 1 FROM contacto WHERE correo = ? LIMIT 1";
        const [rows] = await pool.query(query, [email]);
        return rows.length > 0;
    }
    async findRol(rol) {
        try {
            const query = "SELECT * FROM rol WHERE descripcion_rol = ?";
            const [rows] = await pool.query(query, [rol]);
            return rows.length > 0 ? rows[0].id_rol : null;
        } catch (error) {
            console.error("Error al buscar el rol:", error);
            throw new Error("No se pudo obtener el rol");
        }
    }
    async findCasa(lote) {
        const query = "SELECT id_casa FROM casa WHERE lote = ?"
        const [rows] = await pool.query(query, [lote]);
        console.log(rows);
        return rows.length > 0 ? rows[0].id_casa : null;
    }
    async findCategoriaProveedor(categoria) {
        const query = "SELECT id_cat_proveedor from categorias_proveedor WHERE categoria = ?"
        const [rows] = await pool.query(query, [categoria]);
        return rows.length > 0 ? rows[0].id_cat_proveedor : null;
    }
    async findCuota(mes) {
        const year = new Date().getFullYear();
        console.log(year);
        const query = "SELECT * FROM cuotas WHERE mes = ? AND año = ?";
        const [rows] = await pool.query(query, [mes, year]);
        console.log(rows.length);
        if (rows.length > 0) {
            throw new Error("Ya existe una cuota registrada para este mes del año actual");
        }
        return true;
    }
    async findDocument(url) {
        try {
            const query = "SELECT * FROM documentos WHERE url = ?";
            const [rows] = await pool.query(query, [url]);
            if (rows.length > 0) {
                throw new Error("Ya existe un documento con esta URL");
            }
        } catch (error) {
            console.error("Error al buscar el documento:", error);
            throw new Error("No se pudo verificar la existencia del documento");
        }
    }

    async registerResident(userData) {
        const password = generate({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true
        })
        try {
            userData.email = userData.email.toLowerCase().trim();
            const emailExist = await this.findByEmail(userData.email);
            if (emailExist) {
                throw new Error("El email ya existe en la base de datos");
            }
            const rolId = await this.findRol(userData.rol);
            console.log(rolId);
            if (!rolId) {
                throw new Error("Rol inválido");
            }
            const hashPassword = await bcrypt.hash(password, 10);
            if (rolId === 2) {
                const casaId = await this.findCasa(userData.casa);
                if (!casaId) {
                    throw new Error("Casa no encontrada");
                }
                const query2 = "CALL registerResident(?, ?, ?, ?, ?, ?, ?, ?)";
                const [res] = await pool.query(query2, [
                    userData.nombre,
                    userData.appat,
                    userData.apmat,
                    userData.telefono,
                    userData.email,
                    hashPassword,
                    rolId,
                    casaId
                ])
                console.log(res);
                return password
            }
            if (rolId === 3) {
                const categoriaId = await this.findCategoriaProveedor(userData.categoria);
                const query3 = "call registerProveedor(?, ?, ?, ?, ?, ?, ?, ?);"
                const [res] = await pool.query(query3, [
                    userData.nombre,
                    userData.appat,
                    userData.apmat,
                    userData.telefono,
                    userData.email,
                    hashPassword,
                    rolId,
                    categoriaId
                ]);
                console.log(res);
                return password;
            }
            const query = "CALL registerUser(?,?,?,?,?,?,?)";
            const [result] = await pool.query(query, [
                userData.nombre,
                userData.appat,
                userData.apmat,
                userData.telefono,
                userData.email,
                hashPassword,
                rolId
            ]);
            console.log(result);
            return password;


        } catch (error) {
            throw error
        }
    }
    async saveDocument(idUser, titulo, url) {
        await this.findDocument(url);
        const query = "Insert into documentos (id_usuario, titulo, url) values (?,?,?)";
        try {
            const res = await pool.query(query, [idUser, titulo, url]);
            if (res[0].affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al guardar el documento:", error);
            throw new Error("No se pudo guardar el documento");
        }
    }
    async registrarCuota(cuotaData) {
        await this.findCuota(cuotaData.mes);
        const query = "INSERT INTO cuotas(mes, monto, fecha_limite, año) VALUES (?, ?, ?, YEAR(CURDATE()))"
        try {
            const [rows] = await pool.query(query, [cuotaData.mes, cuotaData.monto, cuotaData.fechaLimite]);
            const query2 = "SELECT * from usuario where id_rol = 2";
            const [usuarios] = await pool.query(query2);
            const query3 = "INSERT INTO pagos(id_usuario, id_cuota) VALUES (?,?)"
            for (const usuario of usuarios) {
                await pool.query(query3, [usuario.id_usuario, rows.insertId]);
            }
            if (rows.affectedRows > 0) {
                return true;
            }
            return false
        } catch (error) {
            throw error;
        }
    }
    async getHouses() {
        const query = "SELECT * FROM casa"
        try {
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows;
        } catch (error) {
            console.error("Error al obtener las casas:", error);
            throw new Error("No se pudo obtener las casas");

        }
    }
    async getUsers() {
        try {
            const query = "CALL getInfoUsers()"
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows[0];
        } catch (error) {

        }
    }
    async getCuotasChart() {
        const query = "CALL getCuotasChart()"
        try {
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows[0];
        } catch (error) {
            console.error("Error al obtener las cuotas del gráfico:", error);
            throw new Error("No se pudo obtener las cuotas");
        }
    }
    async getCuotasTable() {
        const query = "CALL getCuotasTable()"
        try {
            const [rows] = await pool.query(query);
            console.log(rows[0][0]);
            return rows[0];
        } catch (error) {
            console.error("Error al obtener las cuotas de la tabla:", error);
            throw new Error("No se pudo obtener las cuotas");
        }
    }
    async getProveedores() {
        const query = "SELECT categoria from categorias_proveedor"
        try {
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows;
        } catch (error) {
            throw new Error("No se pudo obtener los proveedores");
        }
    }
    async getIncidenciasTable() {
        const query = "call getIncidenciasAdmin();"
        try {
            const [rows] = await pool.query
                (query);
            console.log(rows[0][0]);
            return rows[0];
        } catch (error) {
            console.error("Error al obtener las incidencias de la tabla:", error);
            throw new Error("No se pudo obtener las incidencias");
        }
    }
    async getProveedoresAsignacion() {
        const query = "Call getProveedorAsignacion() "
        try {
            const [rows] = await pool.query(query);
            console.log(rows[0]);
            return rows[0];
        } catch (error) {
            throw new Error("No se pudo obtener los proveedores para asignación");
        }
    }
    async asignarProveedor(idProveedor, idIncidencia) {
        const query = "CALL asignarProveedor(?,?)"
        try {
            const [rows] = await pool.query(query, [idProveedor, idIncidencia]);
            console.log(rows);
            if (rows.affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al asignar proveedor:", error);
            throw new Error("No se pudo asignar el proveedor");

        }
    }
    async getDocumentos(){
        const query = "SELECT titulo, url FROM documentos"
        try {
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows;
        } catch (error) {
            console.error("Error al obtener los documentos:", error);
            throw new Error("No se pudo obtener los documentos");
            
        }
    }
    async getIncidenciasActivas(){
        const query = "Call getIncidenciasActivas()"
        try {
            const [rows] = await pool.query(query);
            console.log(rows[0]);
            return rows[0];
        } catch (error) {
            console.error("Error al obtener las incidencias activas:", error);
            throw new Error("No se pudieron obtener las incidencias activas");
        }
    }
    async getDataDashboard(){
        const query = "CALL getDataDashboardAdmin()"
        try {
            const rows = await pool.query(query);
            const data = rows[0][0][0];
            const totalPagos = data.mesCuota * data.totalPagosUsuario
            const response = {
                totalUsuarios: data.totalUsuarios,
                totalPagos: totalPagos,
                incidenciasActivas: data.incidenciasActivas,
            }
            return response;
        } catch (error) {
            throw new Error("No se pudo obtener los datos del dashboard");
        }
    }
}

export default new adminModel();