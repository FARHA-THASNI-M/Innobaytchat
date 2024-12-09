import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { PROJECT_FORM } from "../../../constants";
import { updateEmail } from "../project.service";


const UpdateEmail = ({ editEmail, setEditEmail, email, project_members_email_id, project_id, fetch }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        form.setFieldsValue({
            [PROJECT_FORM.EMAIL.NAME]: email,
        });
    }, [])

    const handleOk = async () => {
        if (email === form.getFieldValue(PROJECT_FORM.EMAIL.NAME)) {
            return handleClose()
        }
        await form.validateFields()
        const payload = {
            project_members_email_id,
            email: form.getFieldValue(PROJECT_FORM.EMAIL.NAME),
        }
        setLoading(true)
        updateEmail(project_id, payload).then((data) => {
            if (data && data.success) {
                fetch()
                handleClose()
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }
    const handleClose = () => {
        form.resetFields();
        setEditEmail(false);
    }
    return (
        <Modal
            title="Update Email"
            open={editEmail}
            onCancel={handleClose}
            onOk={handleOk}
            okText="Update"
            cancelText="Cancel"
            confirmLoading={loading}
            cancelButtonProps={{ disabled: loading }}
            closeIcon={false}
        >
            <Form
                form={form}
                layout="vertical"
                disabled={loading}
            >
                <Form.Item
                    name={PROJECT_FORM.EMAIL.NAME}
                    label={PROJECT_FORM.EMAIL.LABEL}
                    rules={[
                        {
                            required: true,
                            message: PROJECT_FORM.EMAIL.ERROR_MESSAGE,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || PROJECT_FORM.EMAIL.REGEX.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("invalid email format"));
                            },
                        })
                    ]}
                >
                    <Input placeholder={PROJECT_FORM.EMAIL.PLACEHOLDER} maxLength={PROJECT_FORM.EMAIL.MAX}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default UpdateEmail;