const btnChangeRole = document.getElementById('btn-change-role');
const role = document.getElementById('role');
const id = document.getElementById('ID')
const divContainer = document.getElementById('id-container');
btnChangeRole.addEventListener('click', function () {
    fetch('api/users/premium/' + id.textContent, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role.textContent })
    })
        .then(response => response.json())
        .then(data => {
            const h2 = document.createElement('h2');
            h2.textContent = 'Role change, you will be redirected'
            divContainer.appendChild(h2);
            setTimeout(() => {
                h2.textContent = ''
                window.location.href = '/products';

            }, 2000)
        })
        .catch((error) => {
            throw new Error(error);
        });
});


