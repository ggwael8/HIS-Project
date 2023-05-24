import React, { useEffect, useState } from 'react'
import classes from './Lab.module.css'
import { CiFilter } from "react-icons/ci";
import { apiUrl } from '../../../utils/api';

export default function Prescriptions() {
    const [allResults, setAllResults] = useState([]);
    const [inputText, setInputText] = useState('');

    const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
    });
    
    useEffect(() => {
        getAllResults(
            apiUrl + 'lab-radiology/view-test-resutls/'
        );
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
            <div className= {classes.allBox}>
                <h1 className={classes.title}>Lab Results</h1>
                <div className={classes.paymentBox} >
                    <div className={classes.searchBar}>
                        <input
                            placeholder='Search'
                            className={classes.search}
                            onChange={(e) => {
                                setInputText(e.target.value.toLowerCase());
                            }}
                        />
                        <CiFilter />
                        Filter
                    </div>
                    {
                    numberOfBills < 1 ? (
                        <div className={classes.health}>
                            <h1>We hope you are always in good health</h1>
                        </div>
                    ) : (
                    allResults.filter((item) => {
                        if (inputText === '') {
                            return item;
                        }
                        else {
                            return (
                                item.doctor.first_name.toLowerCase().includes(inputText) ||
                                item.id.toString().includes(inputText) ||
                                (item.Lab_request && item.Lab_request[0].exam.name.toLowerCase().includes(inputText))
                            )
                        }
                    }).map((result) => (
                    <div className={classes.cover}>
                        <diV className={classes.billBox}>
                            <div className={classes.id} >
                                <div className={classes.dataTitle}>
                                    ID: 
                                </div>
                                <div className={classes.data}>
                                    {result.id}
                                </div>  
                            </div>
                            <div className={classes.name}>
                                <div className={classes.dataTitle}>
                                        Name:
                                </div>
                                {result.Lab_request && result.Lab_request.length > 0 ? (
                                    <div className={classes.data}>{result.Lab_request[0].exam.name}</div>
                                ) : (
                                    <div className={classes.data}>N/A</div>
                                )}
                            </div>
                            <div className={classes.right}>
                                <div className={classes.dataTitle}>
                                    Doctor: 
                                </div>
                                <div className={classes.data}>
                                    {result.doctor.first_name}
                                </div>
                            </div>
                            
                        </diV>
                        <button>
                            View Results
                        </button>
                    </div>
                    )))}
                </div>
            </div>
        </div>
    )
}
