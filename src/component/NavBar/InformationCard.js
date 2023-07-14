import classes from './InformationCard.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function InformationCard(props) {
  function validationHandler(key, inputValue, index1, info) {
    if (props.required.includes(key) && inputValue.trim() === '') {
      // Check if the input value is empty
      const updatedInfo = { ...info, [key]: '' };
      const updatedCard = [...props.card];
      updatedCard[index1] = updatedInfo;
      props.setCard(updatedCard);
      toast.error('This field is required, please fill it', toastPlaceHolder);
    } else if (
      key === 'Email' &&
      inputValue !== '' &&
      !validateEmail(inputValue)
    ) {
      // Check if the input value is a valid email
      toast.error('Invalid email', toastPlaceHolder);
    } else if (key === 'MobileNumber1' || key === 'MobileNumber2') {
      const regex = /^\+\d{1,3}\d{9}$/;
      if (!regex.test(inputValue)) {
        toast.error('Invalid phone number, Ex. +20123456789', toastPlaceHolder);
      }
    } else if (key === 'NationalId' && inputValue.length !== 14) {
      console.log(inputValue.length);
      toast.error('Invalid National ID', toastPlaceHolder);
    }
  }
  function validateEmail(email) {
    // Regular expression to validate email addresses
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }
  const toastPlaceHolder = {
    position: 'bottom-right',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  return (
    <>
      {props.card.map((info, index1) => {
        return (
          <div className={classes.informationCard}>
            <div className={classes.header}>
              <h1 className={classes.title}>{info.title}</h1>
            </div>
            {Object.keys(info)
              .filter(info => info !== 'title' && info !== 'id')
              .map((key, index) => {
                return (
                  <div className={classes.content}>
                    <h2>
                      {key}
                      {props.required.includes(key) && (
                        <span style={{ color: '#df5c5c' }}> * </span>
                      )}
                      :{' '}
                      {props.editing && !props.notEditable.includes(key) ? (
                        key === 'Gender' ? (
                          <select
                            id='gender'
                            value={info[key]}
                            className={classes.input}
                            onChange={e => {
                              const updatedInfo = {
                                ...info,
                                [key]: e.target.value,
                              };
                              const updatedCard = [...props.card];
                              updatedCard[index1] = updatedInfo;
                              props.setCard(updatedCard);
                            }}
                          >
                            <option value=''>Select gender</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                          </select>
                        ) : (
                          <input
                            type={
                              key === 'NationalId' || key === 'AppartmentNumber'
                                ? 'number'
                                : key === 'DateOfBirth'
                                ? 'date'
                                : key === 'Email'
                                ? 'email'
                                : 'text'
                            }
                            value={info[key]}
                            className={classes.input}
                            required
                            onChange={e => {
                              const updatedInfo = {
                                ...info,
                                [key]: e.target.value,
                              };
                              const updatedCard = [...props.card];
                              updatedCard[index1] = updatedInfo;
                              props.setCard(updatedCard);
                            }}
                            onBlur={e => {
                              const inputValue = e.target.value;
                              validationHandler(key, inputValue, index1, info);
                            }}
                            onInvalid={e => {
                              console.log('invalid');
                              e.preventDefault();
                              toast.error('Invalid input', toastPlaceHolder);
                            }}
                          />
                        )
                      ) : (
                        <span>
                          {info[key] === '' || info[key] === undefined
                            ? 'N/A'
                            : info[key]}
                        </span>
                      )}
                    </h2>
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );

  // <div className={classes.informationCard}>
  //   <div className={classes.header}>
  //     <h1 className={classes.title}>{props.card.title}</h1>
  //   </div>

  //   {/* <div className={classes.content}>{content}</div> */}
  // </div>
}

export default InformationCard;
