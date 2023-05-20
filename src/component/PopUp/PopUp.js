import { useRef, useEffect } from 'react';
import classes from './PopUp.module.css';
import Cards from '../Cards/Cards';
function PopUp(props) {
  const containerRef = useRef();
  const popUpRef = useRef();
  useEffect(() => {
    let SetPopUpFalse = e => {
      if (
        containerRef.current.contains(e.target) &&
        !popUpRef.current.contains(e.target)
      ) {
        props.setPopUp(null);
      }
    };
    document.addEventListener('click', SetPopUpFalse);
    return () => {
      document.removeEventListener('click', SetPopUpFalse);
    };
  });
  return (
    <div className={classes.popUp} ref={containerRef}>
      <div className={classes.popUpGreyBox} ref={popUpRef}>
        <div className={classes.popUpContent}>
          {/* {props.reportFile && (
            <div className={classes.reportFile}>
              <h2>Report File</h2>
              <h3>
                <button
                  className={`${classes.Button} ${classes.ButtonYellow}`}
                  onClick={() => {
                    props.buttonFunction();
                  }}
                >
                  Add Report File
                </button>
              </h3>
            </div>
          )} */}
          <Cards
            Cards={props.Cards}
            title={props.title}
            commentvalue={props.commentvalue}
            commentset={props.commentset}
            files={props.files}
            setFiles={props.setFiles}
            multiple={props.multiple}
            reportFileBool={props.reportFileBool}
            reportFile={props.reportFile}
            setReportFile={props.setReportFile}
            fileTitle={props.fileTitle}
            filesCount={props.filesCount}
            setFilesCount={props.setFilesCount}
          />
          {props.buttonFunction && (
            <h3>
              <button
                className={`${classes.Button} ${classes.ButtonYellow}`}
                onClick={() => {
                  props.buttonFunction();
                }}
              >
                {props.buttonText}
              </button>
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUp;
