import React, { useState } from 'react'
import LogoLogIn from '../component/SignIn/LogoLogIn'
import classes from './ٍSign.module.css'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { apiUrl } from '../utils/api';


const myHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
}); 

export function setAuthToken(token) {
    localStorage.setItem('token', token);
    const time = new Date();
    localStorage.setItem('time', time.getTime());
}
export default function SignIn() {

    function login(username, password) {

        const person = {
            username: username,
            password: password,
        }
        fetch(apiUrl + 'login/', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(person),
        }).then((response) => {
            if (response.status === 200) {
                return response.json().then((data) => {
                    setAuthToken(data.access);
                    console.log(data);
                });
            }
            else {
                console.log(response.status);
                return response.status;
            }
        }).catch(error => {
            console.log(error);
        });
    }
    const navigate = useNavigate();
    const navigateForgetPassword = () => {
        navigate('/forgetpassword/');
    };
    const navigateSignUp = () => {
        navigate('/');
    };
    const initialValues = {
        username: "",
        password: "",
    };
    const validate = (values) => {
        let errors = {};
        
        if (!values.username) {
            errors.username = "Username is Required"
        }
        if (!values.password) {
            errors.password = "Password is Required"
        }
        return errors;
    };
    const handleSubmit = (values, {setSubmitting}) => {
        if (Object.keys(validate(values)).length === 0) {
            login(values.username, values.password);
        }
        setSubmitting(false);
    };

    return (
        <div className={classes.page}>
            <LogoLogIn />
            <div className={classes.lines}>
                <div className={classes.vLine}></div>
                <div className={classes.vLine}></div>
            </div>
            <div className={classes.form}>
                <div className={classes.headlines}>
                    <h1 className={classes.headline}>
                        Sign In
                    </h1>
                    <p>
                        Welcome back
                    </p>
                </div>
                <div className={classes.form_details}>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        <Form className={classes.signin_form}>
                            <div>
                                <div className={classes.fields}>
                                    <div>
                                        <Field
                                            type="text"
                                            name='username'
                                            placeholder='Username'
                                        />
                                        <ErrorMessage name='username' component='div' className={classes.error}/>
                                    </div>
                                    <div>
                                        <Field
                                            type='password'
                                            name='password'
                                            placeholder='Password'
                                        />
                                        <ErrorMessage name='password' component='div' className={classes.error } />
                                    </div>
                                    <div className={classes.forget}>
                                        <span className={classes.sign} onClick={navigateForgetPassword}>Forget Password</span>
                                    </div>
                                </div>
                                <div className={classes.btn}>
                                    <button type='submit'>
                                        Login
                                    </button>
                                    <p className={classes.account}>
                                        Don't Have An Account?
                                        <span className={classes.sign} onClick={navigateSignUp}>Sign Up</span>
                                    </p>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}
