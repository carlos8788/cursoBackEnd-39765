async function fetchUserCarts() {
    let response = await fetch('/api/carts/usercarts/');
    response = await response.json();
    console.log(response);
}

fetchUserCarts();
