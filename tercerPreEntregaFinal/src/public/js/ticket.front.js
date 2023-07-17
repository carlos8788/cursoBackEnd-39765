// fetch('api/cart')
const cartId = document.querySelector('.card-header').id;
const cardBody = document.querySelector('.card-body')
const totalBuy = document.getElementById('totalBuy')
const btnPurchaseCart = document.getElementById('btnPurchaseCart')
const idBtns = document.querySelectorAll('.btn-danger')
console.log(idBtns);
console.log(btnPurchaseCart);
let productsFront = '';
let total = 0;

const getProducts = async (id) => {
    try {
        const response = await fetch(`api/carts/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }

}

const productsInBody = async (products) => {
    if (products.length === 0) {
        window.location.replace('/products')
    }
    else {
        for (let product of products) {

            respose = await fetch(`api/products/${product._id._id}`);
            data = await respose.json();
            console.log(data.stock);
            let available = (data.stock > product.quantity)
                ? '<button class="btn btn-outline-success m-auto m-md-0 m-0 p-0" disabled>Available</button>'
                : '<button class="btn btn-outline-warning m-auto m-md-0 m-0 p-0" disabled>Quantity not available</button>'
            let subtotal = (data.stock > product.quantity)
                ? Math.round((product._id.price * product.quantity) * 100) / 100
                : 0
            productsFront +=
                `<div class="card my-2">
                <div class="card-body">
                    <h5 class="card-title">Title: ${product._id.title}</h5>
                    <p class="card-text">Price: ${product._id.price}</p>
                    <div class="d-flex justify-content-between align-items-center my-2">
                        <p class="card-text m-0 p-0">Quantity: ${product.quantity}</p>      
                        ${available} 
                    </div>
                    <div class="d-flex justify-content-between align-items-center my-auto ">
                        <p class="card-text m-0">Subtotal: ${subtotal}</p>
                        <button type="button" class="btn btn-danger m-auto m-md-0" id="${product._id._id}">
                            delete
                        </button>
                    </div>
                </div>
            </div>
            `
            total += subtotal
            console.log(product._id._id);
        }
        
        cardBody.innerHTML = productsFront
        totalBuy.innerHTML = `Total: $${Number(total.toFixed(2))}`
        btnDelete(cartId)
    }
}

const btnDelete = (cartID) => {
    console.log('entro?');
    const idBtns = document.querySelectorAll('.btn-danger')
    console.log(idBtns);
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

const purchaseCart = (cartID) => {
    btnPurchaseCart.addEventListener('click', async () => {
        console.log('purchaseCart');
        const response = await fetch(`/api/carts/${cartID}/purchase`, {
            method: 'POST',
            body: JSON.stringify({
                amount: total,

            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            data = await response.json()
            Swal.fire(
                'Success!',
                data.message,
                'success'
            )
            setTimeout(() => {
                window.location.replace('/');
            }, 3000);
        }
        else {
            data = await response.json()
            const result = await Swal.fire({
                title: data.message + '!\nWhat do you want to do?',
                text: "Solve the problem or leave this page?",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Solve the problem',
                confirmButtonText: 'Leave this page'
            })

            if (result.isConfirmed) {
                window.location.replace('/products');
            }
        }

    });
}

const main = async () => {
    const data = await getProducts(cartId)
    productsInBody(data.payload.products)
    
    purchaseCart(cartId)

}

main();