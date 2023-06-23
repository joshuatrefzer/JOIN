function confirmAnimation() {
    document.getElementById('forgotPwContainer').classList.add('zero-opacity');
    document.getElementById('emailSentAnimation').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('emailSentAnimation').classList.add('animateEmailSent');
    }, 50);
    setTimeout(() => {
        document.getElementById('forgotPwContainer').classList.remove('zero-opacity');
        document.getElementById('emailSentAnimation').classList.add('d-none');
    }, 4500);
}

function errorAnimation() {
    document.getElementById('forgotPwContainer').classList.add('zero-opacity');
    document.getElementById('forgotPwText').innerText = 'No user registered with this email';
    document.getElementById('emailSentAnimation').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('emailSentAnimation').classList.add('animateEmailSent');
    }, 50);
    setTimeout(() => {
        document.getElementById('forgotPwContainer').classList.remove('zero-opacity');
        document.getElementById('emailSentAnimation').classList.add('d-none');
    }, 4500);
}

function renderForgotPw() {
    document.body.innerHTML = forgotPwTemplate();
}

function renderSignUp() {
    document.body.innerHTML = signUpTemplate();
}

function forgotPwTemplate() {
    return `
    <div id="headpart">
    <a href="./index.html"> <img id="desktopLogo" src="./assets/img/join_logo.svg"
    alt="" /></a>
    </div>

    <div id="container">
        <main id="forgotPwContainer">
            <a href="./index.html" class="backBtn">
                <img src="./assets/img/arrow_back.png" alt="" />
            </a>
            <div id="headlineContainer">
            <div id="pw" class="h1">I forgot my password</div>
            <div id="borderBottom"></div>
        </div>

            <p>
                Don't worry! We will send you an email with the instructions to
                reset your password.
            </p>

            <form onsubmit="onSubmit(event);false">
                <input id="email" required name="email" type="email" placeholder="Email" />
                <button type="submit" class="buttonGlobal1">Send me the email</button>
            </form>


          
        </main>
        <div id="emailSentAnimation" class="d-none">
        <img src="./assets/img/SendCheck.png" alt="">
       <span id="forgotPwText"> An E-Mail has been sent to you </span>
       <div id="emailOverlay"></div>
    </div>
</div>
    `;
}


function signUpTemplate() {
    return `
    <div id="headpart">
    <a href="./index.html"> <img id="desktopLogo" src="./assets/img/join_logo.svg"
    alt="" /></a>
    </div>

    <div id="container">
        <main id="signUpContainer">
           <div id="backBtnHeadlineContainer">
            <a href="./index.html" class="backBtn"><img src="./assets/img/arrow_back.png" alt="" /></a>
            <div id="headlineContainer">
            <div class="h1">Sign up</div>
            <div id="borderBottom"></div>
        </div>
        </div>

            <form id="signUpForm" onsubmit="addUser(); return false">
                <input id="name" required type="text" placeholder="Name" />
                <span id="namePopUp"></span>
                <input id="email" required type="email" placeholder="Email" />
                <span id="emailPopUp"></span>
                <input id="password" required type="password" placeholder="Password" />
                <span id="passwordPopUp"></span>
                <button class="buttonGlobal1">Sign up</button>
            </form>
        </main>
    </div>
`;
}

function mobileAnimation() {
    document.getElementById('noAnimation').classList.add('d-none');
    document.getElementById('introAnimationContainer').classList.add('d-none');
    document.getElementById('mobileAnimationContainer').classList.add('mobileContainerAnimation');
    document.getElementById('mobileLogo').classList.add('mobileLogoAnimation');
    document.getElementById('blackLogo').classList.add('blackLogoAnimation');

    setTimeout(() => {
        document.getElementById('mobileAnimationContainer').classList.add('z-index');
        document.getElementById('blackLogoAnimationContainer').classList.add('z-index');
    }, 1300);
}

function desktopAnimation() {
    document.getElementById('noAnimation').classList.add('d-none');
    document.getElementById('introAnimationContainer').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById("introAnimationContainer").classList.add("introAnimation");
        document.getElementById("loginContainer").classList.remove("d-none");
        document.getElementById('headpartRightSideContainer').classList.remove('zero-opacity');
    }, 1300);
}

function desktopNoAnimation() {
    document.getElementById("loginContainer").classList.remove("d-none");
    document.getElementById('headpartRightSideContainer').classList.remove('zero-opacity');
}