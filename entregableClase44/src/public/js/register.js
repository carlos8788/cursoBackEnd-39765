const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', event => {
  event.preventDefault();

  const user = Object.fromEntries(new FormData(event.target))

  fetch('/api/session/register', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {

      if (data.status === 'error') {
        Swal.fire({
          title: data.error,
          icon: 'error'
      })
      }
      else {
        
        window.location.replace('/login')
      }

    })


})