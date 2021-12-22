module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }

    // if (err.message.includes('pseudo')) {
    //     errors.pseudo = 'Pseudo incorrect ou deja pris';
    // }
    // if (err.message.includes('email')) {
    //     errors.email = 'Email incorrect ou deja pris';
    // }
    if (err.message.includes('password')) {
        errors.password = 'Le mot de passe doit faire 6 caracteres minimum';
    }

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Cet email est deja enregistré code 11000'
    } 
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.pseudo = 'Pseudo incorrect ou deja pris code 11000'
    }
    
    return errors
}

module.exports.signInErrors = (err)=>{
    let errors = {email: '', password: ''};

    if(err.message.includes("Email"))
        errors.email = "Email Inconnu";

    if(err.message.includes("password"))
        errors.password = "Password incorrect"

    return errors;
}