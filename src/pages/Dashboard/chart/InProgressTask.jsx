import { SmallDashOutlined } from "@ant-design/icons";
import { Card, Space, Progress, Typography, Button, Dropdown } from "antd";
import React from "react";
import { getItem } from "../../../services";

const InProgressTask = ({ inProgressTask, downloadGraph }) => {
  return (
    <>
      <Card
        id="in-progress-task"
        title="In Progress Tasks"
        extra={
          <Space>
            <Dropdown
              menu={{
                items: [
                  getItem(
                    "3",
                    <Button
                      type="button"
                      onClick={() => {
                        downloadGraph("in-progress-task");
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
        style={{ minWidth: "10vw" }}
      >
        {inProgressTask?.map((data, index) => (
          <div key={index}>
            <Typography.Paragraph
              ellipsis={{ rows: 1, expandable: false, symbol: "more" }}
              style={{ margin: "0.1px" }}
            >
              {data.task_name}
            </Typography.Paragraph>
            <Progress percent={parseInt(data.percentage)} size={[, 8]} />
          </div>
        ))}
      </Card>
    </>
  );
};

export default InProgressTask;
