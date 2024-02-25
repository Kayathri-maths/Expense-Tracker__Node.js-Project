async function addExpenses(event){
    try{
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
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseItems);
        showOnUserScreen(response.data.expense);
        console.log(response.data.expense);
    }   catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}
async function getAllExpenses() {
    try{
    const response= await axios.get("http://localhost:3000/expense/get-expenses");
    console.log(response);
    for (let i = 0; i < response.data.expenses.length; i++) {
      showOnUserScreen(response.data.expenses[i])
    }
      }
      catch (error) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
      }
  }
  window.addEventListener("DOMContentLoaded",getAllExpenses);

  function showOnUserScreen(obj){
    document.getElementById('expenseamount').value = '';
     document.getElementById('description').value = '';
     document.getElementById('category').value = '';

   const parentNode=document.getElementById('listOfExpenses');
   const childNode = `<li id='${obj.id}'>${obj.expenseamount}-${obj.description}-${obj.category}
    <button onclick=deleteItem('${obj.id}')>Delete Expense</button>`

  parentNode.innerHTML = parentNode.innerHTML + childNode;

   }
   async function deleteItem(expenseid) {
    try  {
    await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`)
        removeItemfromScreen(expenseid)
        console.log('Item details deleted');
      }catch(err)  {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
      }

  }

  function removeItemfromScreen(ItemId) {
    let parent = document.getElementById('listOfExpenses');
    const childNodeDeleted = document.getElementById(ItemId);

    parent.removeChild(childNodeDeleted)
  }