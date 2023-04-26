import ProductManager from "./DAO/ProductManager.js";
const pm = new ProductManager()

export default function socketProducts(socketServer){
    socketServer.on('connection', async socket => {
    
    const data = await pm.getProducts()
  
    socket.emit('products', { data } )

    socket.on('product', async data => {

        try {
        
            const valueReturned = await pm.addProduct(data)
          
            socket.emit('message', valueReturned)
        }
        catch (err) {
            console.log(err);
        }

 
    })

    socket.on('delete', async data => {

        const result = await pm.deleteProduct(data)
        
        socket.emit('delete', result)
    })

    
})
}
