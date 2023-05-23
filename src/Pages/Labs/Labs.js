import classes from './Labs.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import PopUp from '../../component/PopUp/PopUp';
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
  const [requestData, setRequestData] = useState([]);
  const [allResultData, setAllResultData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  /* used for exam list popup */
  const [selectedExamsListId, setSelectedExamsListId] = useState(null);
  const [examsList, setExamsList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [defaultExamList, setDefaultExamList] = useState(null);
  const [files, setFiles] = useState(examsList.map(() => null));
  const [comments, setComments] = useState(examsList.map(() => ''));
  //report file for radiology
  const [reportFile, setReportFile] = useState(null);
  //filescount for radiology (multiple images)
  const [filesCount, setFilesCount] = useState(examsList.map(() => null));
  /*  */

  const [selectedRequestIdResult, setSelectedRequestIdResult] = useState(null);
  const [examsListResult, setExamsListResult] = useState([]);

  async function fetchDataHandler() {
    setIsLoading(true);

    const response = await Promise.all([
      openWindow === 1 &&
        fetch(
          // apiUrl +
          //   `lab-radiology/exam-request/?status=&patient=&doctor=&type_of_request=${
          //     userctx.role === 'lab' ? 'Laboratory' : 'Radiology'
          //   }`
          apiUrl + `lab-radiology/exam-request/`
        ),
      openWindow === 2 &&
        fetch(
          apiUrl +
            `${
              userctx.role === 'lab'
                ? 'lab-radiology/view-test-resutls/'
                : 'lab-radiology/view-radiology-request/'
            }`
        ),
    ]);
    if (openWindow === 1) {
      const requestList = await response[0].json();
      setRequestData(
        requestList.results
          .filter(
            info =>
              info.status === 'Waiting for result' || info.status === 'Pending'
          )
          .map(info => {
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
                  title:
                    info.status === 'Pending'
                      ? 'View Exams'
                      : info === 'Waiting for result' && 'Set Result',
                  setStates: () => {
                    setSelectedExamsListId(info.id);
                    setSelectedStatus(info.status);
                  },
                },
              ],
            };
          })
      );
      if (selectedExamsListId !== null) {
        setExamsList(
          requestList.results
            .filter(info => info.id === selectedExamsListId)[0]
            .exams.map(info => {
              return { id: info.id, name: info.name, code: info.code };
            })
        );
        setDefaultExamList(
          requestList.results.filter(info => info.id === selectedExamsListId)[0]
        );
      }
    } else {
      const resultList = await response[1].json();
      setAllResultData(
        resultList.results.map(info => {
          return {
            id: <span>{info.id}</span>,
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
                title: 'View Request Details',
                setStates: () => {
                  setSelectedRequestIdResult(info.id);
                },
              },
            ],
          };
        })
      );
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'lab') {
          setExamsListResult(
            resultList.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .Lab_request.map(info => {
                return {
                  id: <span>{info.exam.id}</span>,
                  name: <span>{info.exam.name}</span>,
                  code: <span>{info.exam.code}</span>,
                  price: <span>{info.exam.price}</span>,
                  date: (
                    <span>{info.dateTime.toString().substring(0, 10)}</span>
                  ),
                  time: (
                    <span>{info.dateTime.toString().substring(11, 16)}</span>
                  ),
                  comment: <span>{info.comment}</span>,
                  button: {
                    title: 'Download Result',
                    setStates: () => {
                      /* //todo: add download function */
                      return info.pdf_result;
                    },
                  },
                };
              })
          );
        } else {
          setExamsListResult(
            resultList.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .radiolgy_request.map(info => {
                return {
                  id: <span>{info.exam.id}</span>,
                  name: <span>{info.exam.name}</span>,
                  code: <span>{info.exam.code}</span>,
                  price: <span>{info.exam.price}</span>,
                  image: info.radiology_result.map(info => {
                    return {
                      comment: <span>{info.comment}</span>,
                      button: {
                        title: 'View Image',
                        setStates: () => {
                          return info.image;
                        },
                      },
                    };
                  }),
                  button: {
                    title: 'View Report',
                    setStates: () => {
                      return info.report_file;
                    },
                  },
                };
              })
          );
          // console.log(
          //   resultList.results
          //     .filter(info => info.id === selectedRequestIdResult)[0]
          //     .Lab_request.map(info => {
          //       return {
          //         id: <span>{info.exam.id}</span>,
          //         name: <span>{info.exam.name}</span>,
          //         code: <span>{info.exam.code}</span>,
          //         price: <span>{info.exam.price}</span>,
          //         date: (
          //           <span>{info.dateTime.toString().substring(0, 10)}</span>
          //         ),
          //         time: (
          //           <span>{info.dateTime.toString().substring(11, 16)}</span>
          //         ),
          //         comment: <span>{info.comment}</span>,
          //         button: {
          //           title: 'Download Result',
          //           setStates: () => {
          //             /* //todo: add download function */
          //             console.log('download ' + info.pdf_result);
          //           },
          //         },
          //       };
          //     })
          // );
        }
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHandler();
  }, [selectedExamsListId, selectedRequestIdResult, openWindow]);

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
      id: 2,
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
    setFiles(examsList.map(() => []));
    setComments(examsList.map(() => []));
    userctx.role !== 'lab' && setReportFile(examsList.map(() => null));
    setFilesCount(examsList.map(() => 1));
  }, [examsList]);

  const EditExamStatus = async () => {
    const response = await fetch(
      apiUrl + `lab-radiology/exam-request/${selectedExamsListId}/`,
      {
        method: 'PUT',
        body: JSON.stringify({
          ...defaultExamList,
          status:
            selectedStatus === 'Pending'
              ? 'Waiting for result'
              : selectedStatus === 'Waiting for result' && 'Completed',
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
    setSelectedExamsListId(null);
  };
  const AddTestResult = async () => {
    for (let i = 0; i < examsList.length; i++) {
      const formData = new FormData();
      formData.append('DateTime', defaultExamList.appointment);
      userctx.role === 'lab'
        ? formData.append('pdf_result', files[i][0])
        : formData.append('report_file', reportFile[i]);
      userctx.role === 'lab' && formData.append('comment', comments[i][0]);
      formData.append('Request', defaultExamList.id);
      formData.append('exam', examsList[i].id);
      console.log(formData);
      const response = await fetch(
        apiUrl +
          `${
            userctx.role === 'lab'
              ? 'lab-radiology/test-result/'
              : 'lab-radiology/radiology-results/'
          }`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (userctx.role !== 'lab') {
        const data = await response.json();
        for (let j = 0; j < files[i].length; j++) {
          const formData = new FormData();
          formData.append('result', data.id);
          formData.append('image', files[i][j]);
          formData.append('comment', comments[i][j]);
          const response = await fetch(
            apiUrl + 'lab-radiology/radiology-result-details/',
            {
              method: 'POST',
              body: formData,
            }
          );
        }
      }

      // console.log(files[i]);
      // const data = await response.json();
      // console.log(data);
    }
    EditExamStatus();
    setSelectedExamsListId(null);
  };

  return (
    <div className={classes.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      <DetailsBody
        toggleFilter={toggleFilter}
        setToggleFilter={setToggleFilter}
        details={
          openWindow === 1 ? requestData : openWindow === 2 && allResultData
        }
        title={
          openWindow === 1 ? 'Requests' : openWindow === 2 && 'All Results'
        }
      />
      {selectedExamsListId !== null &&
        (selectedStatus === 'Pending' ? (
          <PopUp
            popUp={selectedExamsListId}
            setPopUp={setSelectedExamsListId}
            Cards={examsList}
            title={'Exam'}
            buttonFunction={EditExamStatus}
            buttonText={'Send To Waiting List'}
          />
        ) : (
          selectedStatus === 'Waiting for result' && (
            <PopUp
              popUp={selectedExamsListId}
              setPopUp={setSelectedExamsListId}
              Cards={examsList}
              title={'Exam'}
              commentvalue={comments}
              commentset={setComments}
              files={files}
              setFiles={setFiles}
              buttonFunction={AddTestResult}
              buttonText={'Confirm'}
              multiple={userctx.role === 'lab' ? false : true}
              reportFileBool={userctx.role !== 'lab' && true}
              reportFile={userctx.role !== 'lab' && reportFile}
              setReportFile={userctx.role !== 'lab' && setReportFile}
              fileTitle={userctx.role === 'lab' ? 'Result File' : 'Image'}
              filesCount={filesCount}
              setFilesCount={userctx.role !== 'lab' && setFilesCount}
            />
          )
        ))}
      {selectedRequestIdResult !== null && (
        <PopUp
          popUp={selectedRequestIdResult}
          setPopUp={setSelectedRequestIdResult}
          Cards={examsListResult}
          title={'Exam'}
        />
      )}
    </div>
  );
}
export default Labs;
