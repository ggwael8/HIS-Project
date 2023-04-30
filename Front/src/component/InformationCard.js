import classes from './InformationCard.module.css';
function InformationCard(props) {
  let content = [];
  let index = 0;
  for (var key in props.card) {
    if (key !== 'title')
      content[index] = (
        <h2>
          {key.toString().replace(/([A-Z])/g, ' $1')} :{' '}
          <span>{props.card[key]}</span>
        </h2>
      );
    index++;
  }
  return (
    <div className={classes.informationCard}>
      <h1 className={classes.title}>{props.card.title}</h1>
      <div className={classes.content}>{content}</div>
    </div>
  );
}

export default InformationCard;
