console.log('main');
fetch('/products')
    .then(response=>{

        if(response.status === 401){
            alert('You are not authenticated');
            window.location.replace('/login')
        }
    } )
        