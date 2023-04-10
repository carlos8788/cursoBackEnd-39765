import express from 'express';
import ProductManager from './DAO/ProductManager.js'


const pm = new ProductManager();
const app = express();
const PORT = 8080

app.use(express.json());


app.get('/products', async (request, response) => {
    //Limit recibido
    let { limit } = request.query

    // Si no se pasa un limit devuelve todos los productos
    if (!limit) return response.status(200).send({ products })

    // parseo de limit
    if (isNaN(Number(limit))) return response.status(400).send({ status: 'error', message: 'The limit is invalid' })
    limit = Number(limit)

    // Productos
    const products = await pm.getProducts();

    // Si el límite es menor a la cantidad de productos disponibles entra al condicional
    if (products.length > limit) {
        const limitProduct = products.slice(0, limit)
        return response.status(200).send({ limitProduct });
    }

    // Caso de que el limit sea mayor a lo disponible
    return response.status(200).send({ products });

})

app.get('/products/:pid', async (request, response) => {
    const { pid } = request.params

    // Consulta si el parámetro es un número ya que el ID es numérico
    if (isNaN(Number(pid))) {
        return response.status(400).send({ status: 'Error', message: 'Invalid identification' });
    }

    // Se devuelve el resultado
    const result = await pm.getProductById(pid)

    // Si el valor de statur es error devuelve un error
    if (result.status === 'error') return response.status(400).send({ result });

    // Resultado
    return response.status(200).send({ result });
})

app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}`);
    }
    catch (err) {
        console.log(err);
    }
});