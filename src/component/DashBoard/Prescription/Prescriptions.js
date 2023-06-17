import React, { useEffect, useState } from 'react';
import classes from './Prescription.module.css';
import { CiFilter } from 'react-icons/ci';
import { apiUrl } from '../../../utils/api';
import PopUp from '../../PopUp/PopUp';
import Loader from '../../Loader/Loader';
export default function Prescriptions() {
  const [allResults, setAllResults] = useState([]);
  const [inputText, setInputText] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `JWT ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    getAllResults(apiUrl + 'pharmacy/patient-prescription/');
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

  useEffect(() => {
    async function getAllResults() {
      console.log('asdsad');
      setIsLoading(true);
      const response = await fetch(
        apiUrl + `pharmacy/patient-prescription/${resultId}`,
        {
          headers: myHeaders,
        }
      );
      setIsLoading(false);
      const data = await response.json();
      console.log(data);
      setPopUpData(
        data.prescription.map(info => {
          return {
            id: <span>{info.id}</span>,
            drug: <span>{info.drug}</span>,
            amount: <span>{info.amount}</span>,
            dose: <span>{info.dose}</span>,
            duration: <span>{info.duration}</span>,
          };
        })
      );
    }
    if (popUp) {
      getAllResults();
    } else {
      setPopUpData(null);
    }
  }, [popUp]);
  const numberOfResult = allResults.length;
  return (
    <>
      {isloading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
          }}
        >
          <Loader cl={'#c59e33'} />
        </div>
      )}
      <div className={classes.page}>
        <div className={classes.allBox}>
          <h1 className={classes.title}>Prescriptions</h1>
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
              {numberOfResult < 1 ? (
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
                        item.doctor.first_name
                          .toLowerCase()
                          .includes(inputText) ||
                        item.date.includes(inputText) ||
                        item.id.includes(inputText)
                      );
                    }
                  })
                  .map(result => (
                    <div className={classes.cover}>
                      <diV className={classes.billBox}>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>ID:</div>
                          <div className={classes.data}>{result.id}</div>
                        </div>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>Doctor:</div>
                          <div className={classes.data}>
                            {result.doctor.first_name}
                          </div>
                        </div>
                        <div className={classes.boxDetails}>
                          <div className={classes.dataTitle}>Date:</div>
                          <div className={classes.data}>
                            {result.date &&
                              new Date(result.date).toLocaleDateString(
                                'en-US',
                                {
                                  day: 'numeric',
                                  month: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                          </div>
                        </div>
                      </diV>
                      <button
                        onClick={() => {
                          setPopUp(true);
                          setResultId(result.id);
                        }}
                      >
                        View Prescription Result
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
        {popUp && popUpData !== null && (
          <PopUp popUp={popUp} setPopUp={setPopUp} Cards={popUpData} />
        )}
      </div>
    </>
  );
}
