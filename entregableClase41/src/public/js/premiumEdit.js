const viewP = document.getElementById('viewP');
const editP = document.getElementById('editP');
const dashboard = document.getElementById('dashboard');
import { deleteProduct } from "./premiumDelete.js";

const url = 'api/products/premium'

viewP.addEventListener('click', () => {
    viewProducts();
})



const viewProducts = () => {
    fetch(url)
        .then((response) => response.json())
        .then(data => {

            dashboard.innerHTML = ``;
            let result = ''
            data.payload.forEach((p, index) => {
                result += `<div class="text-center text-dark h4 ${(index % 2 === 0) ? "bg-primary" : "bg-secondary"} my-3 p-2 d-flex justify-content-between ">
                                ${index + 1}) ${p.title} - ${p.price}- ${p.stock}
                                <a class="btn btn-danger btn-delete-product" id="${p._id}">Eliminar</a>
                           </div>
                          `
            });
            dashboard.innerHTML = result
            deleteProduct()
        })
        .catch(error => { throw new Error(error) })
}


editP.addEventListener('click', () => {
    fetch(url)

        .then((response) => response.json())
        .then(data => {

            dashboard.innerHTML = ``;
            dashboard.className = ''
            const container = document.createElement('select');
            container.className = 'm-auto form-select'
            container.id = 'id-select'
            const option = document.createElement('option');
            option.textContent = 'Seleccione un producto'
            option.disabled = true
            option.selected = true;
            container.appendChild(option)
            data.payload.forEach((p, index) => {
                const result = document.createElement('option');
                result.value = p._id
                result.textContent = p.title
                container.appendChild(result);
            });
            dashboard.appendChild(container)
            productEditSelect()
        })
        .catch(error => { throw new Error(error) })
})

const productEditSelect = () => {
    document.getElementById('id-select').addEventListener('change', function () {
        
        fetch('api/products/' + this.value)
            .then(response => response.json())
            .then(data => {
                const form = document.createElement('form');
                document.getElementById('container-edit-product').innerHTML = ''
                form.method = 'PATCH'
                form.id = 'product-edit-select';
                form.className = 'row g-3'; // Agrega la clase de Bootstrap para la disposición de la cuadrícula
                let bodyForm = ''
                bodyForm = `        
                                    
                                        
                                    <input type="text" class="form-control" value="${data._id}" name="id" hidden id="product-id" />
                                    
                                    <div class="col-md-6">
                                        <label for="title" class="form-label">Title</label>
                                        <input type="text" class="form-control" value="${data.title}" name="title" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="description" class="form-label">Description</label>
                                        <input type="text" class="form-control" value="${data.description}" name="description" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="price" class="form-label">Price</label>
                                        <input type="number" class="form-control" value="${data.price}" name="price" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="stock" class="form-label">Stock</label>
                                        <input type="number" class="form-control" value="${data.stock}" name="stock" />
                                    </div>
                                    <div class="col-md-12 text-center mt-3">
                                        <input type="submit" class="btn btn-primary" value="Edit Product"/>
                                    </div>
                                `;
                form.innerHTML = bodyForm;
                document.getElementById('container-edit-product').appendChild(form);
                btnEditProduct()

            })
    })
}

const btnEditProduct = () => {
    document.getElementById('product-edit-select').addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = document.getElementById('product-id').value;

        const product = Object.fromEntries(new FormData(event.target))
        
        fetch('api/products/' + productId, {
            "method": 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            "body": JSON.stringify(product)
        })
            .then(response => {
                if (!response.ok && response.status === 500) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Price or stock is negative!',
                        icon: 'error'
                    })
                    throw new Error('error');
                }
            }

            )
            .catch((error) => {
                throw new Error(error);
            })
    })
}

viewProducts()