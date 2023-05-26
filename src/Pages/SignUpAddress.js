import React, { useState } from 'react';
import classes from './ٍSign.module.css';
import Logo from '../component/SignUp/Logo';
import SignUpHeadline from '../component/SignUp/SignUpHeadline';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { apiUrl } from '../utils/api';

const myHeaders = new Headers({
  'Content-Type': 'application/json',
  Authorization: `JWT ${localStorage.getItem('token')}`,
});

export default function SignUpAddress({ userLoginData, userPersonalData }) {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  function addUser(values) {
    console.log(userLoginData);
    console.log(userPersonalData);
    const person = {
      first_name: userPersonalData.firstName,
      last_name: userPersonalData.lastName,
      email: userLoginData.email,
      gender: userPersonalData.gender === 'Male' ? 'M' : 'F',
      password: userLoginData.password,
      phone_1: userPersonalData.mobileNumber,
      phone_2: userPersonalData.mobileNumber,
      role: 'doctor',
      username: userLoginData.username,
    };
    fetch(apiUrl + 'auth/register/', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(person),
    })
      .then(response => {
        console.log(response);
        if (response.status === 201) {
          response.json().then(data => {
            console.log(data);
          });
          setSuccess('User Created Successfully');
        } else {
          setError('User Creation Failed');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  const navigate = useNavigate();
  const navigateSignIn = () => {
    navigate('/signin/');
  };
  const initialValues = {
    fullStreet: '',
    apartmentNumber: '',
    city: '',
    country: '',
  };
  const validate = values => {
    let errors = {};

    if (!values.fullStreet) {
      errors.fullStreet = 'Full Street is Required';
    }
    if (!values.apartmentNumber) {
      errors.apartmentNumber = 'Apartment Number is Required';
    }
    if (!values.city) {
      errors.city = 'City is Requires';
    }
    if (!values.country) {
      errors.country = 'Country is Required';
    }
    return errors;
  };
  const handleSubmit = (values, { setSubmitting }) => {
    addUser(values);
    // if (Object.keys(validate(values)).length === 0) {
    //   navigateSignIn();
    //   addUser(values);
    // }
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
          <h2>Address Information</h2>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <div>
                <div className={classes.inputes}>
                  <div>
                    <Field
                      type='text'
                      name='fullStreet'
                      placeholder='Full Street'
                    />
                    <ErrorMessage
                      className={classes.error}
                      name='fullStreet'
                      component='div'
                    />
                  </div>
                  <div>
                    <Field
                      type='text'
                      name='apartmentNumber'
                      placeholder='Apartment Number'
                    />
                    <ErrorMessage
                      name='apartmentNumber'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                </div>
                <div className={classes.inputes}>
                  <div>
                    <Field type='text' placeholder='City' name='city' />
                    <ErrorMessage
                      name='city'
                      component='div'
                      className={classes.error}
                    />
                  </div>
                  <div>
                    <Field type='text' placeholder='Country' name='country' />
                    <ErrorMessage
                      name='country'
                      className={classes.error}
                      component='div'
                    />
                  </div>
                </div>
                <div className={classes.btn}>
                  <p className={classes.change}>
                    You can change it any time from profile
                  </p>
                  <button type='submit'>Register</button>
                </div>
                <div className={classes.sml_lines}>
                  <div className={classes.sml_Green_line}></div>
                  <div className={classes.sml_Green_line}></div>
                  <div className={classes.big_sml_line}></div>
                </div>
                <div
                  className={classes.sml_lines}
                  style={{ marginTop: '1rem' }}
                >
                  <p className={classes.success}>{success}</p>
                  <p className={classes.error}>{error}</p>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

// Green #49A96E
// blue #40B8F3
// grey #979797
// black #474747
