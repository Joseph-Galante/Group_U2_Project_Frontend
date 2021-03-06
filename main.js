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
const nav_AllBusinessesLink = document.querySelector('#all-business-link');
const nav_CreateBusinessLink = document.querySelector('#create-business-link');

// sections
const sec_Home = document.querySelector('.welcome_screen');
const sec_LoginSignUp = document.querySelector('.log_sign_screen');
const sec_Profile = document.querySelector('.profile');
const sec_Review = document.querySelector('.reviews-state');
const sec_PostReview = document.querySelector('.post-review');
const sec_AllBusiness = document.querySelector('.all-businesses-screen');
const sec_CreateBusiness = document.querySelector('.create-business-screen');

// divs
const div_ProfileInfo = document.querySelector('.profile-info');
const div_Reviews = document.querySelector('.reviews');
const div_BusDetailsBtns = document.querySelector('#business-details-buttons');

// forms
const form_UpdateProfile = document.querySelector('.update-form');
const form_UpdateBusiness = document.querySelector('.business-update-form');

// buttons
const but_EditProfile = document.querySelector('#edit-user');
const but_CancelChanges = document.querySelector('#cancel-changes');
const but_SaveChanges = document.querySelector('#save-changes');
const but_ShowPostReview = document.querySelector('#post-review-button');
const but_PostReview = document.querySelector('#post-review');
const but_CancelReview = document.querySelector('#cancel-review');
const but_EditBusiness = document.querySelector('#edit-business');
const but_DeleteBusiness = document.querySelector('#delete-business');
const but_CancelBusinessUpdate = document.querySelector('#cancel-business-update');
const but_SaveBusinessUpdate = document.querySelector('#save-business-update');
const but_CreateBusiness = document.querySelector('#create-bsn');

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
    initializeMyBsnList();
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

//go to all businesses
nav_AllBusinessesLink.addEventListener('click', () => {
    // to all businesses
    showAllBusinesses();
    initializeAllBsnList();

})

//go to create business
nav_CreateBusinessLink.addEventListener('click',() => {
    //to create business sec
    displaySec(sec_CreateBusiness);

})

//submit button for create business
but_CreateBusiness.addEventListener('click', async ()=>{
    //submit the form / create the business
    await createBusiness();

    //go to the all businesses page
    showAllBusinesses();
    initializeAllBsnList();

})

// edit profile
but_EditProfile.addEventListener('click', editProfile);
// save profile changes
but_SaveChanges.addEventListener('click', saveChanges);
// cancel profile changes
but_CancelChanges.addEventListener('click', cancelChanges);

// post business review
but_ShowPostReview.addEventListener('click', () =>
{
    // go to post review page
    displaySec(sec_PostReview);
});
// post review
but_PostReview.addEventListener('click', postReview);
// cancel review
but_CancelReview.addEventListener('click', cancelReview);

// show edit business form
but_EditBusiness.addEventListener('click', () =>
{
    // hide business details while editing
    document.querySelector('.business-details').classList.add('hidden');
    div_BusDetailsBtns.classList.add('hidden');
    // show update buttons and form
    but_CancelBusinessUpdate.classList.remove('hidden');
    but_SaveBusinessUpdate.classList.remove('hidden');
    form_UpdateBusiness.classList.remove('hidden');
    // populate form
    document.querySelector('#business-update-name').value = document.querySelector('#reviews-business-name').innerHTML;
    document.querySelector('#business-update-address').value = document.querySelector('#reviews-business-address').innerHTML;
    document.querySelector('#business-update-description').value = document.querySelector('#reviews-business-description').innerHTML;
    document.querySelector('#business-update-type').value = document.querySelector('#reviews-business-type').innerHTML;
})
// update business
but_SaveBusinessUpdate.addEventListener('click', async () =>
{
    // get values from form
    const name = document.querySelector('#business-update-name').value;
    const address = document.querySelector('#business-update-address').value;
    const description = document.querySelector('#business-update-description').value;
    const type = document.querySelector('#business-update-type').value;
    // update business
    const res = await axios.put(`${API_URL}/users/businesses/${localStorage.getItem('businessId')}`, {
        name: name,
        address: address,
        description: description,
        type: type
    }, {
        headers: {
            Authorization: localStorage.getItem('userId')
        }
    })

    // show new business details
    await getBusinessDetails();
    // show details buttons
    div_BusDetailsBtns.classList.remove('hidden');
    displayMessage(true, 'Business updated successfully.');
})
// cancel business updates
but_CancelBusinessUpdate.addEventListener('click', () =>
{
    // hide update buttons
    but_CancelBusinessUpdate.classList.add('hidden');
    but_SaveBusinessUpdate.classList.add('hidden');
    // show details buttons
    div_BusDetailsBtns.classList.remove('hidden');
    getBusinessDetails();
})
// delete business
but_DeleteBusiness.addEventListener('click', async () =>
{
    await axios.delete(`${API_URL}/users/businesses/${localStorage.getItem('businessId')}`, {
        headers: {
            Authorization: localStorage.getItem('userId')
        }
    })
    // take to all business section
    displaySec(sec_AllBusiness);
    initializeAllBsnList();
    displayMessage(true, 'Business deleted successfully.');
})

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
    else
    {
        displayMessage(false, 'There was a problem signing you up. Please refresh the page and try again.')
    }

    } catch (error) {
        // validation error - duplicate email
        if (error.message === 'email is already taken')
        {
            displayMessage(false, `Email already taken. Use a different email or login.`)
        }
        else
        {
            console.log(error.message)
        }
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
        alert('Login info is invalid');
        console.log(error.message);
    }
})

