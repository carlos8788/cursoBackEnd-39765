import ProductManager from "../DAO/mongo/managers/products.js"
const pm = new ProductManager()

export default function socketProducts(socketServer) {
    socketServer.on('connection', async socket => {

        const products = await pm.getProducts()

        socket.emit('products', { products })

        socket.on('product', async data => {

            try {
                const {
                    title,
                    description,
                    price,
                    code,
                    stock,
                    status,
                    category,
                    thumbnails
                } = data
                
                const checkProduct = Object.values({
                    title,
                    description,
                    price,
                    code,
                    stock,
                    status,
                    category,
                    thumbnails
                }).every(property => property)
        
                if(!checkProduct) {
                    return socket.emit('message', { status: 'error', message:"The product doesn't have all the properties" })
                }
        
                if (!(typeof title === 'string' && 
                        typeof description === 'string' && 
                        typeof price === 'number' && 
                        typeof code === 'string' && 
                        typeof stock === 'number' && 
                        typeof status === 'boolean' && 
                        typeof category === 'string' && 
                        Array.isArray(thumbnails))) 
                        return socket.emit('message', { status: 'error',message:'type of property is not valid' })

                if (data.price < 0 || data.stock < 0) {
                    return socket.emit('message', { status: 'error', message: 'Product or stock cannot be values less than or equal to zero' })
                }

                const result = await pm.addProduct(data)
                
                const products = await pm.getProducts()
                socket.emit('message', { status: 'success', message: `The product ${result.title} was added` } )
                return socket.emit('products', { products })
            }
            catch (err) {
                console.log(err);
            }

        })

        socket.on('delete', async data => {
            // console.log(data)
            await pm.deleteProduct(data)
            const products = await pm.getProducts()
            socket.emit('products', { products })
        })
    })

}
