const products = document.getElementsByClassName('product');
const iconCart = document.getElementById('number')

const arrayProducts = Array.from(products);


arrayProducts.forEach(product => {
    product.addEventListener('click', () => {
        const stock = Number(product.getAttribute('data-value'))
        Swal.fire({
            title: 'Submit your Github username',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
        }).then(response => {
            console.log(response);
            if (stock > Number(response.value)) {
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
                    body: JSON.stringify({ _id: product.id, quantity: Number(response.value) }),
                }
                )
                
            }
        })
        console.log(cart);
    })
});