//create business form submit
async function createBusiness(){
    try{
       //inputs:
       var name = document.querySelector('#business-name').value;
       var address = document.querySelector('#business-address').value;
       var description = document.querySelector('#description').value;
       var type = document.querySelector('#type').value;

       //put new business in database
       const res = await axios.post(`${API_URL}/users/businesses`, {
           name: name,
           address: address,
           description: description,
           type: type
       },
       {
           headers: {
               Authorization: localStorage.getItem('userId')
           }
       })


    }catch(error){
        console.log(error)
    }
}


//=============== FUNCTIONS ===============//

//business details / reviews page
async function getBusinessDetails(){
    // hide update form
    form_UpdateBusiness.classList.add('hidden');
    // show business details
    document.querySelector('.business-details').classList.remove('hidden');
    // grab business id
    const businessId = localStorage.getItem('businessId');
    try {
        // get business
        const res = await axios.get(`${API_URL}/businesses/${businessId}`);
        const business = res.data.business;

        // populate reviews page with business info
        document.querySelector('#reviews-business-name').innerHTML = business.name;
        document.querySelector('#reviews-business-address').innerHTML = business.address;
        document.querySelector('#reviews-business-description').innerHTML = business.description;
        document.querySelector('#reviews-business-type').innerHTML = business.type;
        document.querySelector('#reviews-business-owner').innerHTML = `Listed by: ${business.owner}`;
        
        // check if user logged in
        if (localStorage.getItem('userId'))
        {
            // check for owner as user
            let user;
            // get user
            const userRes = await axios.get(`${API_URL}/users/verify`, {
                headers: {
                    Authorization: localStorage.getItem('userId')
                }
            })
            // check if user exists
            if (userRes.status === 200)
            {
                // grab user
                user = userRes.data.user;
            }
            // show reviews page
            displaySec(sec_Review);
            // populate reviews div
            getBusinessReviews();
            //check if user is owner
            if (user.id === business.userId)
            {
                // show edit and delete buttons
                but_EditBusiness.classList.remove('hidden');
                but_DeleteBusiness.classList.remove('hidden');
            }
        }
        // no user logged in
        else
        {
            // show reviews page
            displaySec(sec_Review);
            // populate reviews div
            getBusinessReviews();
        }

    } catch (error) {
        console.log(error.message);
    }
}


// displays appropriate nav links when user is logged in or out
async function checkForUser ()
{
    // check if user id exists
    if (localStorage.getItem('userId'))
    {
        try {
            // try to find user
            const res = await axios.get(`${API_URL}/users/verify`, {
                headers: {
                    Authorization: localStorage.getItem('userId')
                }
            })
        } catch (error) {
            console.log(error.message);
            if (error.message === 'Request failed with status code 400')
            {
                localStorage.removeItem('userId');
            }
        }
    }

    // check for logged in user on page load
    if (localStorage.getItem('userId'))
    {
        // hide signup, login links
        nav_SignupLink.classList.add('hidden');
        nav_LoginLink.classList.add('hidden');
        // display profile, logout links
        nav_ProfileLink.classList.remove('hidden');
        nav_LogoutLink.classList.remove('hidden');
        // show review button
        but_ShowPostReview.classList.remove('hidden');
    }
    // no user logged in
    else
    {
        // hide profile, logout links
        nav_ProfileLink.classList.add('hidden');
        nav_LogoutLink.classList.add('hidden');
        // hide review button
        but_ShowPostReview.classList.add('hidden');
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
    // hide edit and delete business buttons
    but_EditBusiness.classList.add('hidden');
    but_DeleteBusiness.classList.add('hidden');

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


//show all businesses
async function showAllBusinesses ()
{
    //show allbusinesses sec
    displaySec(sec_AllBusiness);
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

    document.querySelector('#my-bsn-list-header').innerHTML = user.name + '\'s Businesses';
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

/* -------------------------- all businesses state -------------------------- */
//document queries
const allBsnList = document.querySelector('#business-list')

//make business clickable and display the business details
function clickBsn(div,bsn){
    div.addEventListener('click', () => {
        // business details page
        getBusinessDetails();
    })
}


//populates all businesses list
async function initializeAllBsnList(){
    try{
        //get all businesses
        let response = await axios.get(`${API_URL}/businesses/`);

        const businesses = response.data.businesses;

        //clear all business list
        allBsnList.innerHTML = '';

        //make div for each business and append to list box
        for(let i=0; i<businesses.length;i++){
            //make the div
            const bsn_div = document.createElement('div')
            //add the class
            bsn_div.classList.add('listed-business')

            // //add the id associated with the bsn's id in database
            // bsn_div.setAttribute('id',businesses[i].id)
            
            // add business id to local storage - for posting/getting reviews
            localStorage.setItem('businessId', businesses[i].id);

            //add bsn name to inner html
            bsn_div.innerHTML= businesses[i].name

            //make clickable
            clickBsn(bsn_div, businesses[i]);

            //append div to list box
            allBsnList.appendChild(bsn_div);
            

        }

    }catch(error){
        console.log(error.message)
    }

}

/* --------------------------- My Businesses List --------------------------- */
const myBsnList = document.querySelector('#my-business-list');

async function initializeMyBsnList(){
    try{
       let response = await axios.get(`${API_URL}/users/businesses`,{
           headers: {
                Authorization: localStorage.getItem('userId')
            }
        });

        var businesses = response.data.businesses;

        //clear my business list
        myBsnList.innerHTML = '';

        //make div for each business and append to list box
        for(let i=0; i<businesses.length;i++){
            //make the div
            const bsn_div = document.createElement('div')
            //add the class
            bsn_div.classList.add('listed-business')

            // //add the id associated with the bsn's id in database
            // bsn_div.setAttribute('id',businesses[i].id)
            
            // add business id to local storage - for posting/getting reviews
            localStorage.setItem('businessId', businesses[i].id);

            //add bsn name to inner html
            bsn_div.innerHTML= businesses[i].name

            clickMyBsn(bsn_div, businesses[i]);


            //append div to list box
            myBsnList.appendChild(bsn_div);
            

        }


    }catch(error){
        console.log(error)
    }
}

//make business clickable and display the business details
function clickMyBsn(div,bsn){
    div.addEventListener('click', async () => {
        getBusinessDetails();
    })
}

/* ------------------------- post a business review ------------------------- */
async function postReview ()
{
    // review information
    const headline = document.querySelector('#post-review-headline').value;
    const content = document.querySelector('#post-review-content').value;
    const rating = document.querySelector('#post-review-rating').value;
    
    const businessId = localStorage.getItem('businessId');

    try {
        // post review
        const res = await axios.post(`${API_URL}/users/businesses/${businessId}/reviews`, {
            headline: headline,
            content: content,
            rating: rating
        },
        {
            headers: {
                Authorization: localStorage.getItem('userId')
            }
        })

        // return to business page with reviews
        getBusinessDetails();
    } catch (error) {
        console.log(error.message);
    }
}
// cancel review
function cancelReview ()
{
    // display reviews page
    getBusinessDetails();
}


// get business reviews
async function getBusinessReviews ()
{
    // clear reviews div
    div_Reviews.innerHTML = '';
    // get business id
    const businessId = localStorage.getItem('businessId');
    try {
        // get reviews
        const res = await axios.get(`${API_URL}/businesses/${businessId}/reviews`);
        const reviews = res.data.reviews;
        // check if reviews is empty
        if (reviews.length === 0)
        {
            return;
        }
        // display reviews
        reviews.reverse().forEach(review =>
        {
            // create div elements for each review
            const reviewDiv = document.createElement('div');
            // create headline, content, rating elements
            const headlineEl = document.createElement('h3');
            const contentEl = document.createElement('h5');
            const ratingEl = document.createElement('h4');
            // populate elements with review info
            headlineEl.innerHTML = review.headline;
            contentEl.innerHTML = review.content;
            ratingEl.innerHTML = review.rating;
            // add review to new div
            reviewDiv.append(headlineEl, contentEl, ratingEl);
            // add new div to reviews div
            div_Reviews.append(reviewDiv);
        })
    } catch (error) {
        console.log('business reviews', error.message);
        // message in review section
    }
}
