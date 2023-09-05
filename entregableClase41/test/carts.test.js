import { before } from "mocha";

export const cartTests = (expect, request) => {


    describe('API Endpoints - Cart Operations', function () {

        let userID

        it('Obtener ID del usuario', async function () {

            const result = await request.get('/api/session/current').set('Cookie', sessionCookie);
            userID = result._body.payload.id

        });

        console.log(userID);

        // let userId;
        // let createdProductId;
        // let cartId;

        // it('Debe crear un nuevo carrito', async function () {
        //     // Datos de muestra para un nuevo carrito
        //     const newCart = {
        //         products: [
        //             {
        //                 _id: "SOME_PRODUCT_ID",  // Asegúrate de que este producto exista en tu base de datos de prueba
        //                 quantity: 5
        //             },
        //             {
        //                 _id: "ANOTHER_PRODUCT_ID",  // Asegúrate de que este producto exista también
        //                 quantity: 3
        //             }
        //         ],
        //         userId: userId
        //     };

        //     const response = await request.post('/api/carts').send(newCart);
        //     cartId = response._body.payload._id;
        //     expect(response.status).to.be.eql(200);  // asumimos que 200 es el código de estado para una operación exitosa
        //     expect(response.body).to.have.property('_id');  // verifica que el carrito devuelto tiene un ID
        //     expect(response.body.products).to.be.an('array').that.is.not.empty;  // verifica que el carrito tiene productos
        //     expect(response.body.user).to.be.eql(userId);  // verifica que el userId del carrito es el que enviaste
        // });

        // it('Debe agregar un producto al carrito', async () => {

        //     const newProduct = {
        //         title: 'Test Product',
        //         description: 'Test Description',
        //         price: 50,
        //         code: 'TEST_CODE_123',
        //         stock: 100,
        //         status: true,
        //         category: 'Test Category',
        //         thumbnails: ['img.com'],
        //         owner: 'test@user.com',
        //     };

        //     const productResponse = await request.post('/api/products').send(newProduct);

        //     expect(productResponse.status).to.be.eql(201);
        //     createdProductId = productResponse.body._id;


        //     const cartResponse = await request.post(`/api/carts/${cartId}/products/${createdProductId}`).send({ quantity: 5 });

        //     expect(cartResponse.status).to.be.eql(200);
        //     expect(cartResponse.body.cart).to.have.property('products');
        //     expect(cartResponse.body.cart.products).to.include(createdProductId);
        // });







        // it('Debe recuperar un carrito por su ID', async function () {
        //     const cartResponse = await request.get(`/api/carts/${cartId}`);

        //     expect(cartResponse.status).to.be.eql(200);  // Asumimos que 200 es el código de estado para una operación exitosa
        //     expect(cartResponse.body).to.have.property('_id').which.equals(cartId);  // Verifica que el ID del carrito devuelto coincide con el ID solicitado
        //     expect(cartResponse.body).to.have.property('products').that.is.an('array');  // Verifica que el carrito tiene un array de productos
        // });

    });

}
