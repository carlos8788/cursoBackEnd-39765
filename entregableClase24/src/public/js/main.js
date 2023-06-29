const btnLogout = document.getElementById('logout')
const carts = document.getElementById('carts');

try {
    btnLogout.addEventListener('click', () => {
    Swal.fire({
        title: 'Do you want to close the session?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#73be73',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then(response => {
        if (response.isConfirmed) {
            fetch('/api/session/logout')
                .then(window.location.replace('/login'))
        }
        else {
            Swal.fire({
                title: 'The session has not been closed',
                icon: 'info'
            })
        }
    }

    )

})
} catch (error) {
    console.error(error);
}

carts.addEventListener('click', () => {
    window.location.href = '/carts'
});

