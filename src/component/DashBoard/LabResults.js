import React, { useState } from 'react';
import './Lab.css';
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

const LabList = () => {
  const [selectedLab, setSelectedLab] = useState(null);

  const handleViewResults = lab => {
    setSelectedLab(lab);
  };

  return (
    <div className='container'>
      <div className='title'>
        <h1>Lab Results</h1>
      </div>
      <div className='lab-list'>
        <div className='header'>
          <ul>
            {labs.map(lab => (
              <li key={lab.id}>
                <div>
                  <span>ID: {lab.id}</span>
                </div>
                <div>
                  <span>Name: {lab.name}</span>
                </div>
                <div>
                  <span>Doctor: {lab.doctor}</span>
                </div>
                <button
                  className='view-results-button'
                  onClick={() => handleViewResults(lab)}
                >
                  View Results
                </button>
              </li>
            ))}
          </ul>
          {selectedLab && (
            <div className='lab-results'>
              <h2>Lab Results</h2>
              <div>
                <span>ID: {selectedLab.id}</span>
              </div>
              <div>
                <span>Name: {selectedLab.name}</span>
              </div>
              <div>
                <span>Doctor: {selectedLab.doctor}</span>
              </div>
              {selectedLab.results && (
                <div>
                  <span>Results: {selectedLab.results}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabList;
