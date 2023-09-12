const addP = document.getElementById('addP');
const dashboard = document.getElementById('dashboard');

addP.addEventListener('click', () => {
    dashboard.innerHTML = '';
    const formAddProduct = `
                            <form id="product-form" class="container" method='POST'>
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="title" name="title" required>
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <input type="text" class="form-control" id="description" name="description" required>
                                </div>
                                <div class="mb-3">
                                    <label for="price" class="form-label">Price</label>
                                    <input type="number" class="form-control" id="price" name="price" required>
                                </div>
                                <div class="mb-3">
                                    <label for="code" class="form-label">Code</label>
                                    <input type="text" class="form-control" id="code" name="code" required>
                                </div>
                                <div class="mb-3">
                                    <label for="stock" class="form-label">Stock</label>
                                    <input type="number" class="form-control" id="stock" name="stock" required>
                                </div>
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="status" name="status">
                                    <label class="form-check-label" for="status">Status</label>
                                </div>
                                <div class="mb-3">
                                    <label for="category" class="form-label">Category</label>
                                    <input type="text" class="form-control" id="category" name="category" required>
                                </div>
                                <div class="mb-3">
                                    <label for="thumbnails" class="form-label">Thumbnails</label>
                                    <input type="url" class="form-control" id="thumbnails" name="thumbnails">
                                </div>
                                <input type="submit" class="btn btn-primary" value="Submit"/>
                            </form>

                            `
    dashboard.innerHTML = formAddProduct
    productForm()
})

const productForm = () => {
    document.getElementById('product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        let product = Object.fromEntries(new FormData(event.target))
        
        product.status = product.status === 'on';
        product.thumbnails = [product.thumbnails]
        product.price = Number(product.price)
        product.stock = Number(product.stock)
        fetch('api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Product added successfully',
                        icon: 'success'
                    })


                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Product not added',
                        icon: 'error'
                    })
                }
            })
            .catch((error) => {
                throw new Error(error);
            })
        document.getElementById('product-form').reset()
    })
}