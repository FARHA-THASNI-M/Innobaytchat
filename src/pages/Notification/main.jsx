import { Avatar, Button, Card, List, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { NOTIFICATION_TYPES, ROUTES } from "../../constants";
import { getProjectBasicDetails, getUserShortName } from "../../services";
import { getFormatDate } from "../../utils";
import { updateSnag, updateTask } from "../Task/task.service";
import { getNotificationList } from "./notification.service";
import { SyncOutlined } from "@ant-design/icons";

const Notification = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getNotifications(page, 25);
  }, [page]);

  const getNotifications = (page, pageSize) => {
    setLoading(true);
    getNotificationList(page, pageSize)
      .then((result) => {
        if (result.data && result.success) {
          setData((prevData) => [...prevData, ...result.data.rows]);
          setTotal(result.data.count);
        } else {
          message.error(result?.message ? result.message : "Failed to load notifications");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "Failed to load notifications");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const approveOrReject = (item, isApproved) => {
    if (item.content_type === 'task') {
      updateTaskDetails(item.task_id, { status: isApproved ? "CLOSE" : "REOPEN" });
    } else if (item.content_type === 'snag') {
      updateSnagDetails(item.task_id, { status: isApproved ? "CLOSE" : "REOPEN" });
    }
  };

  const updateTaskDetails = (task_id, payload) => {
    setLoading(true);
    updateTask(task_id, payload)
      .then((data) => {
        if (data.success) {
          refresh()
        } else {
          message.error(data?.message ? data.message : "Failed to update task");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "Failed to update task");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateSnagDetails = (snag_id, payload) => {
    setLoading(true);
    updateSnag(snag_id, payload)
      .then((data) => {
        if (data.success) {
          setData([]);
          setPage(1);
        } else {
          message.error(data?.message ? data.message : "Failed to update snag");
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "Failed to update snag");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refresh = () => {
    setPage(1);
    setData([]);
    getNotifications(1, 25);
  }

  const handleNavigation = async (item) => {
    const { type, task_id, project_id, content_type } = item;
    props.setAuthUser({ loading: true });
    const project = await getProjectBasicDetails(project_id);
    props.setAuthUser({ loading: false });
    switch (type) {
      case NOTIFICATION_TYPES.CREATE_TASK:
      case NOTIFICATION_TYPES.ASSIGN_TASK:
      case NOTIFICATION_TYPES.TASK_PRIORITY_UPDATE:
      case NOTIFICATION_TYPES.TASK_STATUS_UPDATE:
      case NOTIFICATION_TYPES.TASK_COMPLETE_STATUS_UPDATE:
        return navigate(ROUTES.TASK_DETAILS.PATH, { state: { project, task_id } });
      case NOTIFICATION_TYPES.CREATE_SNAG:
      case NOTIFICATION_TYPES.ASSIGN_SNAG:
      case NOTIFICATION_TYPES.SNAG_PRIORITY_UPDATE:
      case NOTIFICATION_TYPES.SNAG_STATUS_UPDATE:
      case NOTIFICATION_TYPES.SNAG_COMPLETE_STATUS_UPDATE:
        return navigate(ROUTES.SNAG_DETAILS.PATH, { state: { project, snag_id: task_id } });
      case NOTIFICATION_TYPES.CREATE_VIOLATION:
      case NOTIFICATION_TYPES.ASSIGN_VIOLATION:
        return navigate(ROUTES.VIOLATION_DETAILS.PATH, { state: { project, violation_id: task_id } });
      case NOTIFICATION_TYPES.MENTIONED: {
        if (content_type === 'task') {
          return navigate(ROUTES.TASK_DETAILS.PATH, { state: { project, task_id } });
        } else if (content_type === 'snag') {
          return navigate(ROUTES.SNAG_DETAILS.PATH, { state: { project, snag_id: task_id } });
        }
        break;
      }
      default:
        return;
    }
  };

  return (
    <Card title={'Notifications'} extra={<Tooltip title="Refresh"><SyncOutlined style={{ float: 'right' }} onClick={() => refresh()} /></Tooltip>}>
      <div
        id="scrollableDiv"
        style={{
          overflow: "auto",
          padding: "0 16px",
          height: "67vh",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < total}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ display: "flex", justifyContent: "center" }}>No more notifications</p>}
          scrollableTarget="scrollableDiv"
        >
          <List
            loading={loading}
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.notification_id}

                actions={
                  item.type === "TASK_COMPLETE_STATUS_UPDATE" || item.type === "SNAG_COMPLETE_STATUS_UPDATE"
                    ? [
                      <Button type="primary" danger size="small" onClick={() => approveOrReject(item, false)}>
                        Reject
                      </Button>,
                      <Button type="primary" size="small" onClick={() => approveOrReject(item, true)}>
                        Accept
                      </Button>,
                    ]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={<Avatar size={"small"}>{getUserShortName(item?.ref_notification_contextual_user?.first_name, item?.ref_notification_contextual_user?.last_name)}</Avatar>}
                  title={item?.title}
                  description={getFormatDate(item?.created_at, "DD-MM-YYYY HH:MM:SS")}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigation(item)}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </Card>
  );
};

export default Notification;
