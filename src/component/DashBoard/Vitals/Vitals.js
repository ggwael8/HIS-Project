import React, { useEffect, useState } from 'react'
import classes from './Vitals.module.css'
import { apiUrl } from '../../../utils/api';

export default function Vitals() {
    
    const [lastResult, setLastResult] = useState(null);

    const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
    });
    
    useEffect(() => {
        getAllResults(
            apiUrl + 'records/vitals/'
        );
    }, []);
    async function getAllResults(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: myHeaders,
            });
            const data = await response.json();
            const results = data.results;
            if (results.length > 0) {
                setLastResult(results[results.length - 1]);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className={classes.page}>
            <div className= {classes.allBox}>
                <h1 className={classes.title}>Vitals</h1>
                <div className={classes.VitalsBox} >
                  <div className={classes.boxDetails}>
                      <div className={classes.dataTitle}>
                          Weight: 
                      </div>
                      <div className={classes.data}>
                        {lastResult && lastResult.weight} kg
                      </div>
                  </div>
                  <div className={classes.boxDetails}>
                      <div className={classes.dataTitle}>
                          Height:
                      </div>
                      <div className={classes.data}>
                        {lastResult && lastResult.height} cm
                      </div>
                  </div>  
                  <div className={classes.boxDetails}>
                      <div className={classes.dataTitle}>
                          Blood Pressure:
                      </div>
                      <div className={classes.data}>
                        {lastResult && lastResult.blood_pressure}
                      </div>
                    </div>
                    <div className={classes.boxDetails}>
                      <div className={classes.dataTitle}>
                        Temperature:
                      </div>
                        <div className={classes.data}>
                        {lastResult && lastResult.temperature} c
                      </div>
                     </div>
                    <div className={classes.boxDetails}>
                    <div className={classes.dataTitle}>
                        Heart Rate: 
                    </div>
                    <div className={classes.data}>
                        {lastResult && lastResult.heart_rate} bpm
                    </div>
                  </div>
                </div>
            </div>
        </div>
    )
}
