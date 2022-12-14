const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    if(validator.isEmpty(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports = validateLoginInput;