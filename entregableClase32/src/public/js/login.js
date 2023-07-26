const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('register');



loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const actions = {
        'user': () => window.location.replace('/products'),
        'ADMIN': () => window.location.replace('/admin'), 
    };

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
                
                const action = actions[data.user.userRole];
                
                if (action) {
                    action();
                } else {
                    Swal.fire({
                        title: 'Login failed, please check your username and password',
                        icon: 'warning'
                    });
                }
            });

    } catch (error) {

        console.log(error);

    }


})




registerBtn.addEventListener('click', () => {
    window.location.replace('/register')
})
