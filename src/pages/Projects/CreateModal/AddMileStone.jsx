import { Form, Input, Modal, message } from "antd";
import { PROJECT_FORM } from "../../../constants";
import { useState } from "react";
import { createMilestone } from "../project.service";


const AddMileStone = ({ addMileStone, setAddMileStone, project_id, fetch }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        await form.validateFields()
        const payload = {
            milestone_name: form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME),
        }
        setLoading(true)
        createMilestone(project_id, payload).then((data) => {
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
        setAddMileStone(false);
    }
    return (
        <Modal
            title="Add Milestone"
            open={addMileStone}
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
                    name={PROJECT_FORM.MILESTONE_NAME.NAME}
                    label={PROJECT_FORM.MILESTONE_NAME.LABEL}
                    rules={[
                        {
                            required: true,
                            message: PROJECT_FORM.MILESTONE_NAME.ERROR_MESSAGE,
                        },
                    ]}
                >
                    <Input placeholder={PROJECT_FORM.MILESTONE_NAME.PLACEHOLDER} maxLength={PROJECT_FORM.MILESTONE_NAME.MAX}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default AddMileStone;