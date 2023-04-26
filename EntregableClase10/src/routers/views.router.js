import { Router } from "express";
import ProductManager from "../DAO/ProductManager.js";
const routerV = Router();
const pm = new ProductManager()



routerV.get('/', async (req, res) => {
    try {
        const products = await pm.getProducts()
        console.log(products);
        res.render("home", { valueReturned: products })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({err})
    }

})

routerV.use('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default routerV