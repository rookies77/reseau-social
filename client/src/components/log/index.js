import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';


const Index = (props) => {
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);

    const handleModals = (e)=>{
        if(e.target.id === 'register'){
            setSignInModal(false);
            setSignUpModal(true);
        }else if(e.target.id === 'login'){
            setSignInModal(true);
            setSignUpModal(false);
        }
    }
    return (
        <div>
            <div className="connection-form">
                <div className="form-container">
                    <ul>
                        <li className={signUpModal? "active-btn" : null} onClick={handleModals} id='register'>S'inscrire</li>
                        <li className={signInModal? "active-btn" : null}  onClick={handleModals} id='login'>Se connecter</li>
                    </ul>
                    {signInModal && <SignInForm />}
                    {signUpModal && <SignUpForm />}
                </div>
            </div>
        </div>
    );
};

export default Index;