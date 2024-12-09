import React from "react";
import { Collapse, Card, Space, Tag, Button } from "antd";
import {
  MessageFilled,
  UnorderedListOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Kanban from "../kanban/kanban";
import styled from "../../../styles/_task.module.css";
import "./tasklist.css";

const { Panel } = Collapse;

const TaskList = ({ project }) => {
  const data = [
    {
      task_name: "Preliminaries",
      total_task: "04 Task",
      status: "In Progress",
      sub_task: [
        {
          sub_task_id: 1,
          sub_task_name: "Waterproofing",
          status: "In Progress",
          total_sub_task: "05 Subtask",
        },
        {
          sub_task_id: 2,
          sub_task_name: "Excavation",
          status: "Not Started",
          total_sub_task: "03 Subtask",
        },
      ],
    },
    {
      task_name: "Furniture Installation",
      total_task: "04 Task",
      status: "In Progress",
      sub_task: [
        {
          sub_task_id: 1,
          sub_task_name: "Foundation",
          status: "Completed",
          total_sub_task: "02 Subtask",
        },
        {
          sub_task_id: 2,
          sub_task_name: "Roofing",
          status: "Not Started",
          total_sub_task: "04 Subtask",
        },
      ],
    },
  ];

  const renderSubTask = (subTask) => {
    return (
      <Collapse size="small" bordered={false} accordion>
        {subTask?.map((subtask) => (
          <Panel
            className={styled.subCollapse}
            key={subtask.sub_task_id}
            header={
              <Space>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<MessageFilled />}
                  size="small"
                ></Button>

                {subtask.sub_task_name}
                <Tag color={"#08A0F7"} style={{ borderRadius: "12px" }}>
                  {subtask.status}
                </Tag>
              </Space>
            }
          >
            <Card style={{ padding: "10px" }}>
              <Kanban />
            </Card>
          </Panel>
        ))}
      </Collapse>
    );
  };

  const renderTask = (task) => (
    <Panel
      className={styled.collapse}
      key={task.task_name}
      header={
        <Space>
          <Button
            type="primary"
            shape="circle"
            icon={<UnorderedListOutlined color={"white"} />}
            size="small"
          ></Button>

          {task.task_name}
          <Tag color={"#08A0F7"} style={{ borderRadius: "12px" }}>
            {task.status}
          </Tag>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {task.sub_task && renderSubTask(task.sub_task)}
      </Space>
    </Panel>
  );

  return (
    <Collapse size="small" bordered={false} accordion>
      {data.map(renderTask)}
    </Collapse>
  );
};

export default TaskList;
