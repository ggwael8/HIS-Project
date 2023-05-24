
import React from 'react';
import classes from './ٍSign.module.css';
import Logo from '../component/SignUp/Logo';
import SignUpHeadline from '../component/SignUp/SignUpHeadline';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function SignUpPersonal({ setNow, handleUserData })
{
    const navigate = useNavigate();
    const navigateSignIn = () => {
        navigate('/signin/');
    };
    const initialValues = {
        firstName: "",
        lastName: "",
        nationalID: "",
        gender: "",
        mobileNumber: "",
        dateOfBirth: "",
    };

    const validate = (values) => {
        let errors = {};

        if (!values.firstName) {
            errors.firstName = "Required";
        }
        if (!values.lastName) {
            errors.lastName = "Required"
        }
        if (!values.nationalID) {
            errors.nationalID = "Required";
        }
        if (!values.gender) {
            errors.gender = "Required";
        }
        if (!values.mobileNumber) {
            errors.mobileNumber = "Required";
        }
        if (!values.dateOfBirth) {
            errors.dateOfBirth = "Required";
        }
        return errors;
    };
    const handleSubmit = (values, { setSubmitting }) => {
        if (Object.keys(validate(values)).length === 0) {
            setNow(3);
            handleUserData(values);
        }
        setSubmitting(false);
    };
    return (
        <div className={classes.page}>
            <Logo/>
            <div className={classes.lines}>    
                <div className={classes.vLine}></div>
                <div className={classes.vLine}></div>
            </div>
            <div className={classes.form}>
                <SignUpHeadline />
                <div className={classes.form_details}>
                    <h2>
                        Personal Information
                    </h2>
                    <Formik
                        initialValues={initialValues}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div>
                                <div className={classes.inputes}>
                                    <div>
                                        <Field
                                            type="text"
                                            name='firstName'
                                            placeholder='First Name*'
                                        />
                                        <ErrorMessage name='firstName' component='div' className={classes.error} />
                                    </div>
                                        <div>
                                            <Field
                                                type="text"
                                                name='lastName'
                                                placeholder='Last Name*'
                                            />
                                            <ErrorMessage name='lastName' component='div' className={classes.error} />
                                        </div>
                                </div>
                                <div className={classes.inputes}>
                                    <div>
                                        <Field
                                            type="text"
                                            name='nationalID'
                                            placeholder='National ID*'
                                        />
                                        <ErrorMessage name='nationalID' component='div' className={classes.error} />
                                    </div>
                                    <div>
                                        <Field
                                            as='select'
                                            name='gender'
                                            placeholder='Gender'
                                            className = {classes.select}
                                        >
                                            <option value="">Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Field>
                                        <ErrorMessage name='gender' component='div' className={classes.error} />
                                    </div>
                                </div>

                                <div className={classes.inputes}>
                                    <div>
                                        <Field
                                            type='phone'
                                            name='mobileNumber'
                                            placeholder='Mobile Number'
                                        />
                                        <ErrorMessage name='mobileNumber' component='div' className={classes.error} />
                                    </div>
                                    <div>
                                        <Field
                                            type='text'
                                            name='dateOfBirth'
                                            placeholder='Date Of Birth'
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => (e.target.type = "text")}
                                        />
                                        <ErrorMessage name='dateOfBirth' component='div' className={classes.error} />
                                    </div>
                                </div>
                                
                                <div className={classes.btn}>
                                    <p className={classes.change}>
                                        You can change it any time from profile
                                    </p>
                                    <button type='submit' >
                                        Continue
                                    </button>
                                    <p className={classes.account}>
                                        Already Have An Account?
                                        <span className={classes.sign} onClick={navigateSignIn}>Sign In</span>
                                    </p>
                                </div>
                                <div className={classes.sml_lines}>
                                    <div className={classes.sml_Green_line}></div>
                                    <div className={classes.big_sml_line}></div>
                                    <div className={classes.sml_line}></div>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}
