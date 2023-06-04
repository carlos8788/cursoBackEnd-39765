let container = document.getElementById('test')

async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error en la solicitud: ' + error);
    }
  }
  
  async function displayProducts() {
    try {
      const products = await fetchProducts();
      let productsInFront = '';
      products.payload.forEach(product => {
        productsInFront += `
          <li>${product.title}</li>
          <li>${product.description}</li>
          <li>${product.status}</li>
          <li>${product.price}</li>
          <li>${product.stock}</li>
          <img src="${product.thumbnails}" alt="${product._id}">
        `;
      });
      container.innerHTML = productsInFront
    } catch (error) {
      console.error(error);
    }
  }
  
  displayProducts();

