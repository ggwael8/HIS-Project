import React, { useEffect, useState } from 'react'
import classes from './Dashboard.module.css'
import { BiCalendarMinus } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";


export default function AppointmentDashboard() {

    const [allResults, setAllResults] = useState([]);
        
    const apiUrl = 'https://hospital-information-system-1-production.up.railway.app/appointments/Booked-Appointments/';
    
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    
    useEffect(() => {
        getAllResults(apiUrl);
    }, [])
    async function getAllResults(url) {
    try {
        while (url) {
            console.log(url);
            
        const response = await fetch(url, {
            method: 'GET',
            headers: myHeaders,
        });
            const data = await response.json();
            console.log(data.results);
            setAllResults(prevResults => [...prevResults, ...data.results]);

            url = data.next;
        }
        } catch (error) {
            console.log(error);
        }
    }



//     async function getAllResults(url) {
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: myHeaders,
//       });
//       const data = await response.json();

//       // Check if fetched results already exist in allResults
//       const uniqueResults = data.results.filter(result => !allResults.some(existingResult => existingResult.id === result.id));

//       setAllResults(prevResults => [...prevResults, ...uniqueResults]);

//       if (data.next !== null) {
//         // Fetch next page if it exists
//         await getAllResults(data.next);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }


    
    function getMonthName(monthNumber) {
        const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return months[monthNumber - 1] || '';
    }
    function type(type) {
        return type === 'new' ? 'New' : 'Follow up';
    }
    const upComingData = allResults.filter(element => element.status === 'waiting');
    const numberOfWaitingRequests = upComingData.length;

    const previousData = allResults.filter(element => element.status === 'completed');
    const numberOfCompletedRequests = previousData.length;
    

    console.log(numberOfCompletedRequests);
    return (
        <div className={classes.page}>
            <div className= {classes.allUpBox}>
                <h1 className={classes.upcomingTitle}>Upcoming Appointments</h1>
                <div className={classes.upcomingBox} >
                    {
                        numberOfWaitingRequests < 1 ? (
                            <div className={classes.health}>
                                <h1>We hope you are always in good health</h1>
                            </div>
                        ) : (
                            upComingData.map((result) => (
                                <div className={classes.upcover} key={result.id}>
                                    <div className={classes.time}>
                                        <div className={classes.rightside}>
                                            <CiClock2 className={classes.clock} />
                                            {`${result.slot.start_time.slice(0, 5)} pm - ${result.slot.end_time.slice(0, 5)}`} pm, Sunday
                                        </div>
                                        <div className={classes.leftside}>
                                            <BiCalendarMinus className={classes.calendarIcon} />
                                            {getMonthName(new Date(result.date).getMonth() + 1)}{' '}
                                            {new Date(result.date).getDate()}, {new Date(result.date).getFullYear()}
                                        </div>
                                    </div>
                                    <div className={classes.upDitails}>
                                        <div className={classes.response}>
                                            <div className={classes.split}>
                                                <div className={classes.upBoxDetails}>
                                                    <div className={classes.dataTitle}>
                                                        Doctor
                                                    </div>
                                                    <div className={classes.upData}>
                                                        {result.doctor.first_name} {result.doctor.last_name} 
                                                    </div>
                                                </div >
                                                <div className={classes.upBoxDetails}>
                                                    <div className={classes.dataTitle}>
                                                        Specialization
                                                
                                                    </div>
                                                    <div className={classes.upData}>
                                                        {result.doctor.specialty}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={classes.split}>
                                                <div className={classes.upBoxDetails}>
                                                    <div className={classes.dataTitle}>
                                                        Type
                                                    </div>
                                                    <div className={classes.upData}>
                                                        {type(result.type)}                                              {/* Follow up */}
                                                    </div>
                                                </div>
                                                <div className={classes.upBoxDetails}>
                                                    <div className={classes.dataTitle}>
                                                        Price
                                                    </div>
                                                    <div className={classes.upData}>
                                                        {result.slot.schedule.price} L.E
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.edit}>
                                            <FaRegEdit />
                                        </div>
                                    </div>
                                </div>
                            )))}
                    </div>
            </div>



            <div className={classes.allpervBox}>
                <div className={classes.boooox}>
                    <h1 className={classes.pervTitle}>Pervious Appointments</h1>
                    <div className = {classes.pervBox}>
                    {
                        numberOfCompletedRequests < 1 ? (
                            <div className={classes.health}>
                                <h1>We hope you are always in good health</h1>
                            </div>
                        ) : (
                            previousData.map((result) => (
                            <div className={classes.pervcover} key={result.id}>
                                <div className={classes.boxDetails}>
                                    <div className={classes.dataTitle}>
                                        Doctor
                                    </div>
                                    <div className={classes.data}>
                                        {result.doctor.first_name} {result.doctor.last_name} 
                                    </div>
                                </div >
                                <div className={classes.boxDetails}>
                                    <div className={classes.dataTitle}>
                                        Price
                                    </div>
                                    <div className={classes.data}>
                                        {result.slot.schedule.price} L.E
                                    </div>
                                </div>
                                <div className={classes.boxDetails}>
                                    <div className={classes.date}>
                                        <BiCalendarMinus className={classes.calendarIcon} />
                                        {getMonthName(new Date(result.date).getMonth() + 1)}{' '}
                                        {new Date(result.date).getDate()}, {new Date(result.date).getFullYear()}
                                    </div>
                                </div>
                            </div>
                        )))}            
                    </div>
                </div>
                <div className={classes.bookBtn}>
                    <button >
                        Book New Appointment
                    </button>
                </div>
            </div>
        </div>
    )
}
