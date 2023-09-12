
import { productService } from '../services/index.js';
import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/constant.js';
import { getLogger } from '../middleware/logger.js';

const getProducts = async (req, res) => {
    try {
        let { limit, page, sort, category, filterStock } = req.query

        if (filterStock) {
            try {

                const products = await productService.getProductsViewService()

                const filterByStock = products.filter(product => product.stock <= Number(filterStock))

                return res.sendSuccessWithPayload(filterByStock);
            } catch (error) {
                req.logger.error(error);
                return res.sendInternalError(error);
            }

        }

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
        const categories = await productService.categoriesService()

        const result = categories.some(categ => categ === category)
        if (result) {

            const products = await productService.getProductsService({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
            const docsFiltered = docs.filter(prod => prod.owner !== req.user.email)
            req.logger.debug('Get Product OK')
            return res.status(200).send({ status: 'success', payload: docsFiltered, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        }

        const products = await productService.getProductsService({}, options);

        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        const docsFiltered = docs.filter(prod => prod.owner !== req.user.email)

        req.logger.debug('Get Product OK')
        return res.status(200).send({ status: 'success', payload: docsFiltered, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
    } catch (error) {
        req.logger.error(error)
        return (error);
    }


}

const getProductId = async (req, res) => {
    try {
        const { pid } = req.params

        // Se devuelve el resultado
        const result = await productService.getProductByIdService(pid)

        // En caso de que traiga por error en el ID de product
        if (result === null || typeof (result) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

        // Resultado
        req.logger.debug('GET product ID OK')
        return res.status(200).send(result);

    } catch (error) {
        req.logger.error(error)
        return (error);
    }

}

const postProduct = async (req, res) => {

    try {
        let product = req.body


        product.owner = (req.user.role !== 'premium') ? 'admin' : req.user.email;

        const {
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
            thumbnails,
            owner,
        } = product

        if (!title ||
            !description ||
            !price ||
            !code ||
            !stock ||
            !status ||
            !category ||
            !thumbnails ||
            !owner) {

            CustomError.createError({
                name: 'Product creation failed',
                cause: generateProductErrorInfo(
                    {
                        title,
                        description,
                        price,
                        code,
                        stock,
                        status,
                        category,
                        thumbnails,
                        owner,
                    }
                ),
                message: "Error trying to create product",
                code: EErrors.INVALID_TYPES_ERROR
            })

        }

        if (!(typeof title === 'string' &&
            typeof description === 'string' &&
            typeof price === 'number' &&
            typeof code === 'string' &&
            typeof stock === 'number' &&
            typeof status === 'boolean' &&
            typeof category === 'string' &&
            typeof owner === 'string' &&
            Array.isArray(thumbnails)))
            return res.status(400).send({ message: 'type of property is not valid' })

        if (price < 0 || stock < 0) return res
            .status(400)
            .send({ message: 'Product and stock cannot be values less than or equal to zero' });

        const result = await productService.addProductService(product)

        if (result.code === 11000) return res
            .status(400)
            .send({ message: `E11000 duplicate key error collection: ecommerce.products dup key code: ${result.keyValue.code}` });
        req.logger.debug('POST product OK')
        return res.status(201).send(result);
        // return res.status(201).send(req.body);
    }
    catch (error) {
        req.logger.error(error)
        return res.send({ message: error });

    }
}

const putProduct = async (req, res) => {
    try {
        const { pid } = req.params
        const product = req.body

        if (product.price < 0 || product.stock < 0) return res.sendInternalError('Price or Stock is negative!')
        
        const result = await productService.updateProductService(pid, product);

        if (result.message) return res.status(404).send({ message: `ID: ${pid} not found` })
        req.logger.debug(`The product ${result.title} whit ID: ${result._id} was updated`)
        return res.status(200).send(`The product ${result.title} whit ID: ${result._id} was updated`);
    }
    catch (error) {
        req.logger.error(error)
        return res.send({ message: error });
    };

}

const deleteProduct = async (req, res) => {

    try {
        const { pid } = req.params
        const product = await productService.getProductByIdService(pid)


        if (product.owner !== req.user.email) return res.internalError('Forbidden! You cannot delete this product')
        const result = await productService.deleteProductService(pid)

        if (!result) return res.status(404).send({ message: `ID: ${pid} not found` })
        req.logger.debug(`ID: ${pid} was deleted`)
        return res.sendSuccess(`ID: ${pid} was deleted`);

    } catch (error) {
        req.logger.error(error)
        return res.internalError(error.message)
    }
}

const getProductsFromPremium = async (req, res) => {
    try {
        const products = await productService.getProductsViewService()
        const filteredProducts = products.filter(product => product.owner === req.user.email)
        res.sendSuccessWithPayload(filteredProducts)

    } catch (error) {

        req.logger.error(error)
        return res.internalError(error.message)
    }
}


export default {
    getProducts,
    getProductId,
    postProduct,
    putProduct,
    deleteProduct,
    getProductsFromPremium
}