import { expect } from 'chai';
import supertest from 'supertest';


const request = supertest('http://localhost:8080');


describe('API Endpoints - Session Operations', function () {


    // SESSIONS ****************************************************************

    let sessionCookie;
    let cartID;
    it('Debe registrar un nuevo usuario', async function () {
        const newUser = {
            first_name: "Test",
            last_name: "Luis",
            email: "luisTestM@test.com",
            age: 30,
            role: "premium",
            password: "testPassword123"
        };

        const registerResponse = await request.post('/api/session/register').send(newUser);

        expect(registerResponse.status).to.be.eql(201);

    });

    it('Debe loguearse con email y password', async function () {
        const userTest = {
            email: "luisTestM@test.com",
            password: "testPassword123"
        }
        const loginResponse = await request.post('/api/session/login').send(userTest);


        sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
        const cookieName = sessionCookie.split('=')[0];
        const cookieValue = sessionCookie.split('=')[1];

        expect(loginResponse.status).to.be.eql(200);
        expect(cookieName).to.be.eql('authToken');
        expect(cookieValue).to.be.ok;

    });

    it('Debe comprobar la sesion del usuario', async function () {
        const checkSessionResponse = await request.get('/api/session/current').set('Cookie', sessionCookie);

        expect(checkSessionResponse.status).to.be.eql(200);
        expect(checkSessionResponse._body.payload).to.have.property('id');
        expect(checkSessionResponse._body.payload).not.to.have.property('password');
        cartID = checkSessionResponse._body.payload.cart

    });

    // PRODUCT ****************************************************************

    let createdProductID;

    it('Debe crear un nuevo producto', async function () {
        const newProduct = {
            title: "test_product",
            description: "Descripción de prueba",
            price: 100,
            code: "TEST_CODE_PRODUCT_",
            stock: 50,
            category: "Categoria de prueba",
            status: true,
            thumbnails: [
                "img.png"
            ]
        }

        const response = await request.post('/api/products/').set('Cookie', sessionCookie).send(newProduct);

        expect(response.status).to.be.eql(201);
        createdProductID = response._body._id;
    });

    it('Debe consultar el producto creado', async function () {
        const response = await request.get(`/api/products/${createdProductID}`);

        expect(response.status).to.be.eql(200);
        expect(response.body.title).to.be.eql("test_product");
    });

    it('Debe editar la cantidad en stock del producto', async function () {
        const updatedProductData = {
            stock: 60
        };

        const response = await request.patch(`/api/products/${createdProductID}`).set('Cookie', sessionCookie).send(updatedProductData);
        expect(response.status).to.be.eql(200);
        const getProduct = await request.get(`/api/products/${createdProductID}`);
        expect(getProduct._body.stock).to.be.eql(60);
    });

    // CART ****************************************************************

    it('Debe ingresar un producto en el carrito del usuario', async function () {
        
        const quantity = {
            quantity:10
        }

        const addProduct = await request.post(`/api/carts/${cartID}/product/${createdProductID}`).set('Cookie', sessionCookie).send(quantity);
        
        
        
        expect(addProduct.status).to.be.eql(200);
        expect(addProduct._body.cart.products).to.be.an('array').that.is.not.empty;

    })

    it('Comprueba el carrito', async function () {
        const cart = await request.get(`/api/carts/${cartID}`).set('Cookie', sessionCookie);
        
        expect(cart.status).to.be.eql(200);
        expect(cart._body.payload.products).to.be.an('array');
    })

    it('Vacía el carrito', async function () {
        const cart = await request.delete(`/api/carts/${cartID}`).set('Cookie', sessionCookie);
        
        expect(cart.status).to.be.eql(200);
        expect(cart._body.cart.products).to.be.an('array').that.is.empty;

    })
});
