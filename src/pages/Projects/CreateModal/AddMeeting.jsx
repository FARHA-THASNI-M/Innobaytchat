import { Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker, message } from "antd";
import { DATE_FORMAT, DAYS_OF_WEEK, PROJECT_FORM, PROJECT_MEETING_FORM, TIME_FORMAT } from "../../../constants";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import moment from "moment";
import { createPhase, createProjectMeeting } from "../project.service";
import { getRecurrenceType } from "../../../services";
dayjs.locale("en");

const AddMeeting = ({ addMeeting, setAddMeeting, project_id, fetch }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showWeeklyOn, setShowWeeklyOn] = useState(false);
    const RECURRENCE_TYPE = getRecurrenceType();

    useEffect(() => {
        form.setFieldsValue({
            [PROJECT_MEETING_FORM.START_DATE.NAME]: dayjs(moment().format(DATE_FORMAT), DATE_FORMAT),
            [PROJECT_MEETING_FORM.END_DATE.NAME]: dayjs(moment().format(DATE_FORMAT), DATE_FORMAT),
            [PROJECT_MEETING_FORM.START_TIME.NAME]: dayjs("12:00", TIME_FORMAT),
            [PROJECT_MEETING_FORM.END_TIME.NAME]: dayjs("12:00", TIME_FORMAT),
            [PROJECT_MEETING_FORM.RECURRENCE.NAME]: RECURRENCE_TYPE[0]?.key,
            [PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME]: [],
        })
    }, [])

    const handleOk = async () => {
        await form.validateFields()
        const payload = {
            ...form.getFieldsValue(),
            [PROJECT_MEETING_FORM.START_DATE.NAME]: form.getFieldValue(PROJECT_MEETING_FORM.START_DATE.NAME).format(DATE_FORMAT),
            [PROJECT_MEETING_FORM.END_DATE.NAME]: form.getFieldValue(PROJECT_MEETING_FORM.END_DATE.NAME).format(DATE_FORMAT),
            [PROJECT_MEETING_FORM.START_TIME.NAME]: form.getFieldValue(PROJECT_MEETING_FORM.START_TIME.NAME).format(TIME_FORMAT),
            [PROJECT_MEETING_FORM.END_TIME.NAME]: form.getFieldValue(PROJECT_MEETING_FORM.END_TIME.NAME).format(TIME_FORMAT),
            [PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME]: form.getFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME)?.join(',') ? form.getFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME)?.join(',') : null
        }
        setLoading(true)
        createProjectMeeting(project_id, payload).then((data) => {
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
        setAddMeeting(false);
    }

    const handleRecurrenceChange = (e) => {
        if (e === RECURRENCE_TYPE[2]?.key) {
            setShowWeeklyOn(true)
        } else {
            setShowWeeklyOn(false)
        }
    }


    const onWeeklyCheckChange = (e, value) => {
        if (e.target.checked) {
            form.setFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME, [...form.getFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME), value])
        } else {
            form.setFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME, [...form.getFieldValue(PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME).filter((item) => item !== value)])
        }
    };


    return (
        <Modal
            title="Add Meeting"
            open={addMeeting}
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
                <Row>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.MEETING_NAME.NAME}
                            label={PROJECT_MEETING_FORM.MEETING_NAME.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.MEETING_NAME.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <Input placeholder={PROJECT_MEETING_FORM.MEETING_NAME.PLACEHOLDER} maxLength={PROJECT_MEETING_FORM.MEETING_NAME.MAX}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.START_DATE.NAME}
                            label={PROJECT_MEETING_FORM.START_DATE.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.START_DATE.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <DatePicker
                                // value={dayjs(start_date, DATE_FORMAT)}
                                style={{ width: "100%", minWidth: "80%" }}
                                allowClear={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.END_DATE.NAME}
                            label={PROJECT_MEETING_FORM.END_DATE.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.END_DATE.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <DatePicker
                                // value={dayjs(start_date, DATE_FORMAT)}
                                style={{ width: "100%", minWidth: "80%" }}
                                allowClear={false}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.START_TIME.NAME}
                            label={PROJECT_MEETING_FORM.START_TIME.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.START_TIME.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <TimePicker
                                // value={dayjs(start_time, TIME_FORMAT)}
                                format={TIME_FORMAT}
                                style={{ width: "100%", minWidth: "80%" }}
                                minuteStep={15}
                                allowClear={false}
                                showNow={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.END_TIME.NAME}
                            label={PROJECT_MEETING_FORM.END_TIME.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.END_TIME.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <TimePicker
                                // value={dayjs(start_time, TIME_FORMAT)}
                                format={TIME_FORMAT}
                                style={{ width: "100%", minWidth: "80%" }}
                                minuteStep={15}
                                allowClear={false}
                                showNow={false}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.RECURRENCE.NAME}
                            label={PROJECT_MEETING_FORM.RECURRENCE.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.RECURRENCE.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <Select
                                options={RECURRENCE_TYPE.map((item) => {
                                    return { value: item.key, label: item.value };
                                })}
                                onChange={(e) => handleRecurrenceChange(e)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* WEEKLY */}
                        {showWeeklyOn && (
                            <Form.Item
                                name={PROJECT_MEETING_FORM.RECURRENCE_RULE.NAME}
                                label={PROJECT_MEETING_FORM.RECURRENCE_RULE.LABEL}
                                rules={[
                                    {
                                        required: false,
                                        message: PROJECT_MEETING_FORM.RECURRENCE_RULE.ERROR_MESSAGE,
                                    },
                                ]}
                            >
                                {DAYS_OF_WEEK.map((item, index) => (
                                    <div style={{ margin: "10px 0" }} key={index}>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <div style={{ marginRight: "10px" }}>
                                                <Checkbox
                                                    onChange={(e) => onWeeklyCheckChange(e, item.value)}
                                                />
                                            </div>
                                            <div>{item.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </Form.Item>

                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name={PROJECT_MEETING_FORM.DESCRIPTION.NAME}
                            label={PROJECT_MEETING_FORM.DESCRIPTION.LABEL}
                            rules={[
                                {
                                    required: true,
                                    message: PROJECT_MEETING_FORM.DESCRIPTION.ERROR_MESSAGE,
                                },
                            ]}
                        >
                            <Input placeholder={PROJECT_MEETING_FORM.DESCRIPTION.PLACEHOLDER} maxLength={PROJECT_MEETING_FORM.DESCRIPTION.MAX}
                            />
                        </Form.Item>

                    </Col>
                </Row>





            </Form>
        </Modal>
    )
}
export default AddMeeting;