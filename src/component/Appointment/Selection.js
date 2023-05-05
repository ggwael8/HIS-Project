import classes from './Selection.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import DropDownMenu from '../DropDownMenu';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dateFormat from 'dateformat';
function Selection(props) {
  const [dropDownMenuActive, setDropDownMenuActive] = useState(false);
  return (
    <div
      className={`${classes.selectionBody} ${
        props.id === props.currentStep ? classes.display : classes.displaynone
      }`}
    >
      {props.type === 'dropDown' && (
        <>
          <div
            className={classes.selectionTitle}
            onClick={() => {
              setDropDownMenuActive(!dropDownMenuActive);
            }}
          >
            <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#68c11f' }} />
            <h2>{props.title}</h2>
          </div>
          <div
            className={`${classes.dropDownMenu} ${
              dropDownMenuActive ? classes.display : classes.displaynone
            }`}
          >
            <DropDownMenu
              content={props.dropDownContent}
              selectstate={props.selectstate}
              searchstate={props.searchstate}
              setSelectedStep={props.setSelectedStep}
              currentStep={props.currentStep}
              type={'text'}
              search={true}
              scrollable={true}
            />
          </div>
        </>
      )}
      {props.type === 'input' && (
        <>
          <input
            className={classes.Input}
            placeholder={props.title}
            onChange={e => {
              props.selectstate(e.target.value);
            }}
          />
          <div className={classes.appointmentType}>
            <h2>Appointment Type</h2>
            <div className={classes.appointmentTypeRadioButtons}>
              <div
                onClick={() => {
                  props.setAppointmentType(0);
                }}
                className={classes.appointmentTypeButton}
              >
                {props.currentAppointmentType === 0 ? (
                  <FontAwesomeIcon
                    icon={faToggleOn}
                    style={{
                      color: '#49A96E',
                    }}
                    size='2xl'
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faToggleOff}
                    size='2xl'
                    style={{
                      color: '#474747',
                    }}
                  />
                )}
                <h3>New</h3>
              </div>
              <div
                onClick={() => {
                  props.setAppointmentType(1);
                }}
                className={classes.appointmentTypeButton}
              >
                {props.currentAppointmentType === 1 ? (
                  <FontAwesomeIcon
                    icon={faToggleOn}
                    style={{
                      color: '#49A96E',
                    }}
                    size='2xl'
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faToggleOff}
                    size='2xl'
                    style={{
                      color: '#474747',
                    }}
                  />
                )}
                <h3>Follow Up</h3>
              </div>
            </div>
            <button
              className={classes.Button}
              onClick={() => {
                props.setSelectedStep(props.currentStep + 1);
              }}
            >
              Confirm
            </button>
          </div>
        </>
      )}
      {props.type === 'selection' && (
        <>
          <div
            className={classes.selectionTitle}
            onClick={() => {
              setDropDownMenuActive(!dropDownMenuActive);
            }}
            style={{ cursor: 'default' }}
          >
            <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#68c11f' }} />
            <h2>{props.title}</h2>
          </div>

          {props.dayAndDuration && (
            <div className={classes.dayAndDuration}>
              {props.currentDayAndDuration.map((current, index) => {
                return (
                  <div className={classes.eachDayAndDuration} key={index}>
                    <div
                      className={classes.Day}
                      onClick={() => {
                        props.dayAndDurationSetState(prev => {
                          const newState = prev.map(obj => {
                            if (obj.id === current.id) {
                              return { ...obj, Work: !obj.Work };
                            }
                            return obj;
                          });
                          return newState;
                        });
                      }}
                    >
                      {current.Work == 0 ? (
                        <FontAwesomeIcon
                          icon={faToggleOff}
                          size='2xl'
                          style={{
                            color: '#474747',
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faToggleOn}
                          style={{
                            color: '#49A96E',
                          }}
                          size='2xl'
                        />
                      )}
                      <h2> {current.Day} </h2>
                    </div>
                    {current.Work == 1 && (
                      <div className={classes.Duration}>
                        <h2>Session Duration:</h2>
                        <input
                          className={classes.DurationInput}
                          placeholder='In Minutes'
                          onChange={e => {
                            props.dayAndDurationSetState(prev => {
                              const newState = prev.map(obj => {
                                if (obj.id === current.id) {
                                  return { ...obj, Duration: e.target.value };
                                }
                                return obj;
                              });
                              return newState;
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {props.DateAndTime && (
            <div className={classes.DateAndTime}>
              <Calendar
                onChange={props.setCurrentDate}
                value={props.currentDate}
                onClickDay={value =>
                  props.DateSetState(dateFormat(value, 'yyyy-mm-dd'))
                }
                // className={classes.react_calendar}
              />
              {props.TimeSlots.length > 0 && (
                <>
                  <div className={classes.TimeSlots}>
                    {props.TimeSlots.map(timeSlot => (
                      <div
                        className={`${classes.Slot} ${
                          timeSlot.id === props.CurrentTime && classes.selected
                        }`}
                        onClick={() => {
                          props.TimeSetState(timeSlot.id);
                        }}
                      >
                        <h2>{timeSlot.body}</h2>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <button
            className={classes.Button}
            onClick={() => {
              props.setSelectedStep(props.currentStep + 1);
            }}
          >
            Confirm
          </button>
        </>
      )}
    </div>
  );
}
export default Selection;
