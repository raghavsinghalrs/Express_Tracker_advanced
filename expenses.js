let amt = document.getElementById('amount');
let desc = document.getElementById('desc');
let category = document.getElementById('category');
let button = document.getElementById('add');
let list = document.getElementById('result');
let list2 = document.getElementById('list');
let premiumbutton = document.getElementById('premium');

button.addEventListener('click',addexpense);
list.addEventListener('click',deleteexpense);
document.addEventListener('DOMContentLoaded', () => {
    getitem();
  });

function clear_func(){
    amt.value ="";
    desc.value="";
}

function deleteexpense(e){
    if(e.target.id=='del'){
        var x = e.target.parentElement;
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/deleteitem/${x.id}`,{headers : {'Authorization':token}})
        .then(async res => {
            list.removeChild(x);
            const response = await axios.get('http://localhost:3000/leaderboard');
            await show_leaderboard(response);
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function addexpense(e){
    e.preventDefault();
    const obj = {
        'amount' : amt.value,
        'description' : desc.value,
        'category': category.value
    }
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/addItem',obj,{headers : {'Authorization':token}})
    .then(res => {
        const result = res.data.newItem;
        clear_func();
        var li = document.createElement('li');
        li.id = result.id;
        li.appendChild(document.createTextNode(result.amount));
        li.appendChild(document.createTextNode(' - '));
        li.appendChild(document.createTextNode(result.description));
        li.appendChild(document.createTextNode(' - '));
        li.appendChild(document.createTextNode(result.category));
        li.appendChild(document.createTextNode(' '));
        var deletebtn = document.createElement('button');
        deletebtn.id = 'del';
        deletebtn.textContent='Delete Expense';
        deletebtn.style.borderColor = "red";
        li.appendChild(deletebtn);
        list.appendChild(li);
    })
    .catch(err => {
        console.log(err);
    })
}

function getitem(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/getitem', {headers : {'Authorization':token}})
    .then(res => {
        const data = res.data;
        const premiumdata = res.data.premiumuserdata.ispremiumuser;
        if(premiumdata){
            premium();
        }
        let len = data.data.length;
        for (let i = 0; i < len; i++) {
            var li = document.createElement('li');
            li.id = data.data[i].id;
            li.appendChild(document.createTextNode(data.data[i].amount));
            li.appendChild(document.createTextNode(' - '));
            li.appendChild(document.createTextNode(data.data[i].description));
            li.appendChild(document.createTextNode(' - '));
            li.appendChild(document.createTextNode(data.data[i].category));
            li.appendChild(document.createTextNode(' '));
            var deletebtn = document.createElement('button');
            deletebtn.id = 'del';
            deletebtn.textContent='Delete Expense';
            deletebtn.style.borderColor = "red";
            li.appendChild(deletebtn);
            list.appendChild(li);
        }
    })
    .catch(err => {
        console.log(err);
    })
}

premiumbutton.onclick = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/premiummembership', { headers: { 'Authorization': token } });
            const orderId = response.data.order.id;
            const keyId = response.data.key_id;
            const options = {
                "key": keyId,
                "order_id": orderId,
                "handler": async function (response) {
                    const paymentId = response.razorpay_payment_id;
                    const obj = {
                        order_id: orderId,
                        payment_id: paymentId
                    }
                    await axios.post('http://localhost:3000/updatetransactionstatus',obj,{ headers: { 'Authorization': token }});
                    alert('You are a premium user now');
                    await premium();
                }
            };
            let rzp1 = new Razorpay(options);
            rzp1.open();
            rzp1.on('payment.failed', async function (response) {
                alert('Payment Failed. Your order status will be updated to FAILED.');
                try{
                    await axios.post('http://localhost:3000/updatetransactionstatus', { order_id: orderId, payment_id: null }, { headers: { 'Authorization': token } });
                }
                catch(err){
                    console.log(err);
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    async function premium(){
        var premiumButton = document.getElementById('premium');
        var newText = document.createTextNode('Premium User');
        var newTextContainer = document.createElement('div');
        newTextContainer.appendChild(newText);
        var leaderboardButton = document.createElement('button');
        leaderboardButton.textContent = 'Show Leaderboard'; 
        leaderboardButton.id = 'leaderboard';
        premiumButton.parentNode.replaceChild(newTextContainer, premiumButton);
        newTextContainer.parentNode.insertBefore(leaderboardButton, newTextContainer.nextSibling);
    
        document.getElementById('leaderboard').addEventListener('click', async () => {
            try {
                const response = await axios.get('http://localhost:3000/leaderboard');
                await show_leaderboard(response);
            } catch (err) {
                console.log(err);
            }
        });

    }
    
    async function show_leaderboard(data){
        console.log("show data: ", data.data.leaderboard);
        list2.innerHTML = '';
        let heading = document.createElement('h2');
        heading.textContent = 'Leaderboard';
        list2.appendChild(heading);
        for(let i=0;i<data.data.leaderboard.length;i++){
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(data.data.leaderboard[i].name));
            li.appendChild(document.createTextNode('-'));
            li.appendChild(document.createTextNode(data.data.leaderboard[i].totalexpense));
            list2.appendChild(li);
        }
    }
    
    

