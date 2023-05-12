import React from 'react'
import LogoLogIn from '../component/SignIn/LogoLogIn'
import classes from './ٍSign.module.css'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';


export default function SignIn() {
    const navigate = useNavigate();
    const navigateSignIn = () => {
        navigate('/forgetpassword/');
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
            navigateSignIn();
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
                                        <span className={classes.sign} onClick={navigateSignIn}>Forget Password</span>
                                    </div>
                                </div>
                                <div className={classes.btn}>
                                    <button type='submit'>
                                        Login
                                    </button>
                                    <p className={classes.account}>
                                        Already Have An Account?
                                        <span className={classes.sign} onClick={navigateSignIn}>Sign In</span>
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
