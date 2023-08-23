export const deleteProduct = () => {
    const btnsDelete = document.querySelectorAll('.btn-delete-product')
    const btnArray = Array.from(btnsDelete)
    btnArray.forEach(btn => {
        
        btn.addEventListener('click', () => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('api/products/' + btn.id, {
                        method: 'DELETE',
                    }
                    ).then(response => {
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            ).then(() => window.location.reload())
                            
                        }
                        else {
                            Swal.fire(
                                'No Deleted!',
                                'Your file has not been deleted.',
                                'error'
                            )
                        }
                    })


                }
            })
                .catch((error) => {
                    throw new Error(error);
                })

                
        })
    })
}