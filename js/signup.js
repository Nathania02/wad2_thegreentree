export function checkIfPasswordValid(password, confirmPassword) {
    var errors = []
    if (password != confirmPassword) {
        alert('Password does not match!');
    }
    else {
        if (password.length < 8) {
            errors.push('Password length less than 8');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password does not contain any lower case alphabets');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password does not contain any upper case alphabets');
        }
        if (!/\d/.test(password)) {
            errors.push('Password does not contain any numbers');
        }
    }

    return errors
}