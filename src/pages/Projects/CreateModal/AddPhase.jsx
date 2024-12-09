import { Form, Input, Modal, message } from "antd";
import { PROJECT_FORM } from "../../../constants";
import { useState } from "react";
import { createPhase } from "../project.service";


const AddPhase = ({ addPhase, setAddPhase, project_id, fetch }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        await form.validateFields()
        const payload = {
            phase_name: form.getFieldValue(PROJECT_FORM.PHASE.NAME),
        }
        setLoading(true)
        createPhase(project_id, payload).then((data) => {
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
        setAddPhase(false);
    }
    return (
        <Modal
            title="Add Phase"
            open={addPhase}
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
                    name={PROJECT_FORM.PHASE.NAME}
                    label={PROJECT_FORM.PHASE.LABEL}
                    rules={[
                        {
                            required: true,
                            message: PROJECT_FORM.PHASE.ERROR_MESSAGE,
                        },
                    ]}
                >
                    <Input
                        placeholder={PROJECT_FORM.PHASE.PLACEHOLDER} maxLength={PROJECT_FORM.PHASE.MAX}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default AddPhase;