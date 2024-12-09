import { Empty, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ViewViolation from "../../components/Violation/ViewViolation";
import { ROUTES } from "../../constants";
import { violationDetails } from "./task.service";

const ViolationDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [project, setProject] = useState(state?.project);
    const [loading, setLoading] = useState(false);
    const [violation, setViolation] = useState(false);

    useEffect(() => {
        getViolation();
    }, []);

    const getViolation = () => {
        setLoading(true);
        violationDetails(state?.violation_id)
            .then((data) => {
                if (data && data.success) {
                    setViolation(data.data);
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

    const refetchData = () => {
        navigate(ROUTES.PROJECTS.PATH);
    };

    return (
        <div style={{ maxHeight: "75vh", overflow: "hidden scroll" }}>
            <Spin spinning={loading}>
                {violation ? (
                    <ViewViolation
                        project={project}
                        violation={violation}
                        fetchData={refetchData}
                    />
                ) : (
                    <Empty />
                )}
            </Spin>
        </div>
    );
};

export default ViolationDetails;
