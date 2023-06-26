import { passportCall } from '../utils.js';
import BaseRouter from './Router.js';
import { productsService } from '../DAO/mongo/managers/index.js';


export default class ProductsRouter extends BaseRouter {
    //http://localhost:8080/api/products?limit=2
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), passportCall('jwt', { strategyType: 'github' }), async (req, res) => {
            try {
                let { limit, page, sort, category } = req.query
                console.log(req.originalUrl);

                const options = {
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                    sort: { price: Number(sort) }
                };

                if (!(options.sort.price === -1 || options.sort.price === 1)) {
                    delete options.sort
                }


                const links = (products) => {
                    let prevLink;
                    let nextLink;
                    if (req.originalUrl.includes('page')) {
                        prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                        nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                        return { prevLink, nextLink };
                    }
                    if (!req.originalUrl.includes('?')) {
                        prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                        nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
                        return { prevLink, nextLink };
                    }
                    prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
                    nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
                    return { prevLink, nextLink };

                }

                // Devuelve un array con las categorias disponibles y compara con la query "category"
                const categories = await productsService.categories()

                const result = categories.some(categ => categ === category)
                if (result) {

                    const products = await productsService.getProducts({ category }, options);
                    const { prevLink, nextLink } = links(products);
                    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
                    return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
                }

                const products = await productsService.getProducts({}, options);
                console.log(products, 'Product');
                const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
                const { prevLink, nextLink } = links(products);
                return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
            } catch (err) {
                console.log(err);
            }


        })

        //http://localhost:8080/api/products/
        this.get('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { pid } = req.params

                // Se devuelve el resultado
                const result = await productsService.getProductById(pid)

                // En caso de que traiga por error en el ID de product
                if (result === null || typeof (result) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

                // Resultado
                return res.status(200).send(result);

            } catch (err) {
                console.log(err);
            }

        })

        //http://localhost:8080/api/products/
        this.post('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const product = req.body
                console.log(product);
                const {
                    title,
                    description,
                    price,
                    code,
                    stock,
                    status,
                    category,
                    thumbnails,
                } = product

                const checkProduct = Object.values(product).every(property => property)

                if (!checkProduct) return res
                    .status(400)
                    .send({ status: 'error', message: "The product doesn't have all the properties" });

                if (!(typeof title === 'string' &&
                    typeof description === 'string' &&
                    typeof price === 'number' &&
                    typeof code === 'string' &&
                    typeof stock === 'number' &&
                    typeof status === 'boolean' &&
                    typeof category === 'string' &&
                    Array.isArray(thumbnails)))
                    return res.status(400).send({ message: 'type of property is not valid' })

                if (price < 0 || stock < 0) return res
                    .status(400)
                    .send({ message: 'Product and stock cannot be values less than or equal to zero' });

                const result = await productsService.addProduct(product)

                if (result.code === 11000) return res
                    .status(400)
                    .send({ message: `E11000 duplicate key error collection: ecommerce.products dup key code: ${result.keyValue.code}` });

                return res.status(201).send(result);
            }
            catch (err) {
                console.log(err);

            }
        })

        this.put('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { pid } = req.params
                const product = req.body

                const result = await productsService.updateProduct(pid, product);

                if (result.message) return res.status(404).send({ message: `ID: ${pid} not found` })

                return res.status(200).send(`The product ${result.title} whit ID: ${result._id} was updated`);
            }
            catch (err) {
                console.log(err);
            };

        })

        this.delete('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { pid } = req.params
                const result = await productsService.deleteProduct(pid)
                
                if (!result) return res.status(404).send({ message: `ID: ${pid} not found` })

                return res.status(200).send({ message: `ID: ${pid} was deleted` });

            } catch (err) {
                console.log(err);
            }
        })
    }

}



// export default this