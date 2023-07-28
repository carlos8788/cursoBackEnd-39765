const products = document.getElementsByClassName('product');
const btnCartFinal = document.getElementById('cartFinal');
const modalBody = document.getElementById('modalBody');
const modalFooter = document.getElementById('modalFooter');


const arrayProducts = Array.from(products);


const productsInCart = () => {
    fetch('/products/inCart')
        .then(response => response.json())
        .then(data => {
            
            if (data.cartLength > 0) {
                let products = ''
                let total = 0
                data.productsInCart.forEach((product, key) => {
                    products += `<h6>${key + 1}) ${product._id.title} : ${product.quantity}<h6>`
                    total += product.quantity * product._id.price;
                })

                modalBody.innerHTML = products
                modalFooter.innerHTML = `<h5>Total: $${Math.round(total * 100) / 100}</h5>`
            }
            else {
                modalBody.innerHTML = `<h3> Empty cart </h3>`
            }
        })
        .catch(err => console.log(err));

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

            if (stock >= Number(response.value) && Number(response.value) > 0) {
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
                }).then(() =>productsInCart())

                

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
            fetch('api/carts/usercarts')
                .then(response => response.json())
                .then(data => {                    
                    
                    if (data.payload.products.length > 0) {
                        window.location.href = '/ticket'
                    }
                    else {
                        Swal.fire({
                            title: 'Cart is empty',
                            text: 'The purchase was not made because the cart is empty',
                            icon: 'info'
                        })
                    }
                })
                .then(() =>productsInCart())
                .catch(error => console.log(error))

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



