import classes from './DetailsBody.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
function DetailsBody(props) {
  return (
    <div className={classes.details} style={props.style}>
      <h2 className={classes.title}>{props.title}</h2>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsHeader}>
          <input type='text' id='search' placeholder='search' />
          <span></span>
          <div
            className={props.toggleFilter && classes.toggleFilter}
            onClick={() => {
              props.setToggleFilter(!props.toggleFilter);
            }}
          >
            <FontAwesomeIcon
              icon={faFilter}
              style={{ color: props.toggleFilter ? '#49a96e' : '#979797' }}
            />
            <h2>filter</h2>
          </div>
        </div>
        <div className={classes.detailsBody}>
          {props.details.map(details => {
            return (
              <div className={classes.detailsBodyContent}>
                <div className={classes.detailsBodyContentData}>
                  {Object.keys(details).map(
                    a =>
                      a !== 'button' && (
                        <h4>
                          {a} : {details[a]}
                        </h4>
                      )
                  )}
                </div>
                <div className={classes.buttons}>
                {Object.keys(details).map(
                  info =>
                    info === 'button' &&
                    details[info].map(info => {
                      return (
                        <button
                          className={classes.Button}
                          onClick={info.setStates}
                        >
                          {info.title}
                        </button>
                      );
                    })
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default DetailsBody;
