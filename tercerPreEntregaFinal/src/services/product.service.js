export default class ProductService{
    constructor(dao){
        this.dao = dao;
    }
    categoriesService = () => {
        return this.dao.categories();
    }
    getProductsViewService = () => {
        return this.dao.getProductsView()
    }
    getProductsService = (filter, options) => {
        return this.dao.getProducts(filter, options)
    }
    getProductByIdService = (id) => {
        return this.dao.getProductById(id)
    }
    addProductService = (product) => {
        return this.dao.addProduct(product)
    }
    updateProductService = (id, product) => {
        return this.dao.updateProduct(id, product)
    }
    deleteProductService = (id) => {
        return this.dao.deleteProduct(id)
    }
}