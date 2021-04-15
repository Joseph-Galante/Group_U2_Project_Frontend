//=============== SETUP/VARIABLES ===============//

// backend url
const API_URL = 'http://localhost:3001';

//=============== DOCUMENT QUERIES ===============//



//=============== FORM SUBMISSIONS ===============//

// sign up
document.querySelector('.signup-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get name
    const name = document.querySelector('#signup-name').value;
    // get email
    const email = document.querySelector('#signup-email').value;
    // get pw
    const password = document.querySelector('#signup-password').value;

    try {
    // make user
    const res = await axios.post(`${API_URL}/users`, {
        name: name,
        email: email,
        password: password
    })
    // grab user id
    const userId = res.data.userId;
    // add to local storage - login user
    localStorage.setItem('userId', userId);

    } catch (error) {
        alert('email is already taken');
        console.log(error.message)
    }
})

// login
document.querySelector('.login-form').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get email
    const email = document.querySelector('#login-email').value;
    // get pw
    const password = document.querySelector('#login-password').value;

    try {
    // login user
    const res = await axios.post(`${API_URL}/users/login`, {
        email: email,
        password: password
    })
    // grab user id
    const userId = res.data.userId;
    // add id to local storage - login user
    localStorage.setItem('userId', userId);

    } catch (error) {
        alert('login failed');
        console.log(error.message);
    }
})


//=============== FUNCTIONS ===============//