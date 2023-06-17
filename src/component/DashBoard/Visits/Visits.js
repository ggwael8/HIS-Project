import React, { useEffect, useState } from 'react';
import classes from './Visits.module.css';
import { CiFilter } from 'react-icons/ci';
import { apiUrl } from '../../../utils/api';

export default function Visits() {
  const [allResults, setAllResults] = useState([]);
  const [inputText, setInputText] = useState('');

  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `JWT ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    getAllResults(apiUrl + 'records/visits/');
  }, []);
  async function getAllResults(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
      });
      const data = await response.json();
      setAllResults(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  const numberOfBills = allResults.length;

  return (
    <div className={classes.page}>
      <div className={classes.allBox}>
        <h1 className={classes.title}>Visits</h1>
        <div className={classes.paymentBox}>
          <div className={classes.searchBar}>
            <input
              placeholder='Search'
              className={classes.search}
              onChange={e => {
                setInputText(e.target.value.toLowerCase());
              }}
            />
            <CiFilter />
            Filter
          </div>
          <div className={classes.container}>
            {numberOfBills < 1 ? (
              <div className={classes.health}>
                <h1>We hope you are always in good health</h1>
              </div>
            ) : (
              allResults
                .filter(item => {
                  if (inputText === '') {
                    return item;
                  } else {
                    const formattedDate = new Date(item.time_date)
                      .toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      .toLowerCase();
                    return (
                      item.appointment.doctor.first_name
                        .toLowerCase()
                        .includes(inputText) ||
                      formattedDate.includes(inputText) ||
                      item.total.toString().includes(inputText)
                    );
                  }
                })
                .map(result => (
                  <div className={classes.cover}>
                    <diV className={classes.billBox}>
                      <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>Doctor:</div>
                        <div className={classes.data}>
                          {result.doctor.first_name}
                        </div>
                      </div>
                      {/* <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Room Number: 
                                </div>
                                <div className={classes.data}>
                                        {result.id}
                                        13
                                </div>
                            </div> */}
                      <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>Date:</div>
                        <div className={classes.data}>
                          {result.admission_date &&
                            new Date(result.admission_date).toLocaleDateString(
                              'en-US',
                              {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                              }
                            )}
                        </div>
                      </div>
                      <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>Diagnosis:</div>
                        <div className={classes.data}>{result.diagnosis}</div>
                      </div>
                    </diV>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
