let amt = document.getElementById('amount');
let desc = document.getElementById('desc');
let category = document.getElementById('category');
let button = document.getElementById('add');

button.addEventListener('click',addItem);
document.addEventListener('DOMContentLoaded', () => {
    getitem();
  });

function addItem(e){
    e.preventDefault();
    const obj = {
        'amount' : amt.value,
        'description' : desc.value,
        'category': category.value
    }
    axios.post('http://localhost:3000/addItem',obj)
    .then(res => {
        const table = document.getElementById('data-table');
        // table.innerHTML = '';
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = '1';
        cell2.innerHTML = amt.value;
        cell3.innerHTML = desc.value;
        cell4.innerHTML = category.value;
        amt.value ="";
        desc.value="";
        category.value ="";
        console.log(res);

    })
    .catch(err => {
        console.log(err);
    })
}

function getitem(){
    axios.get('http://localhost:3000/getitem')
    .then(res => {
        console.log(res);
        const data = res.data;
        let len = data.data.length;
        const table = document.getElementById('data-table');
        for (let i = 0; i < len; i++) {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
    
            cell1.innerHTML = i;
            cell2.innerHTML = data.data[i].amount;
            cell3.innerHTML = data.data[i].description;
            cell4.innerHTML = data.data[i].category;
          }
    })
    .catch(err => {
        console.log(err);
    })
}

