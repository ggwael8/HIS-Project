import { useState } from 'react';
import classes from './Cards.module.css';
import Dropzone from 'react-dropzone';

function Cards(props) {
  return (
    <div className={classes.Cards}>
      {console.log(props.reportFile)}
      {/* {props.reportFileBool && (
        <div className={classes.Card}>
          <div className={classes.CardTitle}>
            <h2>Report File</h2>
          </div>
          <div className={classes.CardContent}>
            <h3>
              <Dropzone
                onDrop={acceptedFiles => {
                  props.setReportFile(acceptedFiles[0]);
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
                    {props.reportFile ? (
                      <p>{props.reportFile.name}</p>
                    ) : (
                      <p>Drag Or Click To Add File</p>
                    )}
                  </div>
                )}
              </Dropzone>
            </h3>
          </div>
        </div>
      )} */}
      {props.Cards.map((card, cardIndex) => {
        return (
          <div className={classes.Card}>
            <div className={classes.CardTitle}>
              <h2>{props.title + ' ' + (cardIndex + 1)}</h2>
            </div>
            <div className={classes.CardContent}>
              {Object.keys(card)
                .filter(info => info !== 'button')
                .map(info =>
                  info === 'image' ? (
                    card[info].map((image, index) => {
                      return (
                        <div className={classes.custom}>
                          {console.log(image)}
                          <div className={classes.customContent}>
                            <h4>image {index + 1}</h4>
                            <h2>
                              comment : <span>{image.comment}</span>
                            </h2>
                          </div>
                          <div className={classes.customButton}>
                            <button
                              className={`${classes.Button} ${classes.ButtonGreen}`}
                              onClick={() => {
                                image.button.setStates();
                              }}
                            >
                              {image.button.title}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h3>
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
                      console.log(props.reportFile);
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
              {/* {props.commentvalue && (
                <input
                  className={classes.Input}
                  placeholder={'Add Comment'}
                  onChange={e => {
                    const newComments = [...props.commentvalue];
                    newComments[cardIndex] = e.target.value;
                    props.commentset(newComments);
                  }}
                  value={props.commentvalue[cardIndex]}
                />
              )} */}
              {props.files && (
                <>
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
                    <button
                      className={`${classes.Button} ${classes.ButtonYellow}`}
                      onClick={() => {
                        card[info].setStates();
                      }}
                    >
                      {card[info].title}
                    </button>
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
