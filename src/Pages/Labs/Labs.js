import classes from './Labs.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { useState, useContext, useEffect, useRef } from 'react';
import UserContext from '../../context/user-context';
import { apiUrl } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines,
  faFileCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone';
function Labs() {
  let popUpRef = useRef();
  let containerRef = useRef();
  const userctx = useContext(UserContext);

  const [openWindow, setOpenWindow] = useState(1);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const [examsListId, setExamsListId] = useState(null);
  const [examsList, setExamsList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [defaultExamList, setDefaultExamList] = useState(null);
  const [files, setFiles] = useState(examsList.map(() => null));
  const [comments, setComments] = useState(examsList.map(() => ''));
  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      fetch(
        apiUrl +
          `lab-radiology/exam-request/?status=&patient=&doctor=&exams__type=${
            userctx.role === 'lab' ? 'Laboratory' : 'Radiology'
          }`
      ),
    ]);
    const requestList = await response[0].json();
    setData(
      requestList.results.map(info => {
        return {
          id: <span>{info.id}</span>,
          date: <span>{info.appointment.date}</span>,
          status: <span>{info.status}</span>,
          patientName: (
            <span>
              {info.patient.first_name} {info.patient.last_name}
            </span>
          ),
          doctorName: (
            <span>
              {info.doctor.first_name} {info.doctor.last_name}
            </span>
          ),
          button: [
            {
              title: 'View Exams',
              setStates: () => {
                setExamsListId(info.id);
                setSelectedStatus(info.status);
              },
            },
          ],
        };
      })
    );
    if (examsListId !== null) {
      setExamsList(
        requestList.results
          .filter(info => info.id === examsListId)[0]
          .exams.map(info => {
            return { name: info.name, code: info.code };
          })
      );
      setDefaultExamList(
        requestList.results.filter(info => info.id === examsListId)[0]
      );
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHandler();
  }, [examsListId]);

  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faFileCircleQuestion}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faFileLines}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
  ];
  useEffect(() => {
    let SetPopUpFalse = e => {
      if (
        examsListId !== null &&
        containerRef.current.contains(e.target) &&
        !popUpRef.current.contains(e.target)
      ) {
        setExamsListId(null);
      }
    };
    document.addEventListener('click', SetPopUpFalse);
    return () => {
      document.removeEventListener('click', SetPopUpFalse);
    };
  });
  useEffect(() => {
    setFiles(examsList.map(() => null));
    setComments(examsList.map(() => ''));
  }, [examsList]);

  return (
    <div className={classes.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      <DetailsBody
        toggleFilter={toggleFilter}
        setToggleFilter={setToggleFilter}
        details={data}
        title={
          openWindow === 1 ? 'Requests' : openWindow === 2 && 'All Results'
        }
      />
      {examsListId !== null && (
        <div className={classes.popUp} ref={containerRef}>
          <div className={classes.popUpGreyBox} ref={popUpRef}>
            <div className={classes.popUpContent}>
              {loading ? (
                <div>loading</div>
              ) : (
                <>
                  {examsList?.map((exam, index) => {
                    return (
                      <div className={classes.examCard}>
                        <h2>exam {index + 1}</h2>
                        <div className={classes.examCardContent}>
                          <h3>
                            name : <span>{exam.name}</span>
                          </h3>
                          <h3>
                            code : <span>{exam.code}</span>
                          </h3>
                          <h3
                            style={{
                              display:
                                selectedStatus === 'Pending'
                                  ? 'inlineBlock'
                                  : 'none',
                            }}
                          >
                            <input
                              className={classes.Input}
                              placeholder={'Add Comment'}
                              onChange={e => {
                                const newComments = [...files];
                                newComments[index] = e.target.value;
                                setComments(newComments);
                                console.log(comments);
                              }}
                              value={comments[index]}
                            />
                          </h3>
                          <h3
                            style={{
                              display:
                                selectedStatus === 'Pending'
                                  ? 'inlineBlock'
                                  : 'none',
                            }}
                          >
                            <Dropzone
                              onDrop={acceptedFiles => {
                                const newFiles = [...files];
                                newFiles[index] = acceptedFiles[0];
                                setFiles(newFiles);
                              }}
                            >
                              {({
                                getRootProps,
                                getInputProps,
                                isDragActive,
                              }) => (
                                <div
                                  {...getRootProps()}
                                  className={`dropzone ${
                                    isDragActive ? 'active' : ''
                                  }`}
                                >
                                  <input {...getInputProps()} />
                                  {files[index] ? (
                                    <p>{files[index].name}</p>
                                  ) : (
                                    <p>Upload Image</p>
                                  )}
                                </div>
                              )}
                            </Dropzone>
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                  <h3>
                    <button
                      className={`${classes.Button} ${classes.ButtonYellow}`}
                      onClick={async () => {
                        const response = await fetch(
                          apiUrl + `lab-radiology/exam-request/${examsListId}/`,
                          {
                            method: 'PUT',
                            body: JSON.stringify({
                              ...defaultExamList,
                              status: 'Pending',
                              appointment: defaultExamList.appointment.id,
                              doctor: defaultExamList.doctor.id,
                              patient: defaultExamList.patient.id,
                              exams: defaultExamList.exams.map(info => {
                                return info.id;
                              }),
                            }),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          }
                        );
                        const data = await response.json();
                        console.log(data);
                      }}
                      style={{
                        display:
                          selectedStatus === 'Requested'
                            ? 'inlineBlock'
                            : 'none',
                      }}
                    >
                      Send To Waiting List
                    </button>
                    //todo: i'm here
                    <button
                      className={`${classes.Button} ${classes.ButtonYellow}`}
                      onClick={async () => {
                        const response = await fetch(
                          apiUrl + `lab-radiology/test-result/${examsListId}/`,
                          {
                            method: 'PUT',
                            body: JSON.stringify({}),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          }
                        );
                        const data = await response.json();
                        console.log(data);
                      }}
                      style={{
                        display:
                          selectedStatus === 'Pending' ? 'inlineBlock' : 'none',
                      }}
                    >
                      Confirm
                    </button>
                  </h3>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Labs;
