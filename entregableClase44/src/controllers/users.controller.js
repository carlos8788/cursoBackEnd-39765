import { userService } from "../services/index.js";
import { generateToken } from "../config/config.jwt.js";

const changeUserRole = async (req, res) => {
    try {

        let role;

        if (req.body.role === 'user') {
            
            const documents = await userService.getUserDocumentsService(req.user.id);
            const typesNeeded = ['dni', 'domicilio', 'cuenta'];
            const typesFound = documents.map(doc => doc.type);
            const hasAllTypes = typesNeeded.every(type => typesFound.includes(type));
            
            if(!hasAllTypes) return res.sendUnauthorized('Not authorized')
            
        };

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


const uploadHandler = async (req, res) => {
    try {

        const { uid } = req.params;
        const { type, document_type } = req.query;



        if (!['profile', 'product', 'document'].includes(type)) {
            return res.sendBadRequest('Invalid type parameter');
        }

        const files = req.files;

        const documents = files.map(file => ({
            name: file.originalname,
            reference: `/uploads/${type}s/${file.filename}`,
            type: document_type
        }));
        
        const response = await userService.updateUserDocumentsService(uid, type, documents);

        if (response.error) {
            throw new Error(response.error);
        }

        return res.sendSuccess(response);

    } catch (error) {

        return res.sendInternalError(error)
    }
};






export default {
    changeUserRole,
    uploadHandler
}

