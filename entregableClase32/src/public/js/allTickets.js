const divTickets = document.getElementById('divTickets');
const uid = document.querySelector('.card-header').id;

const formatDate = (dateTime) => {
    let date = new Date(dateTime);
    let formatter = new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'full',
        timeStyle: 'short'
    });
    return formatter.format(date);
}

const getTickets = async () => {
    try {
        response = await fetch('/api/ticket/' + uid)
        data = await response.json()
        
        let tickets = ''
        if (data.payload.length > 0) {
            for (let ticket of data.payload) {
                
                
                let purchase_time = formatDate(ticket.purchase_time)

                tickets += `<div class="card my-2">
                                <div class="card-body">
                                    <h5 class="card-title">ID: ${ticket._id}</h5>
                                    <p class="card-text">Amount: $${ticket.amount}</p>
                                    <p class="card-text">Created at: ${purchase_time}</p>
                                    
                                </div>
                          </div>`

            }

        }
        else {
            tickets += "<h3>No purchases were made</h3>"
        }
        divTickets.innerHTML = tickets
    } catch (error) {
        console.log(error);
    }
};

const main = () => {
    getTickets()
}
main()