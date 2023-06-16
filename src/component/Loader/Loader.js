import classes from './Loader.module.css';
function Loader(props) {
  return (
    <div className={classes.spinner}>
      <div style={{ background: props.cl }}></div>
      <div style={{ background: props.cl }}></div>
      <div style={{ background: props.cl }}></div>
      <div style={{ background: props.cl }}></div>
    </div>
  );
}
export default Loader;
