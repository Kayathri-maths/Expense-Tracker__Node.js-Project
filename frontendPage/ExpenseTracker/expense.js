async function addExpenses(event) {
    try {
        event.preventDefault();
        const expenseamount = document.getElementById('expenseamount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const expenseItems = {
            expenseamount,
            description,
            category
        };
        console.log(expenseItems);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseItems,{ headers: { "Authorization" : token}});
        showOnUserScreen(response.data.expense);
        console.log(response.data.expense);
    } catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}
async function getAllExpenses() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/expense/get-expenses",{ headers: { "Authorization" : token}});
        console.log(response);
        for (let i = 0; i < response.data.expenses.length; i++) {
            showOnUserScreen(response.data.expenses[i])
        }
    }
    catch (error) {
        console.log(JSON.stringify(error));
        document.body.innerHTML += `<div style="color:red">${error.message}</div>`;
    }
}
window.addEventListener("DOMContentLoaded", getAllExpenses);

function showOnUserScreen(obj) {
    document.getElementById('expenseamount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';

    const parentNode = document.getElementById('listOfExpenses');
    const childNode = `<li id='${obj.id}'>${obj.expenseamount}-${obj.description}-${obj.category}
    <button onclick=deleteItem('${obj.id}')>Delete Expense</button>`

    parentNode.innerHTML = parentNode.innerHTML + childNode;

}
async function deleteItem(expenseid) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`,{ headers: {"Authorization" : token}})
        removeItemfromScreen(expenseid)
        console.log('Item details deleted');
    } catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }

}

function removeItemfromScreen(ItemId) {
    let parent = document.getElementById('listOfExpenses');
    const childNodeDeleted = document.getElementById(ItemId);

    parent.removeChild(childNodeDeleted)
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization": token}});
    console.log(response);
    var options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,  // For one time payment
        //this handler function will handle the success payment
        "handler": async function (response) {
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
               order_id: options.order_id,
               payment_id: response.razorpay_payment_id,
            },  { headers: {"Authorization": token}} )
            alert('You are a Premium User Now')
        }
    };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response) {
    console.log(response);
    alert('Something went wrong');
  });
}