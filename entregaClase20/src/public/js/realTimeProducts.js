const socket = io()
const products = document.getElementById('products');
const formulario = document.getElementById('form')


const btnEliminar = () => {
    const botones = document.getElementsByClassName('btn-danger')
    const arrayBtn = Array.from(botones)

    arrayBtn.forEach(element => {
        element.addEventListener('click', () => {
            console.log('click');
            Swal.fire({
                title: 'Do you want to delete this product?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                    actions: 'my-actions',
                    cancelButton: 'order-1 right-gap',
                    confirmButton: 'order-2',
                    denyButton: 'order-3',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(`The product with ID: ${element.id} was deleted`, '', 'success')
                    socket.emit('delete', element.id)

                } else {
                    Swal.fire('the product was not removed', '', 'info')
                }
            })

        })

    })
}

const forEachProduct = (data) => {
    let productos = ''
    data.forEach(producto => {
        productos += `<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
                        <div class="card-header">code: ${producto.code}</div>
                        <div class="card-body">
                            <h4 class="card-title">${producto.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${producto._id}
                                </li>
                                <li>
                                    description: ${producto.description}
                                </li>
                                <li>
                                    price: $${producto.price}
                                </li>
                                <li>
                                    category: ${producto.category}
                                </li>
                                <li>
                                    status: ${producto.status}
                                </li>
                                <li>
                                    stock: ${producto.stock}
                                </li>
                                <li>
                                    thumbnail: <img src="${producto.thumbnails}" alt="img"/>
                                </li>
                            </p>
                        </div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${producto._id}">Eliminar</button>
                        </div>
                        
                    </div>
                </div>`
    });
    products.innerHTML = productos
}

const productsByServer = ()=>{

    socket.on('products', data => {
        console.log('mensaje del servidor');
        forEachProduct(data.products)
        btnEliminar()
    })
}


formulario.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event.target);
    const product = Object.fromEntries(new FormData(event.target))
    product['status'] = new Boolean(product['status'])
    product['thumbnails'] = ['empty']
    product['price'] = Number(product['price'])
    product['stock'] = Number(product['stock'])

    socket.emit('product', product)

    socket.on('message', (res) => {
        if (res.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res.message,

            })
        }
        else {
            
            Swal.fire({
                icon: 'success',
                title: 'Added product',
                text: res.message,

            })
        }
    })
    productsByServer()
    formulario.reset()
})


productsByServer()







