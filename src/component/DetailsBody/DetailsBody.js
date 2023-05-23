import classes from './DetailsBody.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
function DetailsBody(props) {
  return (
    <div className={classes.details} style={props.style}>
      <h2 className={classes.title}>{props.title}</h2>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsHeader}>
          {props.additionalFunction && (
            <button
              className={classes.Link}
              onClick={() => {
                props.additionalFunction.setStates();
              }}
            >
              {props.additionalFunction.title}
            </button>
          )}
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
                {props.thereIsCard ? (
                  Object.keys(details).map(
                    info =>
                      info === 'cards' &&
                      Object.keys(details[info]).map(cardInfo => {
                        return (
                          <>
                            <div className={classes.detailsBodyContentData}>
                              {cardInfo === 'title' ? (
                                <div
                                  className={
                                    classes.detailsBodyContentDataTitle
                                  }
                                >
                                  <h3>{details[info][cardInfo]}</h3>
                                </div>
                              ) : cardInfo === 'body' ? (
                                <>
                                  {details[info][cardInfo].map(info => {
                                    return (
                                      <div className={classes.card}>
                                        <div
                                          className={
                                            classes.detailsBodyContentData
                                          }
                                        >
                                          {Object.keys(info).map(key => {
                                            return (
                                              key !== 'button' && (
                                                <h3>
                                                  {key} : {info[key]}
                                                </h3>
                                              )
                                            );
                                          })}
                                        </div>
                                        <div className={classes.buttons}>
                                          {Object.keys(info).map(key => {
                                            return (
                                              key === 'button' && (
                                                <a
                                                  className={
                                                    classes.openNewLink
                                                  }
                                                  href={info[key].setStates}
                                                  target='_blank'
                                                  rel='noreferrer'
                                                >
                                                  {console.log(
                                                    info[key].setStates
                                                  )}
                                                  {info[key].title}
                                                </a>
                                              )
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : (
                                <h5>
                                  {cardInfo} : {details[info][cardInfo]}
                                </h5>
                              )}
                            </div>
                          </>
                        );
                      })
                  )
                ) : (
                  <>
                    <div className={classes.detailsBodyContentData}>
                      {Object.keys(details).map(
                        a =>
                          a !== 'button' &&
                          a !== 'cards' && (
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
                            if (info === false) return null;
                            return (
                              <button
                                className={` ${classes.Button}
                                  ${
                                    info.red
                                      ? classes.ButtonRed
                                      : info.yellow
                                      ? classes.ButtonYellow
                                      : classes.ButtonGreen
                                  }`}
                                onClick={info.setStates}
                              >
                                {info.title}
                              </button>
                            );
                          })
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default DetailsBody;
