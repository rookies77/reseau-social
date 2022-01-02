import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';



const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');

  const pseudoError = document.querySelector('.pseudo.error');
  const emailError = document.querySelector('.email.error');
  const passwordError = document.querySelector('.password.error');
  const controlPasswordError = document.querySelector('.controlPassword.error');
  const termsError = document.querySelector('.terms.error')
  const terms = document.getElementById('terms');

  const handleResgister = async (e) => {
    e.preventDefault();
    controlPasswordError.innerHTML = '';
    termsError.innerHTML = '';
    if (password !== controlPassword || !terms.checked) {
      if (password !== controlPassword)
        controlPasswordError.innerHTML = 'Les mots de passe ne correspondent pas';
      if (!terms.checked)
        termsError.innerHTML = 'Il faut accepter les conditions générales';

    } else {
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        withCredentials: true,
        data: {
          pseudo: pseudo,
          email: email,
          password: password
        }
      }).then(
        (res) => {
          if (res.data.errors) {
            pseudoError.innerHTML = res.data.errors.pseudo
            passwordError.innerHTML = res.data.errors.password
            emailError.innerHTML = res.data.errors.email
            console.log('res.data.errors :', res.data.errors);
          } else {
            setFormSubmit(true)
            console.log('res signUp REACT :', res);
            // window.location = '/profil'
          }
        }
      ).catch(
        (err) => console.log('Errors signup React : ', err)
      )
    }


  }

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <h4 >Enregistrement reussi, veuillez vous connecter</h4>
        </>
      ) : (
        <form action="" onSubmit={handleResgister} id='sign-up-form'>
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input type="text" name='pseudo' id='pseudo' onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
          <div className="pseudo error"></div>
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <input type="text" name='email' id='email' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className="email error"></div>
          <br />
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input type="password" name='password' id='password' onChange={(e) => setPassword(e.target.value)} value={password} />
          <div className="password error"></div>
          <br />
          <label htmlFor="controlPassword">Confirmer le mot de passe</label>
          <br />
          <input type="password" name='controlPassword' id='controlPassword' onChange={(e) => setControlPassword(e.target.value)} value={controlPassword} />
          <div className="controlPassword error"></div>
          <br />
          <input type="checkbox" id='terms' />
          <label htmlFor="terms">J'accepte les <a href="/" target="_blank" rel='noopener noreferrer'>conditions générales</a></label>
          <br />
          <div className="terms error"></div>
          <br />
          <input type="submit" value='Valider inscription' />
        </form>
      )}

    </>
  );
};

export default SignUpForm;