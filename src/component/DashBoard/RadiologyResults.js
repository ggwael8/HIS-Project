import React, { useState } from 'react';
import './Radiology.css';
const labs = [
  {
    id: 201,
    name: 'xray',
    doctor: 'Ahmed',
    results: 'Results for id 201',
  },
  {
    id: 202,
    name: 'xray',
    doctor: 'Ahmed',
    results: 'Results for id 202',
  },
  {
    id: 203,
    name: 'xray',
    doctor: 'Ahmed',
    results: 'Results for id 203',
  },
];

const RadiologyList = () => {
  const [selectedRadiology, setSelectedRadiology] = useState(null);

  const handleViewResults = Radiology => {
    setSelectedRadiology(Radiology);
  };

  return (
    <div className='container'>
      <div className='title'>
        <h1>Radiology Results</h1>
      </div>
      <div className='Radiology-list'>
        {/* <h1>Radiology Results</h1> */}
        <div className='header'>
          <ul>
            {labs.map(Radiology => (
              <li key={Radiology.id}>
                <div>
                  <span>ID: {Radiology.id}</span>
                </div>
                <div>
                  <span>Name: {Radiology.name}</span>
                </div>
                <div>
                  <span>Doctor: {Radiology.doctor}</span>
                </div>
                <button
                  className='view-results-button'
                  onClick={() => handleViewResults(Radiology)}
                >
                  View Results
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedRadiology && (
          <div className='Radiology-results'>
            <h2>Lab Results</h2>
            <div>
              <span>ID: {selectedRadiology.id}</span>
            </div>
            <div>
              <span>Name: {selectedRadiology.name}</span>
            </div>
            <div>
              <span>Doctor: {selectedRadiology.doctor}</span>
            </div>
            {selectedRadiology.results && (
              <div>
                <span>Results: {selectedRadiology.results}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RadiologyList;
