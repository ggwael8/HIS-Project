import React, { useState } from 'react'
import SignUpLogin from './SignUpLogin';
import SignUpAddress from './SignUpAddress';
import SignUpPersonal from './SignUpPersonal';

export default function Register() {

    const [userPersonalData, setUserPersonalData] = useState(null);
    const [userLoginData, setUserLoginData] = useState(null);
    const handleUserLoginData = (data) => {
        setUserLoginData(data)
    }
    const handlePersonalData = (data) => {
        setUserPersonalData(data)
    }
    const [now, setNow] = useState(1);
    return (
        <div>
            {now === 1 && <SignUpLogin
                setNow={setNow}
                handleUserData = {handleUserLoginData}
            />}
            {now === 2 && <SignUpPersonal
                setNow={setNow}
                handleUserData = {handlePersonalData}
            />}
            {now === 3 && <SignUpAddress
                userLoginData={userLoginData}
                userPersonalData={userPersonalData}
            />}
        </div>
    )
}