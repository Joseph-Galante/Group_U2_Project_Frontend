//=============== SETUP/VARIABLES ===============//

// backend url
const API_URL = 'http://localhost:3001';


//=============== DOCUMENT QUERIES ===============//

// nav links
const nav_HomeLink = document.querySelector('#home-link');
const nav_SignupLink = document.querySelector('#signup-link');
const nav_LoginLink = document.querySelector('#login-link');
const nav_ProfileLink = document.querySelector('#profile-link');
const nav_LogoutLink = document.querySelector('#logout-link');

// sections
const sec_Home = document.querySelector('.welcome_screen');
const sec_LoginSignUp = document.querySelector('.log_sign_screen');
const sec_Profile = document.querySelector('.profile');

// divs
const div_ProfileInfo = document.querySelector('.profile-info');

// forms
const form_UpdateProfile = document.querySelector('.update-form');

// buttons
const but_EditProfile = document.querySelector('#edit-user');
const but_CancelChanges = document.querySelector('#cancel-changes');
const but_SaveChanges = document.querySelector('#save-changes');

// misc
const messages = document.querySelector('#messages');


//=============== EVENT LISTENERS ===============//

// home page
nav_HomeLink.addEventListener('click', () => {
    // show home screen
    displaySec(sec_Home);
})

// signup form
nav_SignupLink.addEventListener('click', () => {
    // show signup form
    displaySec(sec_LoginSignUp);
})

// login form
nav_LoginLink.addEventListener('click', () => {
    // show login form
    displaySec(sec_LoginSignUp);
})

// profile
nav_ProfileLink.addEventListener('click', async () => {
    showProfile();
})

// logout
nav_LogoutLink.addEventListener('click', () => {
    // return to home screen
    displaySec(sec_Home);
    // remove id from local storage
    localStorage.removeItem('userId');
    // display proper links
    checkForUser();
})

// edit profile
but_EditProfile.addEventListener('click', editProfile);
// save profile changes
but_SaveChanges.addEventListener('click', saveChanges);
// cancel profile changes
but_CancelChanges.addEventListener('click', cancelChanges);


//=============== FORM SUBMISSIONS ===============//

// sign up
document.querySelector('#signup').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get name
    const name = document.querySelector('#s_name').value;
    // get email
    const email = document.querySelector('#s_email').value;
    // get pw
    const password = document.querySelector('#s_password').value;

    try {
    // make user
    const res = await axios.post(`${API_URL}/users`, {
        name: name,
        email: email,
        password: password
    })
    // check for OK status
    if (res.status === 200)
    {
        // grab user id
        const userId = res.data.userId;
        // add to local storage - login user
        localStorage.setItem('userId', userId);
        // return home
        checkForUser();
        displaySec(sec_Home);
        // show message
        displayMessage(true, `Hello, ${name}!`)
    }
    // validation error - duplicate email
    else if (res.error.message === 'email already taken')
    {
        displayMessage(false, `Email already taken. Use a different email or login.`)
    }


    } catch (error) {
        alert('email is already taken');
        console.log(error.message)
    }
})

// login
document.querySelector('#login').addEventListener('submit', async (event) => 
{
    event.preventDefault();
    // get email
    const email = document.querySelector('#l_email').value;
    // get pw
    const password = document.querySelector('#l_password').value;

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
    // return home
    checkForUser();
    displaySec(sec_Home);
    // show message
    displayMessage(true, `Hello, ${res.data.name}!`)

    } catch (error) {
        alert('login failed');
        console.log(error.message);
    }
})


//=============== FUNCTIONS ===============//

// displays appropriate nav links when user is logged in or out
function checkForUser ()
{
  // check for logged in user on page load
  if (localStorage.getItem('userId'))
  {
    // hide signup, login links
    nav_SignupLink.classList.add('hidden');
    nav_LoginLink.classList.add('hidden');
    // display profile, logout links
    nav_ProfileLink.classList.remove('hidden');
    nav_LogoutLink.classList.remove('hidden');
  }
  // no user logged in
  else
  {
    // hide profile, logout links
    nav_ProfileLink.classList.add('hidden');
    nav_LogoutLink.classList.add('hidden');
    // display signup, login links
    nav_SignupLink.classList.remove('hidden');
    nav_LoginLink.classList.remove('hidden');
  }
}
// call on page load - see if user is still logged in
checkForUser();


// update UI based on nav link clicked
function displaySec (element)
{
    // hide all secs
    document.querySelectorAll('section').forEach(d => d.classList.add('hidden'));
    // hide messages
    messages.classList.add('hidden');
    // hide profile update form
    form_UpdateProfile.classList.add('hidden');

    // display desired sec
    element.classList.remove('hidden');
}
// call on page load - go to home screen
displaySec(sec_Home);


// display messages
function displayMessage (success, message)
{
    if (success)
    {
        messages.classList.remove('fail');
        messages.classList.add('success');
    }
    else
    {
        messages.classList.remove('success');
        messages.classList.add('fail');
    }
    messages.innerHTML = message;
    messages.classList.remove('hidden');
}


// show profile info
async function showProfile ()
{
    // show profile sec
    displaySec(sec_Profile);
    // show profile info and edit button
    div_ProfileInfo.classList.remove('hidden');
    but_EditProfile.classList.remove('hidden');

    // grab user
    const res = await axios.get(`${API_URL}/users/profile`, {
        headers: {
            Authorization: localStorage.getItem('userId')
        }
    })
    const user = res.data.user;
    // show user info
    document.querySelector('#profile-name').innerHTML = user.name;
    document.querySelector('#profile-email').innerHTML = user.email;
    // document.querySelector('#profile-password').innerHTML = user.password;
    // fill edit fields
    document.querySelector('#update-name').value = user.name;
    document.querySelector('#update-email').value = user.email;
}

// update user profile
function editProfile ()
{
    // hide edit button and profile info
    but_EditProfile.classList.add('hidden');
    div_ProfileInfo.classList.add('hidden');
    // hide messages
    messages.classList.add('hidden');
    // show update form and fill fields
    form_UpdateProfile.classList.remove('hidden');
}

// save profile changes
async function saveChanges ()
{
    // get changes for user
    const name = document.querySelector('#update-name').value;
    const email = document.querySelector('#update-email').value;
    // const password = document.querySelector('#update-password').value;
    try {
        // check if any fields are empty
        if (name === '' || email === '')// || password === '')
        {
            alert('all fields are required');
        }
        // no empty fields
        else
        {
            // update user
            await axios.put(`${API_URL}/users/profile`, {
                name: name,
                email: email
                // password: password
            }, {
                headers: {
                    Authorization: localStorage.getItem('userId')
                }
            })
            // display new profile info
            showProfile();
            displayMessage(true, 'Profile updated successfully.');
        }
    } catch (error) {
        alert('profile could not be updated');
    }
}

// cancel profile changes
function cancelChanges ()
{
    // display profile info and edit button
    showProfile();
}

