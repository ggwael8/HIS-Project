import React, { useEffect, useState } from 'react'
import classes from './Bills.module.css'
import { CiFilter } from "react-icons/ci";
import { apiUrl } from '../../../utils/api';



export default function Bills() {
    const [allResults, setAllResults] = useState([]);
    const [inputText, setInputText] = useState('');

    const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
    });
    
    useEffect(() => {
        getAllResults(
            apiUrl + 'bills/bill/'
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

    function getMonthName(monthNumber) {
        const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return months[monthNumber - 1] || '';
    }

    const numberOfBills = allResults.length;
    
    return (
        <div className={classes.page}>
            <div className= {classes.allBox}>
                <h1 className={classes.title}>Payments</h1>
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
                            const formattedDate = new Date(item.time_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).toLowerCase();
                            return (
                                item.appointment.doctor.first_name.toLowerCase().includes(inputText) ||
                                formattedDate.includes(inputText) ||
                                item.total.toString().includes(inputText)
                            )
                        }
                    }).map((result) => (
                    <div className={classes.cover}>
                        <diV className = {classes.billBox}>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Doctor
                                </div>
                                <div className={classes.data}>
                                    {result.appointment.doctor.first_name} {result.appointment.doctor.last_name} 
                                </div>
                            </div>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Date
                                </div>
                                <div className={classes.data}>
                                    {getMonthName(new Date(result.time_date).getMonth() + 1)}{' '}
                                    {new Date(result.time_date).getDate()}, {new Date(result.time_date).getFullYear()}
                                </div>
                            </div>
                            <div className={classes.boxDetails}>
                                <div className={classes.dataTitle}>
                                    Total
                                </div>
                                <div className={classes.data}>
                                    {result.total} L.E
                                </div>  
                            </div>
                        </diV>
                        <button>
                            View Detials
                        </button>
                    </div>
                    )))}
                </div>
            </div>
        </div>
    )
}
