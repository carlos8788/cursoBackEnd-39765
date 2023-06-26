const products = document.getElementsByClassName('product');
const btnCartFinal = document.getElementById('cartFinal');
const modalBody = document.getElementById('modalBody');
const btnLogout = document.getElementById('logout');

const jwt = localStorage.getItem('authToken');
console.log(jwt);
fetch('/products',{
    headers:{
        authorization: 'Bearer ' + jwt
    }
})

btnLogout.addEventListener('click', () => {
    Swal.fire({
        title: 'Do you want to close the session?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#73be73',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then(response => {
        if (response.isConfirmed) {
            fetch('http://localhost:8080/api/session/logout')
                .then(window.location.replace('/login'))
        }
        else{
            Swal.fire({
                title: 'The session has not been closed',
                icon: 'info'
            })
        }
    }

    )

})

const arrayProducts = Array.from(products);

const productsInCart = () => {
    fetch('http://localhost:8080/products/inCart')
        .then(response => response.json())
        .then(data => {

            if (data.cartLength > 0) {
                let products = ''
                data.productsInCart.forEach((product, key) => {
                    products += `<h6>${key + 1}) ${product.title} : ${product.quantity}<h6>`
                })

                modalBody.innerHTML = products
            }

            else {
                modalBody.innerHTML = `<h3> Empty cart </h3>`
            }
        });

}

arrayProducts.forEach(product => {
    product.addEventListener('click', () => {

        const stock = Number(product.getAttribute('data-value'))
        Swal.fire({
            title: 'Add quantity',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirm',
        }).then(response => {

            if (stock > Number(response.value) && Number(response.value) > 0) {
                Swal.fire({
                    title: 'Product added successfully',
                    text: `ID: ${product.id} - Quantity: ${response.value}`,
                    icon: 'success',

                })
                fetch('http://localhost:8080/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product: { _id: product.id, quantity: Number(response.value) } }),
                })

                productsInCart()

            }
            else if (Number(response.value) < 0) {
                Swal.fire({
                    title: 'Quantity must be greater than 0',
                    icon: 'warning'
                })
            }

            else {
                Swal.fire({
                    title: 'Quantity cannot be greater than stock',
                    icon: 'error',

                })
            }
        })
    })
});

btnCartFinal.addEventListener('click', () => {
    Swal.fire({
        title: 'Do you want to finish the purchase?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#73be73',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then(response => {
        if (response.isConfirmed) {
            fetch('http://localhost:8080/products/inCart')
                .then(response => response.json())
                .then(data => {
                    if (data.cartLength > 0) {
                        fetch('http://localhost:8080/products', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ finishBuy: true }),
                        }).then(
                            Swal.fire({
                                title: 'Completed purchase!',
                                icon: 'success'
                            }
                            )
                        ).then(
                            modalBody.innerHTML = `<h3> Empty cart </h3>`
                        )
                    }
                    else {
                        Swal.fire({
                            title: 'Cart is empty',
                            text: 'The purchase was not made because the cart is empty',
                            icon: 'info'
                        })
                    }
                })
        }
        else {
            Swal.fire({
                title: 'The purchase has not been made yet',
                icon: 'info'
            }

            )
        }
    });

})


productsInCart()
