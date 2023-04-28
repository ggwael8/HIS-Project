import classes from './Profile.module.css';
import InformationCard from './InformationCard';
import { useState } from 'react';
function Profile() {
  const [selectedHeader, SetSelectedHeader] = useState(1);
  const headerList = [
    [
      {
        content: 'Personal Information',
        id: 1,
        informationCards: [
          {
            title: 'Personal Information',
            FirstName: 'Ahmed',
            LastName: 'Ahmed',
            Email: 'efpyi@example.com',
            PhoneNumber: '+91-99999999999',
            Address: '123',
            City: 'Bangalore',
          },
          {
            title: 'Personal Information',
            FirstName: 'Ahmed',
            LastName: 'Ahmed',
            Email: 'efpyi@example.com',
            PhoneNumber: '+91-99999999999',
            Address: '123',
            City: 'Bangalore',
          },
          {
            title: 'Personal Information',
            FirstName: 'Ahmed',
            LastName: 'Ahmed',
            Email: 'efpyi@example.com',
            PhoneNumber: '+91-99999999999',
            Address: '123',
            City: 'Bangalore',
          },
        ],
      },
      { content: '', id: 0 },
      {
        content: 'Emergency Information',
        id: 2,
        informationCards: [
          {
            title: 'aybtngan',
            aybtngan: 'aybtngan',
            aybtngan1: 'aybtngan1',
            aybtngan2: 'aybtngan2',
            aybtngan3: 'aybtngan3',
          },
        ],
      },
    ],
    [{ content: 'Personal Information', id: 1 }],
  ];
  const OnClickEvent = e => {
    SetSelectedHeader(e.target.id);
  };
  return (
    <div className={classes.profile}>
      <div className={classes.header}>
        {headerList[0].map(p =>
          p.id !== 0 ? (
            <h2
              // eslint-disable-next-line eqeqeq
              className={p.id == selectedHeader ? classes.active : undefined}
              onClick={OnClickEvent}
              key={p.index}
              id={p.id}
            >
              {p.content}
            </h2>
          ) : (
            <span key={p.index}> </span>
          )
        )}
        {/* <span></span> */}
      </div>
      <hr></hr>
      <div className={classes.content}>
        {headerList[0].map(
          p =>
            p.id == selectedHeader &&
            p.informationCards.map(card => <InformationCard card={card} />)
        )}
        {/* <InformationCard />
        <InformationCard />
        <InformationCard /> */}
      </div>
    </div>
  );
}
export default Profile;
