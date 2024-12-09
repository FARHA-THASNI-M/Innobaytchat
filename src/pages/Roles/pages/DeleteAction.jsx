import React, { useState } from "react";
import { Space, Button, message, Row, Col, Popover } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin2Line } from "react-icons/ri";

const DeleteAction = ({ record, deleteRole, roleList }) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <Space size="middle">
      <Popover
        content={
          <Row>
            <Col span={4}>
              <Button onClick={hide}>Cancel</Button>
            </Col>
            <Col span={4} offset={8}>
              <Button
                onClick={() => {
                  deleteRole(record.role_id)
                    .then((data) => {
                      if (data && data.success) {
                        message?.success(
                          data.message ? data.message : "success"
                        );
                        roleList();
                      } else {
                        console.log(data);
                        message?.error(data?.message ? data.message : "failed");
                      }
                    })
                    .catch((error) => {
                      console.log("erro", error);
                      message?.error(error.message ? error.message : "failed");
                    })
                    .finally(() => {
                      hide();
                    });
                }}
                type="primary"
                danger
              >
                Yes
              </Button>
            </Col>
          </Row>
        }
        title={`Are you sure  want to ${record.is_deleted ? "Activate" : "Deactivate"
          }?`}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button shape="circle" danger>
          {record.is_deleted ? <RiDeleteBin2Line /> : <DeleteOutlined />}
        </Button>
      </Popover>
    </Space>
  );
};

export default DeleteAction;
