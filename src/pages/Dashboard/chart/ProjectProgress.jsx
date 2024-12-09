import { SmallDashOutlined } from "@ant-design/icons";
import { Card, Space, Progress, Button, Dropdown } from "antd";
import React from "react";
import { getItem } from "../../../services";

const ProjectProgress = ({ projectProgress, downloadGraph }) => {
  return (
    <Card
      id="project-progress"
      title="Project Progress"
      extra={
        <Space>
          <Dropdown
            menu={{
              items: [
                getItem(
                  "3",
                  <Button
                    type="button"
                    onClick={(e) => {
                      downloadGraph("project-progress");
                    }}
                  >
                    Download
                  </Button>
                ),
              ],
            }}
            placement="bottom"
            trigger={"click"}
          >
            <Button
              type="text"
              style={{
                float: "right",
              }}
            >
              <SmallDashOutlined />
            </Button>
          </Dropdown>
        </Space>
      }
      bordered={true}
    >
      {projectProgress?.map((data, index) => (
        <div key={index}>
          <p style={{ margin: "5.5px" }}>{data.project_name}</p>
          <Progress percent={parseInt(data.project_percentage)} size={[, 15]} />
        </div>
      ))}
    </Card>
  );
};

export default ProjectProgress;
