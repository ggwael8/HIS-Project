import React from 'react';
import classes from './ٍSign.module.css';
import Logo from '../component/SignUp/Logo';
import SignUpHeadline from '../component/SignUp/SignUpHeadline';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function SignUpLogin({ setNow, handleUserData }) {
  const navigate = useNavigate();
  const navigateSignIn = () => {
    navigate('/signin/');
  };
  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const validate = values => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!regex.test(values.email)) {
      errors.email = 'Invalid Email';
    }
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 4) {
      errors.password = 'Password too short';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Password is required';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Password should comfirmed';
    }
    return errors;
  };
  const handleSubmit = (values, { setSubmitting }) => {
    if (Object.keys(validate(values)).length === 0) {
      setNow(2);
      handleUserData(values);
    }
    setSubmitting(false);
  };
  return (
    <div className={classes.page}>
      <Logo />
      <div className={classes.lines}>
        <div className={classes.vLine}></div>
        <div className={classes.vLine}></div>
      </div>
      <div className={classes.form}>
        <SignUpHeadline />
        <div className={classes.form_details}>
          <h2>Login Information</h2>
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
                      type='email'
                      name='email'
                      placeholder='Email Address'
                    />
                    <ErrorMessage
                      name='email'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                  <div>
                    <Field type='text' name='username' placeholder='Username' />
                    <ErrorMessage
                      name='username'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                </div>
                <div className={classes.inputes}>
                  <div>
                    <Field
                      type='password'
                      name='password'
                      placeholder='Password'
                    />
                    <ErrorMessage
                      name='password'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                  <div>
                    <Field
                      name='confirmPassword'
                      type='password'
                      placeholder='Confirm Password'
                    />
                    <ErrorMessage
                      name='confirmPassword'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                </div>
                <div className={classes.btn}>
                  <button type='submit'>Continue</button>
                </div>
                <div className={classes.sml_lines}>
                  <div className={classes.big_sml_line}></div>
                  <div className={classes.sml_line}></div>
                  <div className={classes.sml_line}></div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
