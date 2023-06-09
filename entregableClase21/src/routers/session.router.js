import { Router } from 'express'
import UserManager from '../DAO/mongo/managers/users.js'
import { privacy } from '../middleware/auth.js'
import { createHash, isValidPassword } from '../utils.js'
import passport from 'passport'

const um = new UserManager()
const router = Router()


router.get('/github',passport.authenticate('github'),(req,res)=>{});

router.get('/githubcallback',passport.authenticate('github'),(req,res)=>{
    
    console.log(req.baseUrl);
    const user = req.user;
    
    req.session.user = {
        id: user.id,
        name: user.first_name,
        role:user.role,
        email:user.email
    }
    return res.redirect('/viewGitHub')
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/loginFail'}),async(req,res)=>{
    // console.log(user);
    console.log(req.user);
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    
    console.log(req.session.user, 'user logged');
    return res.status(200).send({ status: 'success', message: 'User log' })
})

router.get('/loginFail',(req,res)=>{
    console.log(req.session);
    res.status(400).send({status:"error",message:'Login failed'});
})
// router.post('/login', async (req, res) => {

//     const { email, password } = req.body
    
//     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//         req.session.user = {
//             first_name: 'admin',
//             last_name: 'coder',
//             email: 'adminCoder@coder.com',
//             role: 'admin'
//         }
//        return res.status(200).send({status:'success', message:'User admin logged'})
//     }

//     const userDB = await um.validateUser(email)
    

//     if (!userDB) return res.status(400).send({ status: 'error', message: 'User not found, please try again or password not valid' })

//     if(!isValidPassword(userDB, password)) return res.status(403).send({ status: 'error', message: 'password not valid' })
//     delete userDB.password
    
//     req.session.user = {
//         first_name: userDB.first_name,
//         last_name: userDB.last_name,
//         email: userDB.email,
//         role: userDB.role
//     }

//     return res.status(200).send({ status: 'success', message: 'User log' })
// })


// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body

//         const existUser = await um.getUsersByEmail(email)

//         if (existUser) return res.send({ status: 'error', message: 'The email is not available' })

//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password)
//         }
//         const checkUser = Object.values(newUser).every(property => property)
//         if (!checkUser) return res.send({ status: 'error', message: 'User Incomplete' })

//         await um.createUser(newUser)

//         res.status(200).send({
//             status: 'success',
//             message: 'User created successfully',
//         })
//     } catch (error) {
//         console.log(error)
//     }

// })

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res)=>{
    try {
        res.send({status:'success', message: 'User registered successfully'})
    } catch (error) {
        console.log(error);
    }
})

router.get('/failregister', async (req, res) => {
    console.log('Failed to register');
    res.send({status: 'error', message: 'failed to register'})
})

router.get('/logout', async (req, res) => {

    try {

        req.session.destroy(error => {
            if (error) {
                console.log(error);
                
            }
        })
        
        res.sendStatus(200)
    } catch (error) {
        console.log(error, 'logout error');
    }
})





export default router