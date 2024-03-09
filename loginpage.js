let email_val = document.getElementById('email');
let password_val = document.getElementById('password');
let loginButton = document.getElementById('loginbtn');

loginButton.addEventListener('click',login);

function login(e){
    e.preventDefault();
    const obj = {
        'email': email_val.value,
        'password': password_val.value
    }
    axios.post('http://localhost:3000/login',obj)
    .then(res => {
        const data = res.data;
        if (data.message === 'Login successful') {
            clearfields();
            alert('Logged in successfully');
        } else if (data.message === 'Wrong password') {
            alert('Wrong password');
        } else if (data.message === 'Invalid! Create account') {
            alert('User not found. Please create an account');
        } else {
            alert('An error occurred. Please try again later');
        }
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}
function clearfields(){
    email_val.value ="";
    password_val.value ="";
}