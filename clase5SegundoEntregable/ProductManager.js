import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    };

    // Private methods


    #validateCodeProduct = async (obj) => {
        let validateCode = this.products.find(property => property.code === Object.values(obj)[4]);
        if (validateCode) return console.log(`Could not add the product: "${obj.title}", its code is repeated: "${obj.code}" already exists`)
        await this.#addId(obj);
    };


    #addId = async (obj) => {
        (this.products.length > 0)
            ? obj.id = this.products[this.products.length - 1].id + 1
            : obj.id = 1;
        this.products.push(obj)
        await this.#saveProductsFS();

    };

    #checkID = async (id) => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const parseProducts = JSON.parse(getFileProducts);

            const findObj = parseProducts.find(product => product.id === id);
            if (!findObj) return null;
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
        if (fs.existsSync(this.path)) {
            try {
                const readJSON = await fs.promises.readFile(this.path, 'utf-8')
                console.log(`These are all the products:\n`, JSON.parse(readJSON));
                return JSON.parse(readJSON)
            }
            catch (err) {
                console.log(err);
                return [];
            }
        }
        console.log(`The file does not exist`);
        return [];

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

    updateProduct = async (pid, updateObject) => {
        try {
            const productsOfFS = await this.#checkID(pid)

            this.products = productsOfFS.map(element => {
                if(element.id == pid){
                    element = Object.assign(element, updateObject);
                   return element
                }
                return element
            })


            this.#saveProductsFS();
            return console.log(`The product was successfully updated:`, this.products);
        }
        catch (err) {
            return console.log(err);
        }


    }

    deleteProduct = async (id) => {

        try {
            const products = await this.#checkID(id)
            if (!products) return console.log(`Product not found. ID: ${id}`);

            this.products = products.filter(product => product.id !== id)

            this.#saveProductsFS()
            return console.log(`the product ID:"${id}" has been successfully removed`);;
        }
        catch (err) {
            return console.log(err);
        }


    }

    // Public methods

    addProduct = async (title, description, price, thumbail, code, stock) => {
        this.products = await this.getProducts()
        console.log(this.products)
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
const test = async () => {
    // await productsInstance.addProduct("Leche", "Leche descremada", 150, "./img/leche.png", 123, 200)
    // await productsInstance.addProduct("Pan", "Pan de centeno", 250, "./img/pan.png", 456, 100)
    // await productsInstance.addProduct("Jamon crudo", "Jamon premium", 750, "./img/jamonCrudo.png", 1234, 50)
    // await productsInstance.addProduct("Jamon codido", "Jamon oferta", 300, "./img/jamonCocido.png", 789, 40)
    // await productsInstance.addProduct("Salame", "Milan", 320, "./img/salame.png", 781, 60)
    // await productsInstance.addProduct("Queso Azul", "Roquefort", 1300, "./img/quesoAzul.png", 723, 111)
    // await productsInstance.addProduct("Paleta", "paleta oferta", 200, "./img/paleta.png", 7839, 320)


    // ***** MUESTRA LOS PRODUCTOS DESDE EL JSON *****

    // await productsInstance.getProducts()

    // ***** MUESTRA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

    // await productsInstance.getProductById(7)
    // await productsInstance.getProductById(2)


    // ***** ACTUALIZA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

    // await productsInstance.updateProduct(2, {
    //     "title": "Pan",
    //     "description": "Pan de masa madre",
    //     "price": 300,
    //     "thumbail": "./img/pan.png",
    //     "code": 456,
    //     "stock": 205,
    // },)

    // ***** ELIMINA EL PRODUCTO SEGÚN EL ID DESDE EL JSON *****

    await productsInstance.deleteProduct(7)
};

test();
