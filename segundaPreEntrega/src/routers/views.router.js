import { Router } from "express";
import ProductManager from "../DAO/mongo/managers/products.js";
const routerV = Router();
const pm = new ProductManager()



routerV.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category } = req.query
        console.log(limit);
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 0,
            sort: sort || '',
            lean: true
          };
        

        if (category == fields) 
        console.log(options);

        // Productos 
        const products = await pm.getProducts({},options);
        
        res.render("index", { valueReturned: products.docs })
    }
    catch (err) {
        console.log(err);
    }

})

routerV.use('/realTimeProducts', (req, res) => {

    res.render('realTimeProducts', {})
})


routerV.get('/chat',async(req,res)=>{
    res.render('chat');
})

export default routerV