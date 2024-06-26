let email = document.getElementById('email');
let forgotbtn = document.getElementById('forgotbtn');

forgotbtn.addEventListener('click', forgot);

async function forgot(e){
    e.preventDefault();
    const obj = {
        'email' : email.value
    }
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/forgotpassword',obj)
    .then(res => {
        console.log(res);
        email.value = '';
        alert('Reset link sent on your mail id');
    })
    .catch(err => {
        console.log(err);
    });
}
