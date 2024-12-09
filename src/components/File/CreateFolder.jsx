import { Button, Input, Modal, Popconfirm, Space, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { getFoldercreate } from "../common/service";

const CreateFolder = ({ visible, onCancel, project,updateFilesList  }) => {
  const [folderName, setFolderName] = useState('');
  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        getFoldercreate({ folder_name: values.name, project_id: project?.project_id })
          .then(response => {
            if (response.message === "Folder Created successfully.") {
              updateFilesList(); 
              setFolderName('');
              form.resetFields();
              onCancel();
            } else {
              message.error("Failed to create folder");
            }
          })
          .catch(error => {
            message.error("API Error:", error);
          });
      })
      .catch(errorInfo => {
        message.error("Form validation error:", errorInfo);
      });
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };
  return (
    <>
      <Modal
        title="Create Folder"
        open={visible}
        closeIcon={null}
        closable={onCancel}
        width={400}
        footer={[
          <Popconfirm
            title="Are you sure?"
            description="changes will not be saved"
            onConfirm={onCancel}
            onCancel={() => {
              return 0;
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type={"default"}>
              Cancel
            </Button>
          </Popconfirm>,
          <Button
            // style={{ width: "48.5%" }}
            htmlType="submit"
            type="primary"
            onClick={handleOk}
          // loading={loading}
          >
            {"Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: "Folder Name required",
              },
            ]}
          >
            <Input
              placeholder="Folder Name"
              style={{
                width: "100%",
              }}
              maxLength={30}
              value={folderName}
              onChange={handleFolderNameChange}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateFolder;
