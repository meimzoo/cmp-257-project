//hamda javascript:

// Toggle password visibility
const toggleBtn = document.getElementById('togglePass');
const passwordField = document.getElementById('password');


if (toggleBtn && passwordField) {
  toggleBtn.addEventListener('click', () => {
    const isHidden = passwordField.type === 'password';
    passwordField.type = isHidden ? 'text' : 'password';
    toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
  });
}


// Login validation
const form = document.getElementById('loginForm');
const hint = document.getElementById('formHint');


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value.trim();


  if (!email || !password) {
    hint.textContent = 'Please fill in both fields.';
    return;
  }
  if (password.length < 6) {
    hint.textContent = 'Password must be at least 6 characters.';
    return;
  }


  hint.style.color = '#2f7a3a';
  hint.textContent = 'Signing you in...';


  setTimeout(() => {
    hint.textContent = 'Login successful! (Demo)';
  }, 1000);
});
