import React, { useEffect, useState } from 'react'
import classes from './Prescription.module.css'
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
            apiUrl + 'pharmacy/patient-prescription/'
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

    const numberOfResult = allResults.length;
    console.log(numberOfResult);
    return (
        <div className={classes.page}>
            <div className= {classes.allBox}>
                <h1 className={classes.title}>Prescriptions</h1>
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
                    numberOfResult < 1 ? (
                        <div className={classes.health}>
                            <h1>We hope you are always in good health</h1>
                        </div>
                    ) : (
                    allResults.filter((item) => {
                        if (inputText === '') {
                            return item;
                        }
                        else {
                            const formattedDate = new Date(item.time_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).toLowerCase();
                            return (
                                item.doctor.first_name.toLowerCase().includes(inputText)
                                ||
                                item.date.includes(inputText)
                                ||
                                item.id.includes(inputText)
                            )
                        }
                    }).map((result) => (
                    <div className={classes.cover}>
                        <diV className={classes.billBox}>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    ID: 
                                </div>
                                <div className={classes.data}>
                                    {result.id}
                                </div>  
                            </div>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Doctor: 
                                </div>
                                <div className={classes.data}>
                                    {result.doctor.first_name} 
                                </div>
                            </div>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Date: 
                                </div>
                                    <div className={classes.data}>
                                        {result.date && new Date(result.date).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric'
                                        })}
                                </div>
                            </div>
                        </diV>
                        <button>
                            View Prescription Result
                        </button>
                    </div>
                    )))}
                </div>
            </div>
        </div>
    )
}
