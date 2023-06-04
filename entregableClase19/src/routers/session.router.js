import { Router } from 'express'
import UserManager from '../DAO/mongo/managers/users.js'

const um = new UserManager()
const router = Router()

router.get('/exist', (req, res) => {

    if (req.session.user) {

        res.send({ message: 'si' })

    }
    res.send({ message: 'no' })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // validar email y password
    console.log(req.session);
    // vamos a tener una función para validar el password
    const userDB = await um.validateEmailPassword(email, password)
    console.log(userDB);

    if (!userDB) return res.send({ status: 'error', message: 'No existe ese usuario, revisar' })
    console.log(req.session);
    req.session.user = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email,
        role: 'admin'
    }

    // res.send({
    //     status: 'success',
    //     message: 'login success',
    //     session: req.session.user
    // })
    res.redirect('/products')
})


router.post('/register', async (req, res) => {
    try {
        const { username, first_name, last_name, email, age, password } = req.body

        const existUser = await um.getUsersByEmail(email)

        if (existUser) return res.send({ status: 'error', message: 'el email ya está registrado' })

        const newUser = {
            username,
            first_name,
            last_name,
            email,
            age,
            password  /// encriptar
        }
        let resultUser = await um.createUser(newUser)




        res.status(200).send({
            status: 'success',
            message: 'Usuario creado correctamente',
            resultUser
        })
    } catch (error) {
        console.log(error)
    }

})

router.get('/logout', async (req, res) => {
    console.log(req.session, 'has logged')
    try {
        
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                return res.send({ status: 'error', error: err })
            }
    
            res.clearCookie('connect.sid')
    
    
            res.redirect('/login')
        })
    } catch (error) {
        console.log(error);
    }
    return res.redirect('/login')
})



// sesiones 
router.get('/counter', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido')
    }
})

// router.get('/privada', auth,(req,res) => {

//     res.send('Todo lo que esta acá solo lo puede ver un admin loagueado')
// })

export default router