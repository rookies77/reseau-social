import React, { useState } from 'react';
import axios from 'axios';

const SignInForm = () => {

    const { REACT_APP_API_URL } = process.env;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault()
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');

       await axios({
            method: "post",
            url: `${REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email: email,
                password: password
            }
        }).then(
            (res) => {
                if (res.data.errors) {
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                } else {
                console.log('res signIn :', res);
                    window.location = '/'
                }

            }
        ).catch((err) => {
            console.log('errorss', err)
        })
    }
    // axios.defaults.withCredentials = true;
    return (
        <form action="" id="sign-up-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <br />
            <input type="text" name='email' id='email' onChange={(e) => {
                setEmail(e.target.value)
            }} value={email} />
            <div className="email error"></div>
            <br />
            <label htmlFor="password">Mot de passe</label>
            <br />
            <input type="password" id='password' name='password' onChange={(e) => setPassword(e.target.value)} value={password} />
            <br />
            <div className="password error"></div>
            <input type="submit" value="se connecter" />
        </form>
    );
};

export default SignInForm;