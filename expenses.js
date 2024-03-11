let amt = document.getElementById('amount');
let desc = document.getElementById('desc');
let category = document.getElementById('category');
let button = document.getElementById('add');

button.addEventListener('click',addItem);

function addItem(e){
    e.preventDefault();
    const obj = {
        'amount' : amt.value,
        'description' : desc.value,
        'category': category.value
    }
    axios.post('http://localhost:3000/addItem',obj)
    .then(res => {
        amt.value ="";
        desc.value="";
        category.value ="";
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

