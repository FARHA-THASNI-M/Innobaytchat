import { Form, Input, Modal, message } from "antd";
import { PROJECT_FORM } from "../../../constants";
import { useState } from "react";
import { createMilestoneWithPercentage } from "../project.service";


const AddMileStoneWithPercentage = ({ addMileStoneWithPercentage, setAddMileStoneWithPercentage, project_id, fetch }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        await form.validateFields()
        const payload = {
            milestone_name: form.getFieldValue(PROJECT_FORM.MILESTONE_NAME.NAME),
            percentage: form.getFieldValue(PROJECT_FORM.MILESTONE_PERCENTAGE.NAME)
        }
        setLoading(true)
        createMilestoneWithPercentage(project_id, payload).then((data) => {
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
        setAddMileStoneWithPercentage(false);
    }
    return (
        <Modal
            title="Add Milestone"
            open={addMileStoneWithPercentage}
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
export default AddMileStoneWithPercentage;