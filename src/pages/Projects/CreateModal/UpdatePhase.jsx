import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { PROJECT_FORM } from "../../../constants";
import { updatePhase } from "../project.service";


const UpdatePhase = ({ editPhase, setEditPhase, project_id, fetch, phase, project_phases_id }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            [PROJECT_FORM.PHASE.NAME]: phase,
        });
    }, [])

    const handleOk = async () => {
        if (phase === form.getFieldValue(PROJECT_FORM.PHASE.NAME)) {
            return handleClose()
        }
        await form.validateFields()
        const payload = {
            phase_name: form.getFieldValue(PROJECT_FORM.PHASE.NAME),
            project_phases_id
        }
        setLoading(true)
        updatePhase(project_id, payload).then((data) => {
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
        setEditPhase(false);
    }
    return (
        <Modal
            title="Edit Phase"
            open={editPhase}
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
export default UpdatePhase;