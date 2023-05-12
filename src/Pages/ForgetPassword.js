import React from 'react'
import LogoLogIn from '../component/SignIn/LogoLogIn'
import classes from './ٍSign.module.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';


export default function SignIn() {
    const initialValues = {
        email: "",
    };
    const validate = (values) => {
        let errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.email) {
            errors.email = "Email is required";
        }
        else if (!regex.test(values.email)) {
            errors.email = "Invalid Email";
        }
        return errors;
    };
    const handleSubmit = (values) => {
        console.log(values)
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
                    <h1 className={classes.headline} style={{margin : '2% 20%'}}>
                        Forget
                        Password ?
                    </h1>
                    <p style={{margin : '0 35%'}}>
                        it's okay we'll send you reset password instruction
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
                                    <Field
                                        type="text"
                                        name='email'
                                        placeholder='Email Address'
                                    />
                                    <ErrorMessage name='username' component='div' className={classes.error}/>
                                </div>
                                <div className={classes.btn}>
                                    <button type='submit'>
                                        Rest Password
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}
