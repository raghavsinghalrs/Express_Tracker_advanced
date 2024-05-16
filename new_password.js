const pwd = document.getElementById('password');
const button = document.getElementById('changepwd');

button.addEventListener('click',newpassword);

async function newpassword(e){
    e.preventDefault();

    const obj = {
        'password' : pwd.value,
    }
    try{
        const res = await axios.post('http://localhost:3000/updatepassword',obj)
    }catch(err){
        console.log(err);
    }

}