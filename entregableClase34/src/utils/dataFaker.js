import {faker} from '@faker-js/faker/locale/es';



export const generateUser = () =>{
    const numOfProducts = parseInt(faker.number.int({min:1, max:10}))
    let products = [];

    for(let i=0; i<numOfProducts; i++){
        products.push(generateProduct())
    }

    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        age: faker.number.int({min:18, max:70}),
        carts: {
            id: faker.database.mongodbObjectId(),
            products,
        },
        role: 'user',
        password: faker.internet.password({ length: 20 }),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
    }
}

export const generateProduct = () =>{
    const categories = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5']
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(15),
        stock: faker.number.int({min:1, max:50}),
        id: faker.database.mongodbObjectId(),
        category: faker.helpers.arrayElement(categories),
        status: true,
        thumbnail: faker.image.urlLoremFlickr({ category: 'food' }),
        
    }
}