const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('register');

registerBtn.addEventListener('click', () => {
    window.location.replace('/register')
})

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const user = Object.fromEntries(new FormData(event.target))
    try {
        fetch('/api/session/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {

                if (data.status === 'error') {
                    alert(data.message)
                }
                else {
                    alert(data.message)
                    window.location.replace('/products')
                }

            }).catch(
                error => alert(error));

    } catch (error) {
        fetch('/api/session/loginFail')
            .then(response => response.json())
            .then(data => console.log('Error: ', data))
            .catch(error => console.log('Error Message: ', error));
    }


})