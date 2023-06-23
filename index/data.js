let users = [{}];
let currentUser;

// Initialize the application
async function init() {
    await getUserData();
    checkRememberMe();
    checkMsg();
    chooseAnimation();
}

// Fetches user data from the server
async function getUserData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}

// Checks if the user has chosen to be remembered and fills in their data if so
function checkRememberMe() {
    let email = getLocalStorageEmail();
    let password = getLocalStoragePassword();

    if (getLocalStorageEmail() && getLocalStoragePassword()) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('rememberMe').checked = true;
    }
}

// Displays a message if there is one in the URL parameters
function checkMsg() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        let msgBox = document.getElementById("msgBox");
        msgBox.classList.remove('d-none');
        msgBox.innerHTML = `<p id="msg">${msg}</p>`;
    }
}

// Chooses the appropriate animation based on screen size
function chooseAnimation() {
    if (window.innerWidth > 600) {
        desktopAnimation();
    } else {
        desktopAnimation();
        mobileAnimation();
    }
}

// Gets the user's credentials from the form
function getCredentials() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    return {
        name: name,
        email: email,
        password: password
    };
}

// Adds a new user if the form input is valid
async function addUser() {
    const { name: name, email: email, password: password } = getCredentials();
    if (validateAddUser()) {
        await generateUser();
        clearForm();
        createUserSuccess();
    } else {
        createUserError(password);
    }
}

// Displays an error message if the user input is invalid
function createUserError(password) {
    if (!validatePassword(password))
        document.getElementById('passwordPopUp').innerText = "Das Passwort muss aus mindestens 8 Zeichen bestehen, einschließlich einem Sonderzeichen und einem klein- und Großbuchstaben";
}

// Redirects the user to the main page after successful registration
function createUserSuccess() {
    window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';
}

// Generates a new user object and adds it to the list of users
async function generateUser() {
    users.push(createUser());
    await backend.setItem('users', JSON.stringify(users));
}

// Creates a new user object based on the form input
function createUser() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    return {
        name: name.value,
        email: email.value,
        password: password.value,
        color: getRandomColor()
    };
}

// Clears the form input fields
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

// Validates the user input to check if it meets the requirements
function validateAddUser() {
    const { name: name, email: email, password: password } = getCredentials();
    return validateUsername(name.value) &&
        validateEmail(email.value) &&
        validatePassword(password.value);
}

// Gets the user's email and password from the form
function getEmailAndPassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    return {
        email: email,
        password: password
    };
}

// Logs in the user if their email and password match a registered user
async function login() {
    const loginData = getEmailAndPassword();
    let user = users.find(user => user.email == loginData.email && user.password == loginData.password);

    if (user) {
        await generateCurrentUser(user);
        redirectToSummary();
        setRememberMe();
    }
    else wrongLogin.innerHTML = 'Login oder Passwort ungültig';
}

// Generates the current user object based on the logged-in user
async function generateCurrentUser(user) {
    const loginData = getEmailAndPassword();
    let name = user.name;
    let color = user.color;
    let stringToSplit = name.split(" ");
    let seperatedLetters = stringToSplit.map(word => word[0]);
    let combinedLetters = seperatedLetters.join("");
    currentUser = {
        name: user.name,
        email: loginData.email,
        password: loginData.password,
        initials: combinedLetters,
        color: color,
        contacts: contactList
    };
    await backend.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('greetingLoaded', 'false');
}

// Logs in the user as a guest
async function guestLogin() {
    await setGuestAccount();
    redirectToSummary();
}

// Sets up a guest account for the user
async function setGuestAccount() {
    let guestName = "Dear Guest";
    let stringToSplit = guestName.split(" ");
    let seperatedLetters = stringToSplit.map(word => word[0]);
    let combinedLetters = seperatedLetters.join("");
    currentUser = {
        name: guestName,
        email: "guest",
        password: "",
        initials: combinedLetters,
        color: '#2AAAE2',
        contacts: contactList
    };
    localStorage.setItem('greetingLoaded', 'false');
    await backend.setItem('currentUser', JSON.stringify(currentUser));
}

// Sends a password reset email if the user exists
async function onSubmit(event) {
    event.preventDefault();
    await getUserData();
    let formData = new FormData(event.target);
    let response = await action(formData);
    checkIfUserExists(response);
}

// Checks if the user exists and sends the password reset email
function checkIfUserExists(repsonse) {
    let checkMail = document.getElementById('email').value;
    let user = users.find(user => user.email == checkMail);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        confirmAnimation();
    } else {
        errorAnimation();
    }
}

// Sends the password reset email
function action(formData) {
    const input = 'https://joshua-trefzer.developerakademie.net/send_mail.php';
    const requestInit = {
        method: 'post',
        body: formData
    };
    return fetch(input, requestInit);
}

// Gets the email from URL parameters and retrieves the user data
async function onPageLoad() {
    email = getEmailUrlParameter();
    users = await getUserData();
}

// Gets the user's email from the URL parameters
function getEmailUrlParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    return email;
}

// Retrieves the password and confirmation password from input fields and returns them as an object
function getPasswords() {
    const setPassword = document.getElementById('setPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    return {
        setPassword: setPassword,
        confirmPassword: confirmPassword
    };
}

// Changes the user's password if the new password and confirmation match
async function changePassword() {
    const passwords = getPasswords();
    let resetUser = getResetUserFromLocalStorage();

    if (arePasswordsMatching(passwords.setPassword, passwords.confirmPassword)) {
        updatePassword(resetUser, passwords.confirmPassword);
        updateUsersArray();
        redirectToIndex();
    }
}

// Updates the users array with the new password
async function updateUsersArray() {
    await getUserData();
    let user = users.find(user => user.email == resetUser.email);
    if (user) {
        let index = users.indexOf(user);
        users.splice(index, 1, resetUser);
        await backend.setItem('users', JSON.stringify(users));
    }
}

// Redirects the user to the summary page
function redirectToSummary() {
    window.location.href = '../summary/summary.html';
}

// Redirects the user to the index page
function redirectToIndex() {
    window.location.href = './index.html';
}

// Retrieves the user object from local storage and returns it as a parsed JSON object
function getResetUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    return JSON.parse(storedUser);
}

// Updates the user object's password with the new password provided
function updatePassword(user, newPassword) {
    user.password = newPassword;
}

// Checks if the provided password and confirmPassword are equal, if so returns true
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Sets the "Remember Me" option for the user
function setRememberMe() {
    localStorage.setItem('currentUser-email', currentUser.email);
    localStorage.setItem('currentUser-password', currentUser.password);
}

// Gets the user's email from local storage
function getLocalStorageEmail() {
    return localStorage.getItem('currentUser-email');
}

// Gets the user's password from local storage
function getLocalStoragePassword() {
    return localStorage.getItem('currentUser-password');
}

// Validates the username input
function validateUsername(username) {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
    return regex.test(username);
}

// Validates the email input
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Validates the password input
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
}

