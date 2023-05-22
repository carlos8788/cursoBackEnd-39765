import { Router } from 'express';
// import ProductManager from '../DAO/fileSystem/ProductManager.js';
import ProductManager from '../DAO/mongo/managers/products.js';
const routerP = Router()

const pm = new ProductManager()



//http://localhost:8080/api/products?limit=2
routerP.get('/', async (request, response) => {
    try {
        //Limit recibido
        let { limit } = request.query

        // Productos 
        const products = await pm.getProducts();

        // Si no se pasa un limit devuelve todos los productos
        if (!limit) return response.status(200).send({ products })

        // parseo de limit
        if (isNaN(Number(limit))) return response.status(400).send({message: 'The limit is invalid' })
        limit = Number(limit)

        // "Si el limit es menor a cero se devuelve un error"
        if (limit<0) return response.status(400).send({message: 'The limit cannot be less than 0'})
        // Si el límite es menor a la cantidad de productos disponibles entra al condicional
        if (products.length > limit) {
            const limitProduct = products.slice(0, limit)
            return response.status(200).send({ limit, products:limitProduct });
        }

        // Caso de que el limit sea mayor a lo disponible
        return response.status(200).send({ products });
    } catch (err) {
        console.log(err);
    }


})

//http://localhost:8080/api/products/
routerP.get('/:pid', async (request, response) => {
    try {
        const { pid } = request.params

        // Se devuelve el resultado
        const result = await pm.getProductById(pid)
        console.log(result, 'resultado');
        // En caso de que traiga por error en el ID de product
        if (result.message) return response.status(404).send({ message: `ID: ${pid} not found`})
        
        // Resultado
        return response.status(200).send( result );

    } catch (err) {
        console.log(err);
    }

})

//http://localhost:8080/api/products/
routerP.post('/', async (request, response) => {
    try {
        const product = request.body
        const {
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
            thumbnails
        } = product
        
        const checkProduct = Object.values({
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
            thumbnails
        }).every(property => property)

        if(!checkProduct) return response
        .status(400)
        .send( {message:"The product doesn't have all the properties"} );

        if (!(typeof title === 'string' && 
                typeof description === 'string' && 
                typeof price === 'number' && 
                typeof code === 'string' && 
                typeof stock === 'number' && 
                typeof status === 'boolean' && 
                typeof category === 'string' && 
                Array.isArray(thumbnails))) 
                return response.status(400).send({message:'type of property is not valid' })

        if(price < 0 || stock < 0 ) return response
        .status(400)
        .send({message: 'Product and stock cannot be values less than or equal to zero' });

        const result = await pm.addProduct(product)
        console.log(result)
        if (result.code === 11000) return response
        .status(400)
        .send( {message: `E11000 duplicate key error collection: ecommerce.products dup key code: ${ result.keyValue.code }`} );

        return response.status(201).send(result);
    }
    catch (err) {
        console.log(err);
        
    }
})

routerP.put('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const product = request.body

        const result = await pm.updateProduct(pid, product);
        console.log(result);
        if (result.message) return response.status(404).send({ message: `ID: ${pid} not found`})

        return response.status(200).send( `The product ${result.title} whit ID: ${result._id} was updated` );
    }
    catch (err) {
        console.log(err);
    };

})

routerP.delete('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const result = await pm.deleteProduct(pid)
        // console.log(result)
        if (!result) return response.status(404).send({ message: `ID: ${pid} not found`})

        return response.status(200).send({ message: `ID: ${pid} was deleted` });

    } catch (err) {
        console.log(err);
    }
})

export default routerP