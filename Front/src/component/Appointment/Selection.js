import classes from './Selection.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import DropDownMenu from '../DropDownMenu';
import { useState } from 'react';
function Selection(props) {
  const [dropDownMenuActive, setDropDownMenuActive] = useState(false);
  return (
    <div
      className={`${classes.selectionBody} ${
        props.selected === 0 ? classes.display : classes.displaynone
      }`}
    >
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
          next={props.next}
        />
      </div>
    </div>
  );
}
export default Selection;
