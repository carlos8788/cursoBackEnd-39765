// fetch('api/cart')
const cartId = document.querySelector('.card-header').id;
const cardBody = document.querySelector('.card-body')
const totalBuy = document.getElementById('totalBuy')

const getProducts = async (id) => {
    try {
        const response = await fetch(`api/carts/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }

}

const productsInBody = (products) => {
    let productsFront = '';
    let total = 0;
    if(products.length === 0) {
        window.location.replace('/products')
    }
    products.forEach(product => {
        productsFront +=
            `<div class="card my-2">
                <div class="card-body">
                    <h5 class="card-title">Title: ${product._id.title}</h5>
                    <p class="card-text">Price: ${product._id.price}</p>
                    <p class="card-text">Quantity: ${product.quantity}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="card-text m-0">Subtotal: ${Math.round((product._id.price * product.quantity) * 100) / 100}</p>
                        <button type="button" class="btn btn-danger m-auto m-md-0" id="${product._id._id}">
                            delete
                        </button>
                    </div>
                </div>
            </div>
            `
        total += product._id.price * product.quantity
    })
    cardBody.innerHTML = productsFront
    totalBuy.innerHTML = `Total: $${Number(total.toFixed(2))}`
}

const btnDelete = (cartID) => {
    const idBtns = document.querySelectorAll('.btn-danger')
    // /:cid/product/:pid
    // Array.from(idBtns).forEach(btn => {
    //     btn.addEventListener('click', async () => {
    //         Swal.fire({
    //             title: 'Are you sure delete this product?',
    //             text: "You won't be able to revert this!",
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Yes, delete it!'
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 try {
    //                     const url = `/api/carts/${cartID}/product/${btn.id}`
    //                     console.log(url);
    //                     const response = await fetch(url,
    //                         {

    //                             method: 'DELETE',
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                             }
    //                         }
    //                     )
    //                     const data = await response.json()

    //                 } catch (error) {
    //                     console.log(error);
    //                 }
    //                 //   Swal.fire(
    //                 //     'Deleted!',
    //                 //     'Your file has been deleted.',
    //                 //     'success'
    //                 //   )
    //             }
    //         })


    //     })
    // })
    Array.from(idBtns).forEach(btn => {
        btn.addEventListener('click', () => {
            const deleteProduct = async () => {
                const result = await Swal.fire({
                    title: 'Are you sure delete this product?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                });
    
                if (result.isConfirmed) {
                    try {
                        const url = `/api/carts/${cartID}/product/${btn.id}`;
                        const response = await fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        const data = await response.json();
                        
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    } catch (error) {
                        console.log(error);
                    }
                }
            };
    
            deleteProduct();
        })
    });
    
}

const main = async () => {
    const data = await getProducts(cartId)
    productsInBody(data.payload.products)
    btnDelete(cartId)

}

main();