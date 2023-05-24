import { useState } from 'react';
import classes from './FormInput.module.css';
import Dropzone from 'react-dropzone';

function FormInput(props) {
  const [drugsNumber, setDrugsNumber] = useState(1);
  const [dropDownMenuActive, setDropDownMenuActive] = useState([false]);
  const [inputDetail, setInputDetail] = useState([props.rawData]);
  const [drugName, setDrugName] = useState([null]);
  const [selected, setSelected] = useState(null);
  return (
    <div className={classes.formInput}>
      {Array.from({ length: drugsNumber }, (_, index) => {
        return (
          <div className={classes.formInputContainer}>
            <div className={classes.title}>
              <h4>{props.title}</h4>
            </div>
            <div className={classes.formInputContent}>
              <>
                {Object.keys(inputDetail[0]).map(info => {
                  return info === 'documentation' ? (
                    <Dropzone
                      onDrop={acceptedFiles => {
                        props.setReportFile(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                          {...getRootProps()}
                          className={`${classes.dropzone} ${
                            isDragActive ? classes.active : ''
                          }`}
                        >
                          <input {...getInputProps()} />
                          {console.log(props.reportFile)}
                          {props.reportFile ? (
                            <p>{props.reportFile[0].name}</p>
                          ) : (
                            <p>Drag Or Click To Add Documentation</p>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  ) : (
                    <div className={classes.inputContainer}>
                      <div className={classes.input}>
                        <label htmlFor={info}>{info}</label>
                        <input
                          type={
                            info === 'date' ||
                            info === 'admission_date' ||
                            info === 'discharge_date'
                              ? 'date'
                              : info === 'time'
                              ? 'time'
                              : info === 'room_number' ||
                                info === 'bed_number' ||
                                info === 'patient' ||
                                info === 'doctor' ||
                                info === 'weight' ||
                                info === 'height' ||
                                info === 'temperature' ||
                                info === 'blood_pressure' ||
                                info === 'heart_rate'
                              ? 'number'
                              : 'text'
                          }
                          id={info}
                          min={1}
                          onChange={e => {
                            setInputDetail(prevState => {
                              const newPrescription = [...prevState];
                              newPrescription[index][info] = e.target.value;
                              return newPrescription;
                            });
                            props.selectstate(inputDetail);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default FormInput;
