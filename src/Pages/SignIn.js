import React, { useState } from 'react';
import LogoLogIn from '../component/SignIn/LogoLogIn';
import classes from './ٍSign.module.css';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { apiUrl } from '../utils/api';

const myHeaders = new Headers({
  'Content-Type': 'application/json',
  Authorization: `JWT ${localStorage.getItem('token')}`,
});

export function setAuthToken(token) {
  localStorage.setItem('token', token);
  const time = new Date();
  localStorage.setItem('time', time.getTime());
}

export default function SignIn() {
  const [error, setError] = useState(null);
  async function login(username, password) {
    const response = await fetch(apiUrl + 'login/', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setAuthToken(data.access);
      navigate('/');
      window.location.reload(true);
      return response;
    } else {
      setError('Invalid username or password');
      return response;
    }
  }
  const navigate = useNavigate();
  const navigateForgetPassword = () => {
    navigate('/forgetpassword/');
  };
  const navigateSignUp = () => {
    navigate('/signup/');
  };
  const initialValues = {
    username: '',
    password: '',
  };
  const validate = values => {
    let errors = {};

    if (!values.username) {
      errors.username = 'Username is Required';
    }
    if (!values.password) {
      errors.password = 'Password is Required';
    }
    return errors;
  };
  const handleSubmit = (values, { setSubmitting }) => {
    if (Object.keys(validate(values)).length === 0) {
      login(values.username, values.password);
      // setTimeout(() => {
      //   navigate('/');
      //   window.location.reload(true);
      // }, 2000);
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
          <h1 className={classes.headline}>Sign In</h1>
          <p>Welcome back</p>
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
                    <Field type='text' name='username' placeholder='Username' />
                    <ErrorMessage
                      name='username'
                      component='div'
                      className={classes.error}
                    />
                  </div>
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
                    <p className={classes.error}>{error}</p>
                  </div>
                  {/* <div className={classes.forget}>
                    <span
                      className={classes.sign}
                      onClick={navigateForgetPassword}
                    >
                      Forget Password
                    </span>
                  </div> */}
                </div>
                <div className={classes.btn}>
                  <button type='submit'>Login</button>
                  <p className={classes.account}>
                    Don't Have An Account?
                    <span className={classes.customSpan}>
                      Create One From Receptionist Inside Hospital
                    </span>
                  </p>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
