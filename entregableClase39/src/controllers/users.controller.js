import { userService } from "../services/index.js";
import { generateToken } from "../config/config.jwt.js";

const changeUserRole = async (req, res) => {
    try {

        let role;
        (req.body.role === 'user') ? role = 'premium' : role = 'user';
        req.user.role = role;
        const userUpdate = await userService.changeUserService(req.params.uid, role);
        const user = {
            name: `${userUpdate.first_name} ${userUpdate.last_name}`,
            role: role,
            id: userUpdate._id,
            email: userUpdate.email,
            cart: userUpdate.carts[0]
        }
        const token = generateToken(user);
        
        return res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
        }).sendSuccessUser({ userRole: user.role })


    } catch (error) {
        return res.sendInternalError(error)
    }
};


export default {
    changeUserRole
}

