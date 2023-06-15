import { useState } from 'react';
import DropDownMenu from '../DropDownMenu';
import classes from './Prescription.module.css';

function Prescription(props) {
  const [drugsNumber, setDrugsNumber] = useState(1);
  const [dropDownMenuActive, setDropDownMenuActive] = useState([false]);
  const [prescription, setPrescription] = useState([
    props.isPrescription
      ? {
          drug: null,
          amount: null,
          dose: '',
          duration: '',
          prescription: null,
        }
      : {
          name: '',
          company: '',
          price: null,
          stock: null,
          expire_date: null,
          form: '',
        },
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
              {props.isPrescription && (
                <>
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
                        pagescroll={props.pagescroll}
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
                </>
              )}
              {props.isDrug && (
                <>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='name'>Name</label>
                      <input
                        type='text'
                        id='name'
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].name = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='company'>Company</label>
                      <input
                        type='text'
                        id='company'
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].company = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='price'>Price</label>
                      <input
                        type='number'
                        id='price'
                        min={1}
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].price = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='stock'>Stock</label>
                      <input
                        type='number'
                        id='stock'
                        min={1}
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].stock = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='expire_date'>Expire Date</label>
                      <input
                        type='date'
                        id='expire_date'
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].expire_date = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                  <div className={classes.inputContainer}>
                    <div className={classes.input}>
                      <label htmlFor='form'>Form</label>
                      <input
                        type='text'
                        id='form'
                        onChange={e => {
                          setPrescription(prevState => {
                            const newPrescription = [...prevState];
                            newPrescription[index].form = e.target.value;
                            return newPrescription;
                          });
                          props.selectstate(prescription);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      <button
        className={classes.Link}
        onClick={() => {
          setDrugsNumber(drugsNumber + 1);
          setDropDownMenuActive([...dropDownMenuActive, false]);
          props.isPrescription &&
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
          props.isDrug &&
            setPrescription(() => {
              return [
                ...prescription,
                {
                  name: '',
                  company: '',
                  price: null,
                  stock: null,
                  expire_date: null,
                  form: '',
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
