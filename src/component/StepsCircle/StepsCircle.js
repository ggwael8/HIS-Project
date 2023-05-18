import classes from './StepsCircle.module.css';
function StepsCircle(props) {
  return (
    <div className={classes.steps}>
      {Array.from({ length: props.stepsCount }, (_, index) => {
        return (
          <>
            <h2 className={props.selectedStep > index && classes.selected}>
              {index + 1}
            </h2>
            {index !== props.stepsCount - 1 && <span></span>}
          </>
        );
      })}
    </div>
  );
}
export default StepsCircle;
