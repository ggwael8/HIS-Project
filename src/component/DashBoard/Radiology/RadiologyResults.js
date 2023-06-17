import React, { useEffect, useState } from 'react';
import classes from './Radiology.module.css';
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
    getAllResults(apiUrl + 'lab-radiology/view-radiology-request/');
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
  useEffect(() => {
    async function getAllResults() {
      console.log('asdsad');
      setIsLoading(true);
      const response = await fetch(
        apiUrl + `lab-radiology/view-radiology-request/${resultId}`,
        {
          headers: myHeaders,
        }
      );
      setIsLoading(false);
      const data = await response.json();
      console.log(data);
      setPopUpData(
        data.radiolgy_request.map(info => {
          return {
            id: <span>{info.exam.id}</span>,
            name: <span>{info.exam.name}</span>,
            code: <span>{info.exam.code}</span>,
            price: <span>{info.exam.price}</span>,
            image: info.radiology_result.map(info => {
              return {
                comment: <span>{info.comment}</span>,
                button: {
                  title: 'View Image',
                  setStates: () => {
                    return info.image;
                  },
                },
              };
            }),
            button: {
              title: 'View Report',
              setStates: () => {
                return info.report_file;
              },
            },
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
          <h1 className={classes.title}>Radiology Results</h1>
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
                    return (
                      item.doctor.first_name
                        .toLowerCase()
                        .includes(inputText) ||
                      item.id.toString().includes(inputText) ||
                      (item.Lab_request &&
                        item.Lab_request[0].exam.name
                          .toLowerCase()
                          .includes(inputText))
                    );
                  }
                })
                .map((result, index) => (
                  <div className={classes.cover}>
                    <diV className={classes.billBox}>
                      <div className={classes.id}>
                        <div className={classes.dataTitle}>ID:</div>
                        <div className={classes.data}>{result.id}</div>
                      </div>
                      <div className={classes.name}>
                        <div className={classes.dataTitle}>Name:</div>
                        {console.log(result)}
                        {result.radiology_request &&
                        result.radiology_request.length > 0 ? (
                          <div className={classes.data}>
                            {result.radiology_request[0].exam.name}
                          </div>
                        ) : (
                          <div className={classes.data}>Exam {index + 1}</div>
                        )}
                      </div>
                      <div className={classes.right}>
                        <div className={classes.dataTitle}>Doctor:</div>
                        <div className={classes.data}>
                          {result.doctor.first_name}
                        </div>
                      </div>
                    </diV>
                    <button
                      onClick={() => {
                        setPopUp(true);
                        setResultId(result.id);
                      }}
                    >
                      View Results
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
        {popUp && popUpData !== null && (
          <PopUp popUp={popUp} setPopUp={setPopUp} Cards={popUpData} />
        )}
      </div>
    </>
  );
}
