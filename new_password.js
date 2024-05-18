const pwd = document.getElementById('password');
const button = document.getElementById('changepwd');


button.addEventListener('click', newpassword);

async function newpassword(e) {
    e.preventDefault(); 

    
    const pwdValue = pwd.value;

    
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid');
    
    const obj = {
        'password': pwdValue,
        'uuid': uuid
    };

    try {
        const res = await axios.post('http://localhost:3000/updatepassword', obj);
        pwd.value = "";
        console.log('Password updated successfully', res.data);
        window.location.href = "/loginPage.html"
    } catch (err) {
        console.error('Error updating password', err);
    }
}