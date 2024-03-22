let amt = document.getElementById('amount');
let desc = document.getElementById('desc');
let category = document.getElementById('category');
let button = document.getElementById('add');
let list = document.getElementById('result');

button.addEventListener('click',addexpense);
list.addEventListener('click',deleteexpense);
document.addEventListener('DOMContentLoaded', () => {
    getitem();
  });

function clear_func(){
    amt.value ="";
    desc.value="";
    category.value ="";
}

function deleteexpense(e){
    if(e.target.id=='del'){
        var x = e.target.parentElement;
        console.log(x.id);
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:3000/deleteitem/${x.id}`,{headers : {'Authorization':token}})
        .then(res => {
            console.log(res);
            list.removeChild(x);
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
        console.log(res);
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
        console.log(res);
        const data = res.data;
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

