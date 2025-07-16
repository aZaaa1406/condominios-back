import userService from "../services/user.service.js"

export const LoginUser = async (req, res)=>{
    try {
        console.log(req.body);
        const userData = req.body;
        const login = await userService.LoginUser(userData);
        console.log(login);
        return res
            .cookie("access_token", login.token, {
                httpOnly: false,
                secure: false,
                sameSite:  'lax',
                domain:  undefined,
                path: "/",
                maxAge: 1000 * 60 * 60 // 1 hora
            })
            .status(200)
            .json({
                status: 200,
                message: "Usuario logeado correctamente",
                rol: login.rol
            });
    } catch (error) {
        throw error;
    }
    
}
export const LogoutUser = async (req, res) => {
    try {
        return res
            .clearCookie("access_token")
            .status(200)
            .json({
                status: 200,
                message: "Usuario deslogeado correctamente"
            })
    } catch (error) {
        throw error;
    }
}
export const forgotPassword = async (req, res) => {
    try {
        console.log(req.body.email);
        const dEmail = req.body.email;
        const token = await userService.forgotPassword(dEmail);
        if (!token) {
            return res.status(400).json({
                status: 400,
                message: "El email no existe en la base de datos"
            })
        }
        return res
            .cookie('reset_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                masAge: 1000 * 60 * 15
            })
            .status(200)
            .json({
                status: 200,
                message: "Se ha enviado un correo para restablecer la contraseña"
            })
    } catch (e) {
        throw e;
    }
}
export const resetPassword = async (req, res) => {
    try {
        const token = req.cookies.reset_token;
        const newPassword = req.body.password;

        console.log("token obtenido de las cookies: ", token);
        console.log("Contraseña obtenida del body: ", newPassword);
        const reset = await userService.resetPassword(newPassword, token);
        console.log("Contraseña restablecida: ", reset);
        if (reset) {
            return res
                .clearCookie("reset_token")
                .status(200)
                .json({
                    status: 200,
                    message: "Contraseña restablecida correctamente"
                })
        }
        return res.status(400).json({
            status: 400,
            message: "Error al restablecer la contraseña"
        })
    } catch (error) {
        throw new Error("Error al restablecer la contraseña")
    }
}
export const getInfoUser = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const user = await userService.getInfo(token)
        return res.status(200).json({
            status: 200,
            user: user
        })
    } catch (error) {
        throw new Error("Error al obtener la informacion del usuario")
    }
}