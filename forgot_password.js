let email = document.getElementById('email');
let forgotbtn = document.getElementById('forgotbtn');

forgotbtn.addEventListener('click', forgot);

async function forgot(e){
    e.preventDefault();
    try{
        let obj = {
            'email' : email.value
        }
        const res = await axios.post('http://localhost:3000/forgotpassword',obj)
        console.log(res);
    }catch(err){
        console.log(err);
    }
}