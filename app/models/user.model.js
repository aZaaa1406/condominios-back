import { pool } from "../config/db.js";
import bcrypt from 'bcrypt';
import { SALT } from "../config/config.js";

class userModel {
    async findByEmail(email) {
        const query = "SELECT 1 FROM contacto WHERE correo = ? LIMIT 1";
        const [rows] = await pool.query(query, [email]);
        return rows.length > 0;
    }
    async getPassword(email) {
        //obtenemos el password del usuario y comparamos
        const query = "CALL getPassword(?)"
        const [rows] = await pool.query(query, [email]);
        const user = rows[0][0];
        return user.token
    }
    async getInfo(email) {
        const query = "call getInfoUser(?)"
        const [rows] = await pool.query(query, [email]);
        return rows[0][0];
    }
    async getForgotPassword(email) {
        const query = "CALL getPassword(?)"
        const [rows] = await pool.query(query, [email]);
        const user = rows[0][0];
        console.log(user);
        return user;
    }
    async getRol(email) {
        const query = "CALL getRol(?)"
        const [rows] = await pool.query(query, [email]);
        const user = rows[0][0];
        return user.descripcion_rol
    }

    async LoginUser(userData) {
        try {
            userData.email = userData.email.toLowerCase().trim();
            const emailExist = await this.findByEmail(userData.email);
            const passwordUser = await this.getPassword(userData.email);
            const verifyPassword = await bcrypt.compare(userData.password, passwordUser);
            if (!verifyPassword) {
                throw new Error("Contraseña incorrecta");
            }
            const user = await this.getInfo(userData.email);
            console.log(user);
            return user;
        } catch (error) {
            throw error;
        }
    }
    async resetPassword(newPassword, email) {
            try {KW
                const newPasswordHash = await bcrypt.hash(newPassword, SALT);

                const lastPaswword = await this.getPassword(email);
                const verifyPassword = await bcrypt.compare(newPassword, lastPaswword);
                if (verifyPassword) {
                    throw new Error("La nueva contraseña no puede ser la misma que la anterior")
                }
                const query = "CALL resetPassword(?,?)"
                const [rows] = await pool.query(query, [email, newPasswordHash]);
                console.log(rows);
                return rows.affectedRows > 0;
            } catch (error) {
                throw new Error("Error al restablecer la contraseña")
            }
        }

}

export default new userModel();