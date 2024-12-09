import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { PROJECT_FORM } from "../../../constants";
import { updateMilestoneWithPercentage } from "../project.service";


const UpdateMileStoneWithPercentage = ({ editMileStoneWithPercentage, setEditMileStoneWithPercentage, project_id, fetch, milestone_name, project_milestone_id, percentage }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            [PROJECT_FORM.MILESTONE_NAME.NAME]: milestone_name,
            [PROJECT_FORM.MILESTONE_PERCENTAGE.NAME]: percentage,
        });
    }, [])

    const handleOk = async () => {
        if ((milestone_name === form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME)) && (percentage === form.getFieldValue(PROJECT_FORM.MILESTONE_PERCENTAGE.NAME))) {
            return handleClose()
        }
        await form.validateFields()
        const payload = {
            milestone_name: form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME),
            percentage: form.getFieldValue(PROJECT_FORM.MILESTONE_PERCENTAGE.NAME),
            project_milestone_id
        }
        setLoading(true)
        updateMilestoneWithPercentage(project_id, payload).then((data) => {
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
        setEditMileStoneWithPercentage(false);
    }
    return (
        <Modal
            title="Edit Milestone"
            open={editMileStoneWithPercentage}
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
                <Form.Item name={PROJECT_FORM.MILESTONE_PERCENTAGE.NAME}
                    label={PROJECT_FORM.MILESTONE_PERCENTAGE.LABEL}
                    rules={[
                        {
                            required: true,
                            message: PROJECT_FORM.MILESTONE_PERCENTAGE.ERROR_MESSAGE,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || parseFloat(value) >= 1) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("percentage should be greater than 0"));
                            },
                        }),
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || parseFloat(value) <= 100) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("percentage should be less than 100"));
                            },
                        }),
                    ]}
                >
                    <Input type='number' placeholder={PROJECT_FORM.MILESTONE_PERCENTAGE.PLACEHOLDER} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default UpdateMileStoneWithPercentage;