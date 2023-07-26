const carts = document.getElementById('userCarts');

async function fetchUserCarts() {
    let response = await fetch('/api/carts/usercarts/');
    response = await response.json();
    return response
}

async function handleData() {
    try {
        const data = await fetchUserCarts();
        if (data.message.length > 0) {
            let dataParse = ''
            data.message.map((cart, key) => {
                const {datePart, timePart} = dateString(cart.created_at);
                dataParse += `<a href="/carts/${cart._id}" class="btn btn-info tex-center p-4 mx-auto my-4">${key + 1}) Cart</a>
                <p>Created at: ${datePart} / ${timePart}</p>`
                return dataParse
            });
            carts.innerHTML = dataParse;
        }
        else {
            carts.innerHTML = '<h2>You have not bought any cart yet</h2>'
        }

    } catch (error) {
        console.log(error);
    }
}

handleData();


const dateString = data => {

    let date = new Date(data);

    let datePart = date.toISOString().split('T')[0];
    let timePart = date.toISOString().split('T')[1].split('.')[0];

    return {datePart, timePart};
}