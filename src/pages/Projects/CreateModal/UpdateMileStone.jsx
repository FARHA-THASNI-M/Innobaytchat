import { Form, Input, Modal, Popconfirm, Switch, message } from "antd";
import { PROJECT_FORM } from "../../../constants";
import { useEffect, useState } from "react";
import { updateMilestone } from "../project.service";


const UpdateMileStone = ({ editMileStone, setEditMileStone, project_id, fetch, milestone_name, milestone_status, project_milestone_id }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            [PROJECT_FORM.MILESTONE_NAME.NAME]: milestone_name,
            [PROJECT_FORM.MILESTONE_STATUS.NAME]: milestone_status,
        });
    }, [])


    const handleOk = async () => {
        if (milestone_name === form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME) && milestone_status === form.getFieldValue(PROJECT_FORM.MILESTONE_STATUS.NAME)) {
            return handleClose()
        }
        await form.validateFields()
        const payload = {
            milestone_name: form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME),
            milestone_status: form.getFieldValue(PROJECT_FORM.MILESTONE_STATUS.NAME),
            project_milestone_id
        }
        setLoading(true)
        updateMilestone(project_id, payload).then((data) => {
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
        setEditMileStone(false);
    }
    return (
        <Modal
            title="Edit Milestone"
            open={editMileStone}
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
                <Form.Item
                    name={PROJECT_FORM.MILESTONE_STATUS.NAME}
                    label={PROJECT_FORM.MILESTONE_STATUS.LABEL}
                    rules={[
                        {
                            required: true,
                            message: PROJECT_FORM.MILESTONE_STATUS.ERROR_MESSAGE,
                        },
                    ]}
                >
                    {/* <Popconfirm
                        title="Are you sure?"
                        description="changes will not be saved"
                        onConfirm={''}
                        onCancel={() => {
                            return 0;
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                    </Popconfirm> */}
                    <Switch checkedChildren="Completed" unCheckedChildren="In Progress" defaultChecked={milestone_status} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default UpdateMileStone;