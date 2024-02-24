async function login(event) {
    try{
        event.preventDefault();
        const loginDetails = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        console.log(loginDetails);
        const response = await axios.post('http://localhost:3000/user/login', loginDetails);
        if (response.status === 201) {
            window.location.href = "../Login/login.html";
        } else {
            throw new Error('Failed to login');
        }
    }   catch (err) {
        document.body.innerHTML += `<div style="color:red">${err}</div>`;
    }
}