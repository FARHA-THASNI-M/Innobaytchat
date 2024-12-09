import { ArrowLeftOutlined, MoreOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, DatePicker, Descriptions, Dropdown, Form, Input, Modal, Row, Select, Space, Spin, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICONS, VIOLATION_FORM } from "../../constants";
import { PERMISSIONS } from "../../constants/permissions";
import { deleteViolation, downloadViolation, updateViolation } from "../../pages/Task/task.service";
import { getItem, getPermissions, getUserDetails, getUsersData, getViolationCategory, getViolationSuggestedBy, lookupFormatter } from "../../services";
import { getFormatDate } from "../../utils";
import UnAuthorizedError from "../common/error/UnAuthorizedError";
const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
}
const { confirm } = Modal;
const ViewViolation = ({ project, violation, projectUsers, fetchData, isModal = false }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const permissions = getPermissions()
    const assignedActions = getViolationSuggestedBy();
    const [isEdit] = useState(permissions.includes(PERMISSIONS.VIOLATION_UPDATE));
    const [userList, setUserList] = useState([])
    const violationCategories = lookupFormatter(getViolationCategory(), 'value', 'key')
    const initialShowEdit = {
        violation_date: false,
        location: false,
        report_number: false,
        violator_name: false,
        id_number: false,
        company_name: false,
        warning_number: false,
        action_suggested_by: false,
        description: false,
        violation_category: false
    }
    const [showEdit, setShowEdit] = useState(initialShowEdit);

    const initialData = {
        violation_date: violation?.violation_date,
        location: violation?.location,
        report_number: violation?.report_number,
        violator_name: violation?.violator_name,
        id_number: violation?.id_number,
        company_name: violation?.company_name,
        warning_number: violation?.warning_number,
        action_suggested_by: violation?.action_suggested_by,
        description: violation?.description,
    }
    const [data, setData] = useState(initialData);

    const [loading, setLoading] = useState(false)
    const [violationData, setViolationData] = useState(violation)
    const [description, setDescription] = useState(violation?.description)
    const [preparedBy, setPreparedBy] = useState()
    const [approvedBy, setApprovedBy] = useState()
    const [violationCategoryData, setViolationCategoryData] = useState(null)

    const { user } = getUserDetails()
    useEffect(() => {
        getUserList()
        setShowEdit(initialShowEdit)
        setViolationData(violation)
        setDescription(violation.description)
        getApprovedByDetails(violation)
        getPreparedByDetails(violation)
    }, [violation])


    const updateViolationHandler = (field, value) => {
        if (violationData[field] !== value) {
            updateViolationDetails({ [field]: value })
        }
        editHandler(field, false)
    }

    const getUserList = async () => {
        const users = await getUsersData()
        setUserList(users)
    }

    const updateViolationDetails = (payload) => {
        setLoading(true)
        updateViolation(violation.violation_id, payload).then((data) => {
            if (data.success) {
                setViolationData(data.data)
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const descriptionUpdate = () => {
        updateViolationHandler('description', description)
    }



    const moveToTrash = () => {
        setLoading(true)
        deleteViolation(violation.violation_id).then((data) => {
            if (data && data.success) {
                fetchData()
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        })
            .catch((error) => {
                message.error(error?.message ? error.message : "failed");
            }).finally(() => {
                setLoading(false)
            })
    }

    const downloadViolationPDF = () => {
        setLoading(true)
        downloadViolation(violation.violation_id).then((data) => {
            saveAs(data, `Violation_${Date.now()}.pdf`);
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }
    const editHandler = (field, value) => {
        if (isEdit) {
            setShowEdit((pervious) => ({ ...pervious, [field]: value }))
        }
    }

    const getApprovedByDetails = (violation) => {
        const userData = userList.filter(({ value }) => value === violation?.approved_by)[0]
        setApprovedBy(userData)
    }

    const getPreparedByDetails = (violation) => {
        const userData = userList.filter(({ value }) => value === violation?.prepared_by)[0]
        setPreparedBy(userData)
    }

    const handleInputChange = (field, value) => {
        setData((previous) => ({ ...previous, [field]: value }))
    }

    const violationCategoryModelClose = () => {
        form.resetFields();
        editHandler('violation_category', false)
    }

    const handleViolationCategoryChange = (e) => {
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null)
        switch (e) {
            case 'CATEGORY_1':
                setViolationCategoryData({ title: 'Amount', placeholder: 'Enter the amount', error: 'Please enter amount', required: true })
                break;
            case 'CATEGORY_2':
                setViolationCategoryData({ title: 'Amount', placeholder: 'Enter the amount', error: 'Please enter amount', required: true })
                break;
            case 'CATEGORY_3':
            case 'CATEGORY_4':
                setViolationCategoryData({ title: 'Days', placeholder: 'Enter no of days', error: 'Please enter days', required: true })
                break;
            case 'CATEGORY_6':
                setViolationCategoryData({ title: 'Others', placeholder: 'Enter other reason', error: 'Please enter reason', required: true })
                break;
            default:
                form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, null);
                setViolationCategoryData(null)
                return;
        }
    };


    const getViolationCategoryData = (category) => {
        const title = getViolationCategory(category)
        switch (category) {
            case 'CATEGORY_1':
            case 'CATEGORY_2':
                return (
                    <>
                        {title?.value} <b>Amount: {violationData?.violation_category_data}</b>
                    </>
                );
            case 'CATEGORY_3':
            case 'CATEGORY_4':
                return (
                    <>
                        {title?.value} <b>Days: {violationData?.violation_category_data}</b>
                    </>
                );
            case 'CATEGORY_6':
                return violationData?.violation_category_data;
            default:
                return title?.value || '-';
        }
    }

    const updateCategoryHandler = async () => {
        handleViolationCategoryChange(violationData.violation_category);
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME, violationData.violation_category_data);
        form.setFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY.NAME, violationData.violation_category);
        editHandler('violation_category', true)
    }



    return (

        <>
            {/* <Breadcrumb>
                <Breadcrumb.Item>Snag</Breadcrumb.Item>
                <Breadcrumb.Item>{violationData?.snag_number}</Breadcrumb.Item>
            </Breadcrumb> */}
            {permissions.includes(PERMISSIONS.VIOLATION_VIEW) ?
                <>
                    <Space size={3} style={{ height: '0px' }} align="baseline" wrap>
                        {!isModal && <ArrowLeftOutlined onClick={() => { navigate(ROUTES.TASK.PATH, { state: { project } }) }} />}
                        <Avatar src={ICONS.VIOLATION} size={30}></Avatar>
                        <Tag color="#E5ECF6" style={{ borderRadius: '20px', width: '80px', textAlign: 'center', color: '#00000066' }}><b>Violation</b></Tag>
                        <Tag color="#0084FF" style={{ fontSize: '10px' }}>{violationData?.violation_number}</Tag>
                    </Space>
                    <Card className="mt-5" title={<Typography.Title level={5} size={'small'} style={{ margin: '0px 12px' }}>{'Safety Violation Report'}</Typography.Title>} extra={
                        <Dropdown
                            trigger={'click'}
                            menu={{
                                items: [
                                    getItem(permissions.includes(PERMISSIONS.VIOLATION_VIEW), (
                                        <Button type="link"
                                            onClick={(e) => {
                                                downloadViolationPDF()
                                            }}
                                        >
                                            Download
                                        </Button>
                                    ), "1"),
                                    getItem(permissions.includes(PERMISSIONS.VIOLATION_DELETE), (
                                        <Button type="link" danger
                                            onClick={(e) => {
                                                moveToTrash()
                                            }}
                                        >
                                            Move to trash
                                        </Button>
                                    ), "2"),

                                ],
                            }}
                            placement="bottom"
                        >
                            <MoreOutlined />
                        </Dropdown>
                    }>
                        <Spin spinning={loading}>
                            <Row gutter={gutter}>

                                {/* Description */}
                                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }} lg={{ span: 16, order: 1 }} xl={{ span: 16, order: 1 }}>
                                    <Card title={'Description'} size="small">
                                        <div style={{ maxHeight: '65vh', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                                            {showEdit.description ?
                                                <div style={{ marginBottom: '30px' }}>
                                                    <Input.TextArea variant="borderless" defaultValue={description} value={description} style={{ resize: 'none', height: '55vh', overflow: 'hidden scroll' }} onChange={(e) => { setDescription(e?.target?.value) }}></Input.TextArea>
                                                    <div style={{ float: 'right', marginTop: '20px' }}>
                                                        <Space>
                                                            <Button onClick={() => { editHandler('description', false); setDescription(violationData?.description) }}>Cancel</Button>
                                                            <Button onClick={descriptionUpdate} type="primary">Save</Button>
                                                        </Space>
                                                    </div>
                                                </div>
                                                :
                                                <Input.TextArea variant="borderless" defaultValue={description} value={description} style={{ resize: 'none', height: '65vh', overflow: 'hidden scroll' }} onDoubleClick={() => editHandler('description', true)}></Input.TextArea>
                                                // <div style={{ minHeight: '100px', maxHeight: '500px', overflow: 'hidden scroll' }} onDoubleClick={() => editHandler('description', true)}>
                                                //     <DescriptionViewer htmlText={description} ></DescriptionViewer>
                                                // </div>
                                            }
                                        </div>
                                    </Card>
                                </Col>


                                {/* Details */}
                                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }} lg={{ span: 8, order: 2 }} xl={{ span: 8, order: 2 }}>
                                    <Card size='small' title={'Details'} bordered={false}>
                                        <div style={{ maxHeight: '65vh', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                                            <Card title='Violation Category' size="small">
                                                {/* {showEdit.violation_category ?
                                            <Select
                                                defaultOpen={true}
                                                autoFocus={true}
                                                showSearch
                                                variant="filled"
                                                options={categories.map(({ ref_category }) => ({ label: ref_category?.category_name, value: ref_category?.category_id }))}
                                                style={{ width: '100%' }}
                                                defaultValue={violationData?.project_category_id}
                                                value={violationData?.project_category_id}
                                                onChange={(e) => updateViolationHandler('project_category_id', e)}
                                                onBlur={() => editHandler('project_category_id', false)}
                                            />
                                            : <Tag bordered={false} onClick={() => editHandler('project_category_id', true)} style={{ borderRadius: '20px', fontSize: '14px' }}> {categories.filter(({ ref_category }) => ref_category.category_id == violationData?.project_category_id)[0]?.ref_category?.category_name}</Tag>
                                        } */}
                                                <Typography.Text onClick={updateCategoryHandler}>{getViolationCategoryData(violationData?.violation_category)}</Typography.Text>
                                            </Card>

                                            <Card title='Timeline' size="small" className="mt-5">
                                                <Descriptions column={1} size="small" colon={false} layout="vertical">
                                                    <Descriptions.Item label='Violation Date'>
                                                        {showEdit.violation_date ?
                                                            <DatePicker autoFocus={true} open={true} size="small" variant="borderless" allowClear={false} defaultValue={dayjs(data?.violation_date, 'YYYY-MM-DD')} value={dayjs(violationData?.violation_date, 'YYYY-MM-DD')} onChange={(date, dateString) => updateViolationHandler('violation_date', dateString)} style={{ width: '100%' }} onBlur={() => editHandler('violation_date', false)}></DatePicker>
                                                            :
                                                            <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('violation_date', true)}>{getFormatDate(violationData?.violation_date) || '-'}</Typography.Text>
                                                        }

                                                    </Descriptions.Item>
                                                    <Descriptions.Item label='Created Date'>
                                                        <Typography.Text style={{ cursor: 'not-allowed' }}>{getFormatDate(data?.created_at) || '-'}</Typography.Text>
                                                    </Descriptions.Item>


                                                    <Descriptions.Item label='Location'>

                                                        {showEdit.location ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.location} name="location" value={data?.location} style={{ width: '100%' }} onChange={(e) => handleInputChange('location', e?.target?.value)} onBlur={() => updateViolationHandler('location', data.location)}></Input>
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('location', true)}>{data?.location || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label='Report Number'>

                                                        {showEdit.report_number ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.report_number} name="report_number" value={data?.report_number} style={{ width: '100%' }} onChange={(e) => handleInputChange('report_number', e?.target?.value)} onBlur={() => updateViolationHandler('report_number', data.report_number)}></Input>
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('report_number', true)}>{data?.report_number || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>

                                            <Card size="small" className="mt-5">
                                                <Descriptions column={1} size="small" colon={false} layout="vertical">
                                                    <Descriptions.Item label='ID Number'>
                                                        {showEdit.id_number ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.id_number} value={data?.id_number} onChange={(e) => handleInputChange('id_number', e?.target?.value)} onBlur={() => updateViolationHandler('id_number', data.id_number)}></Input>
                                                            :
                                                            <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('id_number', true)}>{data?.id_number || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>


                                                    <Descriptions.Item label='Company Name'>
                                                        {showEdit.company_name ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.company_name} name="company_name" value={data?.company_name} style={{ width: '100%' }} onChange={(e) => handleInputChange('company_name', e?.target?.value)} onBlur={() => updateViolationHandler('company_name', data.company_name)}></Input>
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('company_name', true)}>{data?.company_name || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label='Name of Violator'>

                                                        {showEdit.violator_name ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.violator_name} name="violator_name" value={data?.violator_name} style={{ width: '100%' }} onChange={(e) => handleInputChange('violator_name', e?.target?.value)} onBlur={() => updateViolationHandler('violator_name', data.violator_name)}></Input>
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('violator_name', true)}>{data?.violator_name || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label='Warning Number'>

                                                        {showEdit.warning_number ?
                                                            <Input autoFocus={true} size="small" variant="filled" defaultValue={data?.warning_number} name="warning_number" value={data?.warning_number} style={{ width: '100%' }} onChange={(e) => handleInputChange('warning_number', e?.target?.value)} onBlur={() => updateViolationHandler('warning_number', data.warning_number)}></Input>
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('warning_number', true)}>{data?.warning_number || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>

                                                    <Descriptions.Item label='Action Suggested By'>

                                                        {showEdit.action_suggested_by ?
                                                            <Select
                                                                defaultOpen={true}
                                                                autoFocus={true}
                                                                options={assignedActions}
                                                                variant="filled"
                                                                style={{ width: '100%' }}
                                                                defaultValue={violationData?.action_suggested_by}
                                                                value={violationData?.action_suggested_by}
                                                                onChange={(e) => updateViolationHandler('action_suggested_by', e)}
                                                                onBlur={() => editHandler('action_suggested_by', false)}
                                                            />
                                                            : <Typography.Text style={{ cursor: 'pointer' }} onClick={() => editHandler('action_suggested_by', true)}>{violationData?.action_suggested_by || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>

                                                </Descriptions>
                                            </Card>

                                            <Card size="small" className="mt-5">
                                                <Descriptions column={1} size="small" colon={false} layout="vertical">
                                                    <Descriptions.Item label='Approved By'>

                                                        <Space style={{ cursor: 'not-allowed' }}>
                                                            {approvedBy ?
                                                                <>
                                                                    <Avatar size={'small'}>{approvedBy?.avatar}</Avatar>
                                                                    <Typography.Text>{approvedBy?.label}</Typography.Text>
                                                                </>
                                                                :
                                                                <>
                                                                    <Avatar size={'small'} icon={<UserOutlined />}></Avatar>
                                                                    <Typography.Text>{'Super Admin'}</Typography.Text> {/* Need to change */}
                                                                </>
                                                            }

                                                        </Space>
                                                    </Descriptions.Item>


                                                    <Descriptions.Item label='Prepared By'>

                                                        <Space style={{ cursor: 'not-allowed' }}>
                                                            {preparedBy ?
                                                                <>
                                                                    <Avatar size={'small'}>{preparedBy?.avatar}</Avatar>
                                                                    <Typography.Text>{preparedBy?.label}</Typography.Text>
                                                                </>
                                                                :
                                                                <>
                                                                    <Avatar size={'small'} icon={<UserOutlined />}></Avatar>
                                                                    <Typography.Text>{'Super Admin'}</Typography.Text> {/* Need to change */}
                                                                </>
                                                            }

                                                        </Space>
                                                    </Descriptions.Item>

                                                </Descriptions>
                                            </Card>

                                        </div>

                                    </Card>
                                </Col>
                            </Row>
                        </Spin>
                    </Card >
                </> : <UnAuthorizedError />}

            <Modal
                title="Update Violation Category"
                open={showEdit.violation_category}
                onCancel={violationCategoryModelClose}
                onOk={() => {
                    updateViolationDetails({ violation_category: form.getFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY.NAME), violation_category_data: form.getFieldValue(VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME) })
                    violationCategoryModelClose()
                }}
                okText="Update"
                cancelText="Cancel"
                confirmLoading={loading}
                cancelButtonProps={{ disabled: loading }}
                closeIcon={false}
                centered={true}
                maskClosable={false}

            >
                <Form form={form}
                    layout="vertical" disabled={loading} autoComplete="off">
                    <Form.Item
                        label={VIOLATION_FORM.VIOLATION_CATEGORY.LABEL}
                        name={VIOLATION_FORM.VIOLATION_CATEGORY.NAME}
                        rules={[
                            {
                                required: VIOLATION_FORM.VIOLATION_CATEGORY.REQUIRED,
                                message: VIOLATION_FORM.VIOLATION_CATEGORY.ERROR_MESSAGE,
                            },
                        ]}
                    >
                        <Select
                            placeholder={VIOLATION_FORM.VIOLATION_CATEGORY.PLACEHOLDER}
                            options={violationCategories}
                            onChange={(e) => handleViolationCategoryChange(e)}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    {violationCategoryData ? <Form.Item
                        label={violationCategoryData?.title}
                        rules={[
                            {
                                required: violationCategoryData?.required,
                                message: violationCategoryData?.error,
                            },
                        ]}
                        name={VIOLATION_FORM.VIOLATION_CATEGORY_DATA.NAME}
                    >
                        <Input
                            placeholder={violationCategoryData?.placeholder}
                            style={{ width: '100%' }}
                        // defaultValue={}
                        />
                    </Form.Item> : <></>}
                </Form>
            </Modal>
        </>
    )
}

export default ViewViolation;