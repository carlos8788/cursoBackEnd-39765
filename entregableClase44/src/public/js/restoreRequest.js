const form = document.getElementById('restoreRequestForm');
const text = document.getElementById('message');

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/session/restoreRequest', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json();
    if (json.status === "success") {
        text.innerHTML = "A verification email has been sent.\n you will be redirected to the home page"
        setTimeout(() => window.location.href = '/', 4000)
    } else {
        text.innerHTML = json.error
    }
})