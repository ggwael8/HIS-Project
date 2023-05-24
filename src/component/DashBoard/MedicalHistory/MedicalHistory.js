import React, { useEffect, useState } from 'react';
import classes from './MedicalHistory.module.css';
import { apiUrl } from '../../../utils/api';

export default function MedicalHistory() {

    const [allResults, setAllResults] = useState([]);

    const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
    });
    
    useEffect(() => {
        getAllResults(
            apiUrl + 'records/medical-record/'
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
                setAllResults(results[results.length - 1]);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className={classes.page}>
            <div className= {classes.allBox}>
                <h1 className={classes.title}>MedicalHistory</h1>
                <div className={classes.historyBox} >
                    <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>
                            Diagnosis:
                            <span className={classes.data}>
                                {allResults && allResults.diagnosis}
                            </span>
                        </div>
                    </div>
                    <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>
                            Allergies:
                            <span className={classes.data}>
                                {allResults && allResults.allergies}
                            </span>
                        </div>
                        
                    </div>
                    <div className={classes.boxDetails}>
                        <div className={classes.dataTitle}>
                            Family History:  
                            <span className={classes.data}>
                                {allResults.family_history}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
