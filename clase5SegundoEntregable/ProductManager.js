import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    };

    // Private methods


    #validateCodeProduct = (obj) => {
        let validateCode = this.products.find(property => property.code === Object.values(obj)[4]);
        if (validateCode) return console.log(`Could not add the product: "${obj.title}", its code is repeated: "${obj.code}" already exists`)
        this.#addId(obj);
    };

    #addId = (obj) => {
        (this.products.length > 0)
            ? obj.id = this.products.length + 1
            : obj.id = 1;
        this.products.push(obj)
        this.#saveProductsFS();

    };

    #checkID = async (id) => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const parseProducts = JSON.parse(getFileProducts);

            const findObj = parseProducts.find(product => product.id === id);
            // if (!findObj) return console.log(`Product not found. ID: ${id}`);
            if (!findObj) return false;
            return parseProducts;
        }

        catch (err) {
            console.log(err);
        }

    };

    // Methods for Fyle System

    #saveProductsFS = async () => {
        try {
            const toJSON = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return;
        }
        catch (err) {
            return console.log(err);

        }
    };

    getProducts = async () => {
        try {
            const readJSON = await fs.promises.readFile(this.path, 'utf-8')
            return console.log(`These are all the products:\n`, JSON.parse(readJSON));
        }
        catch (err) {
            return console.log(err);
        }
    };

    getProductById = async (id) => {
        try {
            const products = await this.#checkID(id)
            if (!products) {
                return console.log(`Product not found. ID: ${id}`);
            }
            return console.log(`The product is:`, products[id - 1]);
        }
        catch (err) {
            return console.log(err);
        }

    };

    updateProduct = async (id, updateObject) => {
        try {
            const products = await this.#checkID(id)
            if (!products) return console.log(`Product not found. ID: ${id}`);


            const returnedObject = Object.assign(products[id - 1], updateObject);

            products[id - 1] = returnedObject;
            this.products = products


            this.#saveProductsFS();
            return console.log(`The product was successfully updated:`, returnedObject);
        }
        catch (err) {
            return console.log(err);
        }


    }

    deleteProduct = async (id) => {

        try {
            const products = await this.#checkID(id)
            if (!products) return console.log(`Product not found. ID: ${id}`);

            products.splice(id - 1, 1);
            this.products = products;
            this.#saveProductsFS()
            return console.log(`the product ID:"${id}" has been successfully removed`);;
        }
        catch (err) {
            return console.log(err);
        }


    }

    // Public methods

    addProduct = (title, description, price, thumbail, code, stock) => {

        const product = {
            title,
            description,
            price,
            thumbail,
            code,
            stock
        }

        console.log(`adding product ${product.title}...`);

        (Object.values(product).every(property => property))
            ? this.#validateCodeProduct(product)
            : console.log('Product could not be added, is not complete');
    };

};




const productsInstance = new ProductManager('./db.json');

// ***** AGREGA LOS PRODUCTOS AL JSON *****

productsInstance.addProduct("Leche", "Leche descremada", 150, "./img/leche.png", 123, 200)
productsInstance.addProduct("Pan", "Pan de centeno", 250, "./img/pan.png", 456, 100)
productsInstance.addProduct("Jamon crudo", "Jamon premium", 750, "./img/jamonCrudo.png", 789, 50)
productsInstance.addProduct("Jamon codido", "Jamon oferta", 300, "./img/jamonCocido.png", 789, 40)
productsInstance.addProduct("Salame", "Milan", 320, "./img/salame.png", 781, 60)
productsInstance.addProduct("Queso Azul", "Roquefort", 1300, "./img/quesoAzul.png", 723, 111)
productsInstance.addProduct("Paleta", "paleta oferta", 200, "./img/paleta.png", 7839, 320)


// ***** MUESTRA LOS PRODUCTOS DESDE EL JSON *****

// productsInstance.getProducts()

// ***** MUESTRA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

// productsInstance.getProductById(7)
// productsInstance.getProductById(2)


// ***** ACTUALIZA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

// productsInstance.updateProduct(2, {
//     "title": "Pan",
//     "description": "Pan de centeno",
//     "price": 300,
//     "thumbail": "./img/pan.png",
//     "code": 456,
//     "stock": 205,
//   },)

// ***** ELIMINA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

// productsInstance.deleteProduct(2)