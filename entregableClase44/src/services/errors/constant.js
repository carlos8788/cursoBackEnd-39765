export const generateUserErrorInfo = (user) => {
    return `One or more properties were invalid or incomplete.
    List of properties:
    * first_name: needs to be a string, received ${user.first_name}
    * last_name: needs to be a string, received ${user.last_name}
    * email: needs to be a string, received ${user.email}
    `;
}

export const generateProductErrorInfo = (product) => {
    return `One or more product data is incorrect:
    * A string type was expected for "title", received ${typeof product.title}
    * A string type was expected for "description", received ${typeof product.description}
    * A numeric type was expected for "price", received ${typeof product.price}
    * A string type was expected for "code", received ${typeof product.code}
    * An integer type was expected for "stock", received ${typeof product.stock}
    * A boolean type was expected for "status", received ${typeof product.status}
    * A string type was expected for "category", received ${typeof product.category}
    * An array type was expected for "thumbnails", received ${typeof product.thumbnails}`;
}


