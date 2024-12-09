import { useEffect, useState } from "react";
import { Layout, Card, Col, Row } from "antd";
import Tiles from "./pages/Tiles";
import ProjectStatusChart from "./chart/ProjectStatusChart";
import styles from "../../styles/_dashboard.module.css";
import TaskOverview from "./pages/TaskOverview";
import TaskTiles from "./pages/TaskTiles";
import ProjectProgress from "./chart/ProjectProgress";
import InProgressTask from "./chart/InProgressTask";
import TaskCompletionChart from "./chart/TaskCompletionChart";
import TaskStatus from "./chart/TaskStatusChart";
import { getTileData, getTaskTileData, getTaskOverviewData, getProjectProgressData, getProjectStatusData, getTaskInProgressData, getTaskCompletionData, getTaskStatusData } from "./dashboard.service";
import { currentTimestamp } from "../../components/common/service";
import html2canvas from "html2canvas";
import { getTaskStatus } from "../../services";
const { Content } = Layout;
const Dashboard = () => {
  const taskStatusList = getTaskStatus()?.map(({ key, value }) => ({ text: value, value: key }))
  const [tilesData, setTileData] = useState([
    { title: "Project Assigned", value: 0 },
    {
      title: "Projects Completed",
      value: 0,
    },
    { title: "Ongoing Projects", value: 0 },
    { title: "Projects Reopened", value: 0 },
    { title: "Projects Closed", value: 0 },
  ]);

  const [taskTileData, setTaskTileData] = useState([
    { title: "Total Tasks Assigned", value: 0, color: "#FBFCCC" },
    { title: "Tasks Progress", value: 0, color: "#E0F2FC" },
    { title: "Tasks Completed", value: 0, color: "#DCF3EB" },
    { title: "Tasks Closed", value: 0, color: "#ADB5BD" },
    { title: "Tasks Reopened", value: 0, color: "#FF9ECE" },
    { title: "Tasks To Do", value: 0, color: "#DEDFFF" },
    { title: "Tasks Delayed", value: 0, color: "#FFBBBB" },
  ]);

  const [taskOverview, setTaskOverView] = useState(null);
  const [projectProgress, setProjectProgress] = useState(null);
  const [projectStatus, setprojectStatus] = useState({
    IN_PROGRESS: 0,
    NOT_STARTED: 0,
    NOT_COMPLTED: 0,
    DELAYED: 0,
    CLOSED: 0,
    REOPEN: 0,
    ON_HOLD: 0,
    COMPLETE: 0,
  });
  const [taskInProgress, setTaskInProgress] = useState([]);
  const [taskCompletion, setTaskCompletion] = useState({});
  const [taskStatus, setTaskStatus] = useState({})
  useEffect(() => {
    fetchTileData();
    fetchTaskTileData();
    fetchTaskOverviewData();
    fetchProjectProgress();
    fetchProjectStatusData();
    fetchTaskInProgressData();
    fetchTaskCompletationData();
    fetchTaskStatusData();
  }, []);
  const fetchTileData = () => {
    getTileData()
      .then((data) => {
        if (data && data.data) {
          setTileData([
            { title: "Project Assigned", value: data.data.projectAssigned },
            {
              title: "Projects Completed",
              value: data.data.projectsCompleted,
            },
            { title: "Ongoing Projects", value: data.data.ongoingProjects },
            { title: "Projects Reopened", value: data.data.projectsReopened },
            { title: "Projects Closed", value: data.data.projectsClosed },
          ]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const fetchTaskTileData = () => {
    getTaskTileData()
      .then((data) => {
        if (data && data.data) {
          setTaskTileData([
            {
              title: "Total Tasks Assigned",
              value: data.data.totalTasksAssigned,
              color: "#FBFCCC",
            },
            {
              title: "Tasks Progress",
              value: data.data.inProgressCount,
              color: "#E0F2FC",
            },
            {
              title: "Tasks Completed",
              value: data.data.completedTaskCount,
              color: "#DCF3EB",
            },
            {
              title: "Tasks Closed",
              value: data.data.closeCount,
              color: "#ADB5BD",
            },
            {
              title: "Tasks Reopened",
              value: data.data.reopenCount,
              color: "#FF9ECE",
            },
            {
              title: "Tasks To Do",
              value: data.data.notStartedCount,
              color: "#DEDFFF",
            },
            {
              title: "Tasks Delayed",
              value: data.data.incompleteTaskCount,
              color: "#FFBBBB",
            },
          ]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const fetchTaskOverviewData = (startDate, endDate, status) => {
    getTaskOverviewData({ startDate: startDate, endDate: endDate, status })
      .then((data) => {
        if (data && data.data) {
          setTaskOverView(data.data);
        } else {
          setTaskOverView([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  const fetchProjectProgress = () => {
    getProjectProgressData().then((data) => {
      if (data && data.data) {
        setProjectProgress(data.data);
      }
    }).catch((error) => {
      console.log("error", error);
    });
  }
  const fetchProjectStatusData = () => {
    getProjectStatusData()
      .then((data) => {
        if (data && data.data) {
          setprojectStatus(data.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const fetchTaskInProgressData = () => {
    getTaskInProgressData()
      .then((data) => {
        if (data && data.data) {
          setTaskInProgress(data.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const fetchTaskCompletationData = () => {
    getTaskStatusData()
      .then((data) => {
        if (data && data.data) {
          setTaskStatus(data.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const fetchTaskStatusData = () => {
    getTaskCompletionData()
      .then((data) => {
        if (data && data.data) {
          setTaskCompletion(data.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // below function use for download chart data from extranal button
  // const downloadGraph = async (chartId) => {
  //   const charts = window.Apex._chartInstances;
  //   let chartInstance;
  //   charts.map((chart) => {
  //     if (chart.id === chartId) {
  //       chartInstance = chart;
  //     }
  //   });

  //   if (!chartInstance) {
  //     return;
  //   }
  //   const dataURI = await chartInstance.chart.dataURI();
  //   console.log(dataURI);
  //   const base64 = dataURI.imgURI.split(",")[1];
  //   const mimeType = dataURI.imgURI.split(",")[0].split(":")[1].split(";")[0];

  //   const binary = atob(base64);
  //   const array = [];
  //   for (let i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   const blob = new Blob([new Uint8Array(array)], { type: mimeType });

  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = URL.createObjectURL(blob);
  //   downloadLink.download = `chart-${chartId}-${currentTimestamp()}.png`;

  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  // };

  const downloadCardAsImage = async (cardId) => {
    try {
      const cardElement = document.getElementById(cardId);
      if (!cardElement) {
        console.error(`Element with id ${cardId} not found.`);
        return;
      }

      const canvas = await html2canvas(cardElement);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `chart-${cardId}-${currentTimestamp()}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the card as an image:", error);
    }
  };
  const DatePickerChange = (startDate, endDate, status = null) => {
    fetchTaskOverviewData(startDate, endDate, status);
  }
  return (
    <div style={{ height: "75vh" }}>
      <Content className={styles.dashboard}>
        <TaskOverview taskOverview={taskOverview} DatePickerChange={DatePickerChange} taskStatusList={taskStatusList}/>
        <br />
        <Tiles tileData={tilesData} />
        <Card>
          <TaskTiles tileData={taskTileData} />
        </Card>
        <br />
        <Row gutter={16} style={{ display: "flex", flexWrap: "wrap" }}>
          <Col span={8}>
            <ProjectProgress
              projectProgress={projectProgress}
              downloadGraph={downloadCardAsImage}
            />
          </Col>
          <Col span={8}>
            <ProjectStatusChart
              projectStatus={projectStatus}
              downloadGraph={downloadCardAsImage}
            />
          </Col>
          <Col span={8}>
            <InProgressTask
              inProgressTask={taskInProgress}
              downloadGraph={downloadCardAsImage}
            />
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={14}>
            <TaskCompletionChart
              taskCompletion={taskCompletion}
              downloadGraph={downloadCardAsImage}
            />
          </Col>
          <Col span={10}>
            <TaskStatus
              taskStatus={taskStatus}
              downloadGraph={downloadCardAsImage}
            />
          </Col>
        </Row>
        <br />
      </Content>
    </div>
  );
};

export default Dashboard;
