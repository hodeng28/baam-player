const $signupBtn = document.querySelector('.signup-signup-btn');
const $signupIdInput = document.querySelector('.signup-id-input');
const $signupPasswordInput = document.querySelector('.signup-password-input');
const $signupNameInput = document.querySelector('.signup-name-input');
const $signupEmailInput = document.querySelector('.signup-email-input');
const $signupCompletePopup = document.querySelector('.signup-complete-popup');
const $rejectSignupMsg = document.querySelector('.reject-signup-msg');
const $completeSignupMsg = document.querySelector('.signup-complete-msg');
const $afterSigninBtn = document.querySelector('.signup-after-signin-btn');
const $afterCancelBtn = document.querySelector('.signout-ckcancel-btn');

const $signupPopup = document.querySelector('.signup-popup');
const $signinPopup = document.querySelector('.signin-popup');
const $signupPopupClose = document.querySelector('.signup-popup-close');

const $signinIdInput = document.querySelector('.signin-id-input');
const $signinPasswordInput = document.querySelector('.signin-password-input');

const completeSignUp = message => {
  console.log(message);
  $signupPopup.classList.add('hidden');
  $signupCompletePopup.classList.remove('hidden');
  $completeSignupMsg.textContent = message;
};

const rejectSignUp = message => {
  $rejectSignupMsg.textContent = message;
  $signupCompletePopup.classList.add('hidden');
};

const removeRejectSignUpMsg = () => {
  rejectSignUp('');
};

const signup = async (id, name, password, email) => {
  try {
    // eslint-disable-next-line no-undef
    const { data } = await axios.post('/signup', {
      id, name, password, email
    });
    if (data.type) {
      completeSignUp(data.message);
    } else {
      rejectSignUp(data.message);
    }
  } catch (e) {
    console.error(e);
  }
};


$signupBtn.addEventListener('click', () => {
  removeRejectSignUpMsg();
  const id = $signupIdInput.value;
  const name = $signupNameInput.value;
  const password = $signupPasswordInput.value;
  const email = $signupEmailInput.value;

  signup(id, name, password, email);
});


$afterCancelBtn.addEventListener('click', () => {
  removeRejectSignUpMsg();
});


$afterSigninBtn.addEventListener('click', () => {
  $signinPopup.classList.remove('hidden');
  $signupCompletePopup.classList.add('hidden');
  $signinIdInput.innerText = '';
  $signinPasswordInput.innerText = '';
});

$signupPopupClose.addEventListener('click', () => {
  removeRejectSignUpMsg();
});
