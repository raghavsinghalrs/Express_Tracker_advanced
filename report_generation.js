window.onload = () => {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit'
    });
};

function download(){
    let token = localStorage.getItem('token');
    axios.get('http://localhost:3000/downloadsheet', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}