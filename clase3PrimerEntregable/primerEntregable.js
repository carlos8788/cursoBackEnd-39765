class ProductManager {

    constructor() {
        this.products = [];
    };

    // Private methods

    #validatePropsProduct = (obj) => {
        (Object.values(obj).every(property => property))
            ? this.#validateCodeProduct(obj)
            : console.log('Product could not be added, is not complete');
        };
    
    #validateCodeProduct = (obj) => {
        let validateCode = this.products.find(property=> property.code === Object.values(obj)[4]);
        if (validateCode) return console.log(`Could not add the product: "${obj.title}", its code is repeated: "${obj.code}" already exists`)
        this.#addId(obj);    
    };

    #addId = (obj) => {
        (this.products.length > 0)
            ?obj.id = this.products.length + 1
            :obj.id = 1;
        this.products.push(obj);
    }

    // Public methods

    addProduct = (title,
                    description,
                    price,
                    thumbail,
                    code,
                    stock) => {
        const product = {
            title,
            description,
            price,
            thumbail,
            code,
            stock
        }
        this.#validatePropsProduct(product)
    };

    getProducts = () => {
        console.log(`These are all the products:\n ${this.products}`);
    };

    getProductById = (id) => {
        const obj = this.products.find(product => product.id === id);
        (obj) ? console.log(`The product is: ${obj}`) : console.log('Product not found');
    }

};


const productsInstance = new ProductManager();
productsInstance.addProduct("Leche","Leche descremada",150,"./img/leche.png",123,200)
productsInstance.addProduct("Pan","Pan de centeno",250,"./img/pan.png",456,100)
productsInstance.addProduct("Jamón crudo","Jamón premium",750,"./img/jamonCrudo.png",789,50)
productsInstance.addProduct("Jamón codido","Jamón oferta",300,"./img/jamonCocido.png",789,60)

productsInstance.getProducts()

productsInstance.getProductById(4)

productsInstance.getProductById(3)