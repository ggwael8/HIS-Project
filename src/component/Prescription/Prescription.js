import { useState } from 'react';
import DropDownMenu from '../DropDownMenu';
import classes from './Prescription.module.css';

function Prescription(props) {
  const [drugsNumber, setDrugsNumber] = useState(1);
  const [dropDownMenuActive, setDropDownMenuActive] = useState([false]);
  const [prescription, setPrescription] = useState([
    { drug: null, amount: null, dose: '', duration: '', prescription: null },
  ]);
  const [drugName, setDrugName] = useState([null]);
  const [selected, setSelected] = useState(null);
  return (
    <div className={classes.prescription}>
      {Array.from({ length: drugsNumber }, (_, index) => {
        return (
          <div className={classes.prescriptionContainer}>
            <div className={classes.title}>
              <h4>Drug {index + 1}</h4>
            </div>
            <div className={classes.prescriptionContent}>
              {console.log(prescription)}
              <div
                className={classes.selectionTitle}
                onClick={() => {
                  const newDropDownMenuActive = dropDownMenuActive.map(
                    (item, i) => (i === index ? !item : false)
                  );
                  setDropDownMenuActive(newDropDownMenuActive);
                }}
              >
                {drugName[index] === null ? (
                  <h2>Select Drug</h2>
                ) : (
                  drugName[index]
                )}
              </div>
              {dropDownMenuActive[index] && !selected && (
                <div className={`${classes.dropDownMenu} `}>
                  <DropDownMenu
                    selectstate={setSelected}
                    searchstate={props.searchstate}
                    search={true}
                    scrollable={true}
                    type={'card'}
                    content={props.content}
                    selected={props.selected}
                    clickFunction={(id, name) => {
                      setPrescription(prevState => {
                        const newPrescription = [...prevState];
                        newPrescription[index].drug = id;
                        return newPrescription;
                      });
                      props.selectstate(prescription);
                      setDrugName(prevState => {
                        const newDrugName = [...prevState];
                        newDrugName[index] = name;
                        return newDrugName;
                      });
                      setSelected(null);
                      setDropDownMenuActive(
                        Array(dropDownMenuActive.length).fill(false)
                      );
                    }}
                  />
                </div>
              )}
              <div className={classes.inputContainer}>
                <div className={classes.input}>
                  <label htmlFor='amount'>Amount</label>
                  <input
                    type='number'
                    id='amount'
                    min={1}
                    onChange={e => {
                      setPrescription(prevState => {
                        const newPrescription = [...prevState];
                        newPrescription[index].amount = e.target.value;
                        return newPrescription;
                      });
                      props.selectstate(prescription);
                    }}
                  />
                </div>
              </div>
              <div className={classes.inputContainer}>
                <div className={classes.input}>
                  <label htmlFor='dose'>Dose</label>
                  <input
                    type='text'
                    id='dose'
                    onChange={e => {
                      setPrescription(prevState => {
                        const newPrescription = [...prevState];
                        newPrescription[index].dose = e.target.value;
                        return newPrescription;
                      });
                      props.selectstate(prescription);
                    }}
                  />
                </div>
              </div>
              <div className={classes.inputContainer}>
                <div className={classes.input}>
                  <label htmlFor='duration'>Duration</label>
                  <input
                    type='text'
                    id='duration'
                    onChange={e => {
                      setPrescription(prevState => {
                        const newPrescription = [...prevState];
                        newPrescription[index].duration = e.target.value;
                        return newPrescription;
                      });
                      props.selectstate(prescription);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <button
        className={classes.Link}
        onClick={() => {
          setDrugsNumber(drugsNumber + 1);
          setDropDownMenuActive([...dropDownMenuActive, false]);
          setPrescription(() => {
            return [
              ...prescription,
              {
                drug: null,
                amount: null,
                dose: '',
                duration: '',
                prescription: null,
              },
            ];
          });
          props.selectstate(prescription);
          setDrugName([...drugName, null]);
        }}
      >
        + Add More Drugs
      </button>
    </div>
  );
}
export default Prescription;
