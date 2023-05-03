import classes from './Profile.module.css';
import InformationCard from '../component/InformationCard';
import { useEffect, useState, useContext } from 'react';
import userEvent from '@testing-library/user-event';
import UserContext from '../context/user-context';

function Profile(props) {
  const [selectedHeader, SetSelectedHeader] = useState(1);
  const ctx = useContext(UserContext);
  const [headerList, setHeaderList] = useState([
    [
      /* admin */
    ],
    [
      /* Doctor */
      {
        content: 'Personal Information',
        id: 1,
        informationCards: [
          ctx.PersonalInformation,
          ctx.ContactInformation,
          ctx.AddressInformation,
        ],
      },
    ],
    [
      /* patient */
      {
        content: 'Personal Information',
        id: 1,
        informationCards: [
          ctx.PersonalInformation,
          ctx.ContactInformation,
          ctx.AddressInformation,
        ],
      },
      { content: '', id: 0 },
      {
        content: 'Emergency Information',
        id: 2,
        informationCards: [
          ctx.PersonalInformation,
          ctx.ContactInformation,
          ctx.AddressInformation,
        ],
      },
    ],
    [
      /*Receptionist */
      {
        content: 'Personal Information',
        id: 1,
        informationCards: [
          ctx.PersonalInformation,
          ctx.ContactInformation,
          ctx.AddressInformation,
        ],
      },
    ],
  ]);
  const OnClickEvent = e => {
    SetSelectedHeader(e.target.id);
  };
  return (
    <div className={classes.profile}>
      <div className={classes.header}>
        {headerList[ctx.UserID].map(p =>
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
        {headerList[ctx.UserID].map(
          p =>
            p.id == selectedHeader &&
            p.informationCards.map(card => <InformationCard card={card} />)
        )}
      </div>
    </div>
  );
}
export default Profile;
