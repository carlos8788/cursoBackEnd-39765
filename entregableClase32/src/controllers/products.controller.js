
import { productService } from '../services/index.js';
import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/constant.js';


const getProducts = async (req, res) => {
    try {
        let { limit, page, sort, category, filterStock } = req.query


        if (filterStock) {
            try {

                const products = await productService.getProductsViewService()

                const filterByStock = products.filter(product => product.stock <= Number(filterStock))

                return res.sendSuccessWithPayload(filterByStock);
            } catch (error) {
                console.log(error);
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
            return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        }

        const products = await productService.getProductsService({}, options);

        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
    } catch (err) {
        return (err);
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
        return res.status(200).send(result);

    } catch (err) {
        return (err);
    }

}

const postProduct = async (req, res) => {

    try {
        const product = req.body
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

        if (!title ||
            !description ||
            !price ||
            !code ||
            !stock ||
            !status ||
            !category ||
            !thumbnails) {
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
            Array.isArray(thumbnails)))
            return res.status(400).send({ message: 'type of property is not valid' })

        if (price < 0 || stock < 0) return res
            .status(400)
            .send({ message: 'Product and stock cannot be values less than or equal to zero' });

        const result = await productService.addProductService(product)

        if (result.code === 11000) return res
            .status(400)
            .send({ message: `E11000 duplicate key error collection: ecommerce.products dup key code: ${result.keyValue.code}` });

        return res.status(201).send(result);
    }
    catch (err) {
        console.log(err);
        return res.send({ message: err });

    }
}

const putProduct = async (req, res) => {
    try {
        const { pid } = req.params
        const product = req.body

        const result = await productService.updateProductService(pid, product);

        if (result.message) return res.status(404).send({ message: `ID: ${pid} not found` })

        return res.status(200).send(`The product ${result.title} whit ID: ${result._id} was updated`);
    }
    catch (err) {
        return res.send({ message: err });
    };

}

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params
        const result = await productService.deleteProductService(pid)

        if (!result) return res.status(404).send({ message: `ID: ${pid} not found` })

        return res.sendSuccess(`ID: ${pid} was deleted`);

    } catch (err) {
        return res.internalError(err.message)
    }
}
export default {
    getProducts,
    getProductId,
    postProduct,
    putProduct,
    deleteProduct
}