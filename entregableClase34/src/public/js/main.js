const btnLogout = document.getElementById('logout')

// const ticketsView = document.getElementById('tickets');

const productsPage = document.getElementById('productsPage')

const ticketsPurchases = document.getElementById('ticketsPurchases');


document.addEventListener('DOMContentLoaded', (event) => {
    console.log('event');
});



productsPage.addEventListener('click', () => {
    try {
        window.location.href ='/products'
    } catch (error) {
        console.log(error);
    }
})
ticketsPurchases.addEventListener('click', () => {
    try {
        window.location.href = '/allTickets'
    } catch (error) {
        console.log(error);
    }
})

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
            fetch('/api/session/logout',
            {
                method: 'POST',
                origin: 'same-origin',
            })
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


// ticketsView.addEventListener('click', () => {
//     window.location.href = '/allTickets'
// })
