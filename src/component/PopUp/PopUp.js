import { useRef, useEffect, useState } from 'react';
import classes from './PopUp.module.css';
import Cards from '../Cards/Cards';
import DropDownMenu from '../DropDownMenu';
import Prescription from '../Prescription/Prescription';
import FormInput from '../FormInput/FormInput';
function PopUp(props) {
  const containerRef = useRef();
  const popUpRef = useRef();
  const [drugsNumber, setDrugsNumber] = useState(1);
  const [dropDownMenuActive, setDropDownMenuActive] = useState(false);
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
          {props.text && <h3>{props.text}</h3>}
          {props.Cards && (
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
          )}
          {props.selection && (
            <>
              <DropDownMenu
                selectstate={props.selectstate}
                searchstate={props.searchstate}
                search={true}
                scrollable={true}
                type={'card'}
                multiple={props.multiple}
                content={props.selection}
                selected={props.selected}
                pagescroll={props.pagescroll}
              />
            </>
          )}
          {props.prescription && (
            <>
              <Prescription
                selectstate={props.selectstate}
                searchstate={props.searchstate}
                content={props.prescription}
                selected={props.selected}
                isDrug={props.isDrug}
                isPrescription={props.isPrescription}
                pagescroll={props.pagescroll}
              />
              {props.noteSet && (
                <div className={classes.input}>
                  <label htmlFor='note'>Add Note</label>
                  <input
                    type='text'
                    id='note'
                    onChange={e => {
                      props.noteSet(e.target.value);
                    }}
                  />
                </div>
              )}
            </>
          )}
          {props.formInput && (
            <>
              <FormInput
                title={props.title}
                rawData={props.rawData}
                selectstate={props.selectstate}
                reportFile={props.reportFile}
                setReportFile={props.setReportFile}
              />
            </>
          )}
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
