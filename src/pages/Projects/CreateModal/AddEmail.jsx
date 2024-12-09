import { Avatar, Form, Input, Modal, Select, Space, Tag, message } from "antd";
import { PROJECT_FORM } from "../../../constants";
import { useEffect, useState } from "react";
import { createEmail } from "../project.service";
import { getUsersEmailDropDown } from "../../../services";


const AddEmail = ({ addEmail, setAddEmail, project_id, fetch, existEmail }) => {
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState([]);
  const [loading, setLoading] = useState(false);

  const usersEmailListing = async () => {
      const userEmails = await getUsersEmailDropDown();
      console.log(userEmails);
      let emailsToRemove = new Set(existEmail?.map((item) => item.email));

        let filteredObject1 = userEmails?.filter(
          (item) => !emailsToRemove.has(item.value)
        );
    setUserEmail(filteredObject1);
  };
  useEffect(() => {
    console.log(existEmail, "existEmail");
    usersEmailListing();
  }, []);
  const handleOk = async () => {
    await form.validateFields();
    const payload = {
      email: form.getFieldValue(PROJECT_FORM.EMAIL.NAME),
    };
    setLoading(true);
    createEmail(project_id, payload)
      .then((data) => {
        if (data && data.success) {
          fetch();
          handleClose();
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
  const handleClose = () => {
    form.resetFields();
    setAddEmail(false);
  };
  return (
    <Modal
      title="Add Email"
      open={addEmail}
      onCancel={handleClose}
      onOk={handleOk}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      closeIcon={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          items: [{}],
        }}
        disabled={loading}
      >
        <Form.Item
          name={PROJECT_FORM.EMAIL.NAME}
          label={PROJECT_FORM.EMAIL.LABEL}
          rules={[
            {
              required: PROJECT_FORM.EMAIL.REQUIRED,
              message: PROJECT_FORM.EMAIL.ERROR_MESSAGE,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                // You can modify the validation logic if needed
                if (!value || PROJECT_FORM.EMAIL.REGEX.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("invalid email format"));
              },
            }),
          ]}
        >
          <Select
            mode="single"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(
                input?.toLocaleLowerCase()
              )
            }
            placeholder={PROJECT_FORM.EMAIL.PLACEHOLDER}
            maxTagCount={PROJECT_FORM.EMAIL.MAX}
            options={userEmail}
            optionRender={(option) => (
              <Space>
                <span>
                  <Space>
                    <Avatar size={20}>{option.data.avatar}</Avatar>
                    {option.data.desc}
                  </Space>
                </span>
                {option?.data?.value && (
                  <Tag
                    color="default"
                    bordered={false}
                    style={{ fontSize: "10px" }}
                  >
                    {option?.data?.value}
                  </Tag>
                )}
              </Space>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEmail;