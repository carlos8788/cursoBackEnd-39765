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
        .then(response => {
            if (response.status === 401) {
                return (Swal.fire(
                    'No Change role!',
                    'Not authorized.',
                    'error'
                ))
            }
            return response.json();

        })
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

document.getElementById('btn-upload-profile-pic').addEventListener('click', () => {
    uploadFile('profile', 'profilePictureInput');
});

document.getElementById('btn-upload-identification').addEventListener('click', () => {
    uploadFile('document', 'identificationInput', 'dni');
});

document.getElementById('btn-upload-domicile-proof').addEventListener('click', () => {
    uploadFile('document', 'domicileProofInput', 'domicilio');
});

document.getElementById('btn-upload-account-statement').addEventListener('click', () => {
    uploadFile('document', 'accountStatementInput', 'cuenta');
});

function uploadFile(type, inputId, docType) {
    const input = document.getElementById(inputId);
    const file = input.files[0];

    if (!file) {
        alert('Please select a file first');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    let url = `/api/users/${id.textContent}/documents?type=${type}`
    if (docType) {
        formData.append('docType', docType);
        url += `&document_type=${docType}`
    }
    
    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            
            alert('File uploaded successfully');
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        });
}



