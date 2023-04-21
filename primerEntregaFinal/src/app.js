import express from 'express';
// import ProductManager from './DAO/ProductManager.js'
import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';

// const pm = new ProductManager();
const app = express();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use('/api/products', routerP)
app.use('/api/carts', routerC)

app.get('/products', (req, res) => {
    res.send({
        status: "connected"
    })
})

app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}`);
        console.log("http://localhost:8080/api/products")
    }
    catch (err) {
        console.log(err);
    }
});