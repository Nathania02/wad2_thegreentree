function checkIfPasswordValid() {
    var password = document.getElementById('password');
    var confirmPassword = document.getElementById('confirmPassword');
    if (password != confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    else {
        if (password.length < 8) {
            return false;
        }
        if (!/[a-z]/.test(password)) {
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            return false;
        }
        if (!/\d/.test(password)) {
            return false;
        }
    }
    return true;

}

function checkIfUsernameUnique() {

}

function checkIfEmailValid() {
    var email = document.getElementById('email');
}