function forgotpassword(e){
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);
    console.log('form',form);

    const userDetails = {
        email: form.get("email"),
    };

    axios.post('http://localhost:3000/forgotpassword',userDetails).then(response => {
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        }else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}