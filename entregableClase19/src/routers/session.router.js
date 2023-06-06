import { Router } from 'express'
import UserManager from '../DAO/mongo/managers/users.js'
import { privacy } from '../middleware/auth.js'

const um = new UserManager()
const router = Router()


router.post('/login', async (req, res) => {

    const { email, password } = req.body
    
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = {
            first_name: 'admin',
            last_name: 'coder',
            email: 'adminCoder@coder.com',
            role: 'admin'
        }
       return res.status(200).send({status:'success', message:'User admin logged'})
    }

    const userDB = await um.validateEmailPassword(email, password)


    if (!userDB) return res.send({ status: 'error', message: 'User not found, please try again or password not valid' })

    req.session.user = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email,
        role: userDB.role
    }

    return res.status(200).send({ status: 'success', message: 'User log' })
})


router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body

        const existUser = await um.getUsersByEmail(email)

        if (existUser) return res.send({ status: 'error', message: 'The email is not available' })

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password  /// encriptar
        }
        const checkUser = Object.values(newUser).every(property => property)
        if (!checkUser) return res.send({ status: 'error', message: 'User Incomplete' })

        await um.createUser(newUser)

        res.status(200).send({
            status: 'success',
            message: 'User created successfully',
        })
    } catch (error) {
        console.log(error)
    }

})

router.get('/logout', async (req, res) => {

    try {

        req.session.destroy(err => {
            if (err) {
                console.log(err);
                // return res.send({ status: 'error', error: err })
            }
        })
        // res.clearCookie('connect.sid')
        res.sendStatus(200)
    } catch (error) {
        console.log(error, 'logout error');
    }
})





export default router