import { Empty, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ViewSnag from "../../components/Snag/ViewSnag";
import { ROUTES } from "../../constants";
import {
    getPriority,
    getProjectCategoriesData,
    getProjectPhaseData,
    getProjectUsersData,
    getTaskStatus,
} from "../../services";
import { snagDetails } from "./task.service";

const SnagDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [project, setProject] = useState(state?.project);
    const [loading, setLoading] = useState(false);
    const [snag, setSnag] = useState(false);
    const [phases, setPhases] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [breadCrumbItem, setBreadCrumbItem] = useState([]);
    const priorityList = getPriority();
    const taskStatusList = getTaskStatus();

    useEffect(() => {
        getSnag();
        getUsers();
        getProjectCategoryList();
        getPhases();
    }, []);

    const getSnag = () => {
        setLoading(true);
        snagDetails(state?.snag_id)
            .then((data) => {
                if (data && data.success) {
                    setSnag(data.data);
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

    const refetchData = () => {
        navigate(ROUTES.PROJECTS.PATH);
    };

    return (
        <div style={{ maxHeight: "75vh", overflow: "hidden scroll" }}>
            <Spin spinning={loading}>
                {snag ? (
                    <ViewSnag project={project}
                        snag={snag}
                        projectUsers={projectUsers}
                        categories={categories}
                        priorityList={priorityList}
                        taskStatusList={taskStatusList}
                        fetchData={refetchData}
                        isModal={false}
                    />
                ) : (
                    <Empty />
                )}
            </Spin>
        </div>
    );
};

export default SnagDetails;
