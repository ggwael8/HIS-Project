import classes from './Cards.module.css';
import Dropzone from 'react-dropzone';

function Cards(props) {
  return (
    <div className={classes.Cards}>
      {props.Cards.map((card, cardIndex) => {
        console.log(card);
        if (card !== null && card !== undefined && card !== false)
          return (
            <div className={classes.Card}>
              {props.title && (
                <div className={classes.CardTitle}>
                  <h2>{props.title + ' ' + (cardIndex + 1)}</h2>
                </div>
              )}
              {Object.keys(card)
                .filter(info => info !== 'button')
                .map(info => {
                  return info === 'title' ? (
                    <div className={classes.CardTitle}>
                      <h2>{card[info]}</h2>
                    </div>
                  ) : null;
                })}
              <div className={classes.CardContent}>
                {Object.keys(card)
                  .filter(info => info !== 'button')
                  .map(info =>
                    info === 'title' ? (
                      <></>
                    ) : info === 'image' ? (
                      card[info].map((image, index) => {
                        return (
                          <div className={classes.custom}>
                            <div className={classes.customContent}>
                              <h4>image {index + 1}</h4>
                              <h2>
                                comment : <span>{image.comment}</span>
                              </h2>
                            </div>
                            <div className={classes.customButton}>
                              <a
                                className={`${classes.Button} ${classes.ButtonGreen}`}
                                href={image.button.setStates()}
                                target='_blank'
                                rel='noreferrer'
                              >
                                {image.button.title}
                              </a>
                            </div>
                          </div>
                        );
                      })
                    ) : info === 'card' ? (
                      <>
                        <Cards Cards={card[info]} />
                      </>
                    ) : (
                      <h3>
                        {console.log(card[info])}
                        {info} : {card[info]}
                      </h3>
                    )
                  )}
                {props.reportFileBool && (
                  <div className={classes.CardContent}>
                    <h4>Report File</h4>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        const newReportFiles = [...props.reportFile];
                        newReportFiles[cardIndex] = acceptedFiles[0];
                        props.setReportFile(newReportFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                          {...getRootProps()}
                          className={`${classes.dropzone} ${
                            isDragActive ? classes.active : ''
                          }`}
                        >
                          <input {...getInputProps()} />
                          {props.reportFile && props.reportFile[cardIndex] ? (
                            <p>{props.reportFile[cardIndex].name}</p>
                          ) : (
                            <p>Drag Or Click To Add File</p>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </div>
                )}

                {props.files && (
                  <>
                    {console.log(props)}
                    {Array.from(
                      { length: props.filesCount[cardIndex] },
                      (_, index) => {
                        return (
                          <div className={classes.CardContent}>
                            <h4>
                              {props.fileTitle} {index + 1}
                            </h4>
                            <Dropzone
                              onDrop={acceptedFiles => {
                                const newFiles = [...props.files];
                                newFiles[cardIndex][index] === null
                                  ? newFiles[cardIndex].push(acceptedFiles[0])
                                  : (newFiles[cardIndex][index] =
                                      acceptedFiles[0]);
                                props.setFiles(newFiles);
                              }}
                            >
                              {({
                                getRootProps,
                                getInputProps,
                                isDragActive,
                              }) => (
                                <div
                                  {...getRootProps()}
                                  className={`${classes.dropzone} ${
                                    isDragActive ? classes.active : ''
                                  }`}
                                >
                                  <input {...getInputProps()} />
                                  {props.files[cardIndex] &&
                                  props.files[cardIndex][index] ? (
                                    <p>{props.files[cardIndex][index].name}</p>
                                  ) : (
                                    <p>Drag Or Click To Add File</p>
                                  )}
                                </div>
                              )}
                            </Dropzone>
                            <input
                              className={classes.Input}
                              placeholder={'Add Comment'}
                              onChange={e => {
                                const newComments = [...props.commentvalue];
                                newComments[cardIndex][index] === null
                                  ? newComments[cardIndex].push(e.target.value)
                                  : (newComments[cardIndex][index] =
                                      e.target.value);
                                props.commentset(newComments);
                              }}
                              value={
                                props.commentvalue[cardIndex] &&
                                props.commentvalue[cardIndex][index]
                              }
                            />
                          </div>
                        );
                      }
                    )}
                    {props.multiple && (
                      <button
                        className={classes.Link}
                        onClick={() => {
                          const newfilesCount = [...props.filesCount];
                          newfilesCount[cardIndex] =
                            props.filesCount[cardIndex] + 1;
                          props.setFilesCount(newfilesCount);
                        }}
                      >
                        + Add More Images
                      </button>
                    )}
                  </>
                )}

                {Object.keys(card)
                  .filter(info => info === 'button')
                  .map(info => (
                    <h3>
                      <a
                        className={`${classes.Button} ${classes.ButtonYellow}`}
                        href={card[info].setStates()}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {card[info].title}
                      </a>
                    </h3>
                  ))}
              </div>
            </div>
          );
      })}
    </div>
  );
}
export default Cards;
