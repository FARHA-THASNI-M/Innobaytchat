import { Empty, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ViewTask from "../../components/Task/ViewTask";
import {
  getPriority,
  getProjectCategoriesData,
  getProjectPhaseData,
  getProjectUsersData,
  getTaskStatus,
} from "../../services";
import { taskDetails } from "./task.service";

const TaskDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [project, setProject] = useState(state?.project);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(false);
  const [phases, setPhases] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breadCrumbItem, setBreadCrumbItem] = useState([]);
  const priorityList = getPriority();
  const taskStatusList = getTaskStatus();

  useEffect(() => {
    getTask();
    getUsers();
    getProjectCategoryList();
    getPhases();
  }, []);
  console.log(project, "------project", state);
  const getTask = () => {
    setLoading(true);
    taskDetails(state?.task_id)
      .then((data) => {
        if (data && data.success) {
          setTask(data.data);
        } else {
          message.error(data?.message ? data.message : "failed");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUsers = async () => {
    const users = await getProjectUsersData(project.project_id);
    setProjectUsers(users);
  };

  const getProjectCategoryList = async () => {
    const data = await getProjectCategoriesData(project.project_id);
    setCategories(data);
  };

  const getPhases = async () => {
    const data = await getProjectPhaseData(project.project_id);
    setPhases(data);
  };

  const refetchData = () => { };

  return (
    <div style={{ maxHeight: "75vh", overflow: "hidden scroll" }}>
      <Spin spinning={loading}>
        {task ? (
          <ViewTask
            project={project}
            task={task}
            projectUsers={projectUsers}
            categories={categories}
            priorityList={priorityList}
            phases={phases}
            taskStatusList={taskStatusList}
            fetch={refetchData}
            isModal={false}
            isSubtask={state?.isSubtask || false}
          ></ViewTask>
        ) : (
          <Empty />
        )}
      </Spin>
    </div>
  );
};

export default TaskDetails;
