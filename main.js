let name_val = document.getElementById('name');
let email_val = document.getElementById('email');
let password_val = document.getElementById('password');
let submit_val = document.getElementById('btn');

submit_val.addEventListener('click', signup);

function signup(e){
    e.preventDefault();
    const obj = {
        'name': name_val.value,
        'email': email_val.value,
        'password': password_val.value
    }
    axios.post('http://localhost:3000/add_user',obj)
    .then(res => {
        clearfields();
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

function clearfields(){
    name_val.value = "";
    email_val.value ="";
    password_val.value ="";
}