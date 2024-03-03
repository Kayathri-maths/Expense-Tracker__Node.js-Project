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
function showPremiumUserMessage(){
    document.getElementById('rzp-button1').style.display="none";
    document.getElementById('premium-user').innerHTML='You are a premium user';
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded",   async () => {
    try {
        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        console.log(decodeToken);

        const ispremiumuser = decodeToken.ispremiumuser;
    
        if(ispremiumuser){
       showPremiumUserMessage();
       showLeaderBoard();
       console.log('ispremiumuser>>>',ispremiumuser);
        }
        const response = await axios.get("http://localhost:3000/expense/get-expenses",{ headers: { "Authorization" : token}});
        console.log(response);
        response.data.expenses.forEach((expense) => {
            showOnUserScreen(expense);
        })
    }
    catch (error) {
        console.log(JSON.stringify(error));
        document.body.innerHTML += `<div style="color:red">${error.message}</div>`;
    }
})


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

function showLeaderBoard(){
    const inputElement = document.createElement("input");
    inputElement.type = "submit";
    inputElement.value = 'Show Leaderboard';
   // inputElement.style.display = "block"
   document.getElementById('download-expenses').style.display = 'block';
    inputElement.onclick = async () => {
       const token = localStorage.getItem('token');
       const userLeaderBoardArr = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization": token}})
       console.log(userLeaderBoardArr);

       var leaderBoardElement = document.getElementById('leader-board');
       leaderBoardElement.innerHTML = '<h1>Leader Board </h1>';
       
       userLeaderBoardArr.data.forEach((userlist) => {
           leaderBoardElement.innerHTML += `<li>Name - ${userlist.name} Total Expenses - ${userlist.totalExpenses} </li>`
       })
   }
    document.getElementById("premium-user").appendChild(inputElement);
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
          const res =  await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
               order_id: options.order_id,
               payment_id: response.razorpay_payment_id,
            },  { headers: {"Authorization": token}} )
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.display="none";
            document.getElementById('premium-user').innerHTML='You are a premium user';   
            localStorage.setItem('token', res.data.token);
            showLeaderBoard();
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

 async function expensedownload(){
    try{
     const token = localStorage.getItem('token');
     const response = await axios.get('http://localhost:3000/user/download',{headers: {"Authorization" : token}})
      
     if (response.status===201){
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download ='myexpense.csv';
        a.click();
        alert('Successfully downloaded the expenses file');
     }  else {
        throw new Error(response.data.message)
     }

    }  catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}