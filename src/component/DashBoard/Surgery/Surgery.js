import React, { useEffect, useState } from 'react';
import classes from './Surgery.module.css';
import { CiFilter } from 'react-icons/ci';
import { apiUrl } from '../../../utils/api';

export default function Surgery() {
  const [allResults, setAllResults] = useState([]);
  const [inputText, setInputText] = useState('');

  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `JWT ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    getAllResults(apiUrl + 'records/surgery/');
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

  function getMonthName(monthNumber) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[monthNumber - 1] || '';
  }

  const numberOfSurgery = allResults.length;

  return (
    <>
      <div className={classes.page}>
        <div className={classes.allBox}>
          <h1 className={classes.title}>Surgery</h1>
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
              {numberOfSurgery < 1 ? (
                <div className={classes.health}>
                  <h1>We hope you are always in good health</h1>
                </div>
              ) : (
                allResults
                  .filter(item => {
                    if (inputText === '') {
                      return item;
                    } else {
                      const formattedDate = new Date(item.date)
                        .toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                        .toLowerCase();
                      return (
                        item.doctor.first_name
                          .toLowerCase()
                          .includes(inputText) ||
                        item.surgery_type.includes(inputText) ||
                        formattedDate.includes(inputText) ||
                        item.time.toLowerCase().includes(inputText)
                      );
                    }
                  })
                  .map(result => (
                    <div className={classes.cover}>
                      <div className={classes.billBox}>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>Doctor:</div>
                          <div className={classes.data}>
                            {result.doctor.first_name}
                          </div>
                        </div>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>Surgery:</div>
                          <div className={classes.data}>
                            {result.surgery_type}
                          </div>
                        </div>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>Date:</div>
                          <div className={classes.data}>
                            {getMonthName(new Date(result.date).getMonth() + 1)}{' '}
                            {new Date(result.date).getDate()},{' '}
                            {new Date(result.date).getFullYear()}
                          </div>
                        </div>
                        <div
                          style={{ width: '30%' }}
                          className={classes.boxDetails}
                        >
                          <div className={classes.dataTitle}>Time:</div>
                          <div className={classes.data}>
                            {result.time.split(':').slice(0, 2).join(':')}
                          </div>
                        </div>
                      </div>
                      <a
                        className={`${classes.File} ${classes.ButtonGreen}`}
                        href={result.documentation}
                        target='_blank'
                        rel='noreferrer'
                      >
                        View Result
                      </a>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
