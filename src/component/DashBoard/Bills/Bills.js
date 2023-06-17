import React, { useEffect, useState } from 'react';
import classes from './Bills.module.css';
import { CiFilter } from 'react-icons/ci';
import { apiUrl } from '../../../utils/api';
import PopUp from '../../PopUp/PopUp';

export default function Bills() {
  const [allResults, setAllResults] = useState([]);
  const [inputText, setInputText] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState([]);
  const [resultId, setResultId] = useState(null);
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `JWT ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    getAllResults(apiUrl + 'bills/bill/');
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

  const numberOfBills = allResults.length;

  useEffect(() => {
    async function getAllResults() {
      console.log('asdsad');
      const response = await fetch(apiUrl + `bills/bill/${resultId}`, {
        headers: myHeaders,
      });
      const data = await response.json();
      console.log(data);
      setPopUpData([
        {
          id: <span>{data.id}</span>,
          appointmentId: <span>{data.appointment.id}</span>,
          patient: (
            <span>
              {data.patient.first_name + ' ' + data.patient.last_name}
            </span>
          ),
          doctor: (
            <span>
              {data.appointment.doctor.first_name +
                ' ' +
                data.appointment.doctor.last_name}
            </span>
          ),
          schedulePrice: <span>{data.appointment.slot.schedule.price}</span>,
          total: <span>{data.total}</span>,
          card: [
            data.insurance !== null && {
              title: 'Insurance',
            },
            data.radiology_request !== null && {
              title: 'Radiology Request',
              card: data.radiology_request.exams.map(info => {
                return {
                  name: <span>{info.name}</span>,
                  price: <span>{info.price}</span>,
                };
              }),
            },
            data.lab_request !== null && {
              title: 'Lab Request',
              card: data.lab_request.exams.map(info => {
                return {
                  name: <span>{info.name}</span>,
                  price: <span>{info.price}</span>,
                };
              }),
            },
            data.prescription !== null && {
              title: 'Prescription',
              card: data.prescription.prescription
                .filter(info => info.dispensed === true)
                .map(info => {
                  return {
                    name: <span>{info.drug.name}</span>,
                    price: <span>{info.drug.price}</span>,
                  };
                }),
            },
          ],
        },
      ]);
    }
    if (popUp) {
      getAllResults();
    } else {
      setPopUpData(null);
    }
  }, [popUp]);
  return (
    <div className={classes.page}>
      <div className={classes.allBox}>
        <h1 className={classes.title}>Payments</h1>
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
                        <div className={classes.dataTitle}>Doctor</div>
                        <div className={classes.data}>
                          {result.appointment.doctor.first_name}{' '}
                          {result.appointment.doctor.last_name}
                        </div>
                      </div>
                      <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>Date</div>
                        <div className={classes.data}>
                          {getMonthName(
                            new Date(result.time_date).getMonth() + 1
                          )}{' '}
                          {new Date(result.time_date).getDate()},{' '}
                          {new Date(result.time_date).getFullYear()}
                        </div>
                      </div>
                      <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>Total</div>
                        <div className={classes.data}>{result.total} L.E</div>
                      </div>
                    </diV>
                    <button
                      onClick={() => {
                        setPopUp(true);
                        console.log(result);
                        setResultId(result.id);
                      }}
                    >
                      View Detials
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      {console.log(popUpData)}
      {popUp && popUpData !== null && (
        <PopUp popUp={popUp} setPopUp={setPopUp} Cards={popUpData} />
      )}
    </div>
  );
}
