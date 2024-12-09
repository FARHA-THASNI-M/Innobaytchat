import {
  Spin,
  message
} from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { taskDetails } from "../../pages/Task/task.service";
import { getPriority, getProjectCategoriesData, getTaskStatus } from "../../services";
import ViewTask from "./ViewTask";

const Task = () => {

  const { state } = useLocation();
  const [project, setProject] = useState(state?.project)
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(false);
  const [phases, setPhases] = useState([]);
  const [projectUsers, setProjectUsers] = useState([])
  const [categories, setCategories] = useState([]);
  const priorityList = getPriority();
  const taskStatusList = getTaskStatus();

  useEffect(() => {
    getTask()
    getUsers()
    getProjectCategoryList()
    getPhases()
  }, [task])


  const getTask = () => {
    setLoading(true)
    taskDetails(state?.task_id).then((data) => {
      if (data && data.success) {
        setTask(data.data)
      } else {
        message.error(data?.message ? data.message : "failed");
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setLoading(false)
    })
  }

  const getUsers = async () => {
    const users = await getProjectUsersData(project.project_id)
    setProjectUsers(users)
  }

  const getProjectCategoryList = async () => {
    const data = await getProjectCategoriesData(project.project_id)
    setCategories(data)
  }

  const getPhases = async () => {
    const data = await getProjectPhaseData(project.project_id)
    setPhases(data)
  }

  const refetchData = () => {

  }

  return (
    <>
      <Spin spinning={loading}>
        <ViewTask
          project={project} task={task} projectUsers={projectUsers} categories={categories} priorityList={priorityList} phases={phases} taskStatusList={taskStatusList} fetch={refetchData} isModal={false}
        ></ViewTask>
      </Spin>
    </>
  );
};

export default Task;
