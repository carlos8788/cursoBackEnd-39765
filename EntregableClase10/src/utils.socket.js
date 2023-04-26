import ProductManager from "./DAO/ProductManager.js";
const pm = new ProductManager()

export default function socketProducts(socketServer){
    socketServer.on('connection', async socket => {
    console.log('Client connection');
    const data = await pm.getProducts()
    // console.log(data);
    socket.emit('products', { data } )

    socket.on('product', async data => {

        try {
            
            console.log(data, 'evaluando stock');

            const valueReturned = await pm.addProduct(data)
            // console.log(valueReturned)
            socket.emit('message', valueReturned)
        }
        catch (err) {
            console.log(err);
        }

        // console.log(data)
    })

    socket.on('delete', async data => {
        console.log(data);
        const result = await pm.deleteProduct(data)
        console.log(result);
        socket.emit('delete', result)
    })

    
})
}
