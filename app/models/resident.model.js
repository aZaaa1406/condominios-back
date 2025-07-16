import {pool} from '../config/db.js';

class residentModel{
    async getAreas(){
        try {
            const query = 'SELECT id_area, nombre FROM areas_comunes';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching areas:', error);
            throw error;
        }
    }
    async getCategorias(){
        try {
            const query = 'SELECT * FROM categorias_incidencias';
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
    async getCuotas(userId){
        try {
            const query = "CALL getCuotaUser(?)";
            const [rows] = await pool.query(query, [userId]);
            return rows[0][0];
        } catch (error) {
            throw new Error("Error fetching cuotas: " + error.message);
            
        }
    }
    async getIdCategoria(name){
        try {
            const query = "SELECT id_cat_incidencias FROM categorias_incidencias WHERE nombre = ?";
            const [rows] = await pool.query(query, [name]);
            console.log(rows);
            return rows[0].id_cat_incidencias;
        } catch (error) {
            console.error('Error fetching category ID:', error);
            throw new Error("Error fetching category ID: " + error.message);
        }
    }
    async getIdArea(name){
        try {
            const query = "SELECT id_area FROM areas_comunes WHERE nombre = ?";
            const [rows] = await pool.query(query, [name]);
            return rows[0].id_area;
        }
        catch (error) {
            console.error('Error fetching area ID:', error);
            throw new Error("Error fetching area ID: " + error.message);
        }
    }

    async registerPayment(data){

        console.log(data);
        try {
            const query = "UPDATE pagos SET fecha_pago = ?, metodo_pago = ?, estado= ? WHERE id_usuario = ? AND id_cuota = ?";
            const res = await pool.query(query, [data.fecha, data.metodoPago, 'pagado', data.id_usuario, data.id_cuota ])
            if (res.affectedRows > 0) {
                return true;
            } 
            return false;

        } catch (error) {
            
        }
    }

    async registerVehiculo(data){
        const query = "INSERT INTO vehiculos(id_usuario, tipo, placa, modelo, color, marca) VALUES(?,?,?,?,?, ?)"
        try {
            const [rows] = await pool.query(query, [
                data.id_usuario,
                data.tipo,
                data.placa,
                data.modelo,
                data.color,
                data.marca
            ])
            if (rows.affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error registering vehicle:', error);
            throw error;
            
        }
    }
    async registerMascota(data){
        console.log("Data received in Service:", data);
        const query = "INSERT INTO mascotas(id_usuario, tipo_mascota, nombre, color, rasgos, raza) VALUES(?,?,?,?,?,?)"
        try {
            console.log("Ejecutando query");
            const [rows] = await pool.query(query, [
                data.id_usuario,
                data.tipo,
                data.nombre,
                data.color,
                data.rasgo,
                data.raza
            ])
            if (rows.affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw new Error("Error registering pet: " + error.message);
        }
    }
    async registerIncidencia(data){
        console.log(data);
        const query = "INSERT INTO incidencias(id_usuario, id_area, id_cat_incidencias, descripcion, fechaRegistro) values (?,?,?,?,?)"
        try {
            const areaId = await this.getIdArea(data.area);
            console.log(areaId);
            const categoriaId = await this.getIdCategoria(data.categoria);
            console.log(categoriaId);
            const [rows] = await pool.query(query, [
                data.id_usuario,
                areaId,
                categoriaId,
                data.descripcion,
                data.fecha
            ]);
            if (rows.affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw new Error("Error registering incidence: " + error.message);
        }
    }
}

export default new residentModel();