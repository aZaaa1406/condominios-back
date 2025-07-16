import userModel from "../models/user.model.js";
import { SECRET_KEY_JWT } from "../config/config.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";
import { URL_ACCESS } from "../config/config.js";

class userService {
    async LoginUser(userData) {
        const user = await userModel.LoginUser(userData);
        const token = jwt.sign(user, SECRET_KEY_JWT, { expiresIn: "1h" });
        const rol = await userModel.getRol(userData.email);
        const dataUser = {
            token: token,
            rol: rol
        }
        return dataUser;
    }

    async forgotPassword(dEmail) {
        const email = dEmail.toLowerCase().trim()
        console.log(email);
        const emailValidate = await userModel.findByEmail(email);
        if (!emailValidate) {
            throw new Error("El email no existe en la base de datos");
        }
        const user = await userModel.getForgotPassword(email);
        if (!user) {
            throw new Error("Error al obtener la informacion del usuario");
        }
        const token = jwt.sign({ user }, SECRET_KEY_JWT, { expiresIn: "15m" });
        sendMail(user.correo, "Recuperar contraseña", `Haz click en el siguiente enlace para restablecer tu contraseña: <a href=${URL_ACCESS}/reset-password/${token}>Restablecer contraseña</a>`);
        return token;
    }

    async resetPassword(newPassword, tokenP) {
        try {
            const tokenValidate = jwt.verify(tokenP, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Ocurrio un error");
            }
            console.log(tokenValidate);
            const email = tokenValidate.user.correo
            const result = await userModel.resetPassword(newPassword, email);
            return result;
        } catch (error) {

        }
    }
    async getInfo(token) {
        try {
            const tokenValidate = jwt.verify(token, SECRET_KEY_JWT);
            if (!tokenValidate) {
                throw new Error("Ocurrio un error");
            }
            return tokenValidate
        } catch (error) {
            throw new Error("Error al obtener la informacion del usuario")
        }
    }
}

export default new userService();