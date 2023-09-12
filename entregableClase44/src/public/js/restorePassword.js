const form = document.getElementById('restorePasswordForm');
const text = document.getElementById('message');
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    obj.token = urlParams.token;
    if (obj.password === obj.passwordRepeat) {
        const response = await fetch('/api/session/restorePassword', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        if (json.status === "success") {
            text.innerHTML = "Your password has been changed"
            setTimeout(() => window.location.href = '/', 3000)
        } else {
            text.innerHTML = json.error
        }
    }
    else{
        Swal.fire({
            title:'Error',
            text: 'The new password is invalid',
            icon: 'error'
        })
    }

})