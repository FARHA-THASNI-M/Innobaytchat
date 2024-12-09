import { ArrowLeftOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined, PaperClipOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, DatePicker, Descriptions, Divider, Dropdown, Input, List, Mentions, Modal, Popconfirm, Row, Select, Space, Spin, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../constants";
import { PERMISSIONS } from "../../constants/permissions";
import { addComment, deleteComment, deleteSnag, getComments, updateComment, updateSnag } from "../../pages/Task/task.service";
import { getItem, getPermissions, getProjectMembersData, getProjectUsersData, getUserDetails, getUserShortName, userDataFormatter } from "../../services";
import { getFormatDate } from "../../utils";
import DescriptionEditor from "../common/description/DescriptionEditor";
import DescriptionViewer from "../common/description/DescriptionViewer";
import DocumentViewer from "../common/documentviewer/DocumentViewer";
import { deleteSnagAttachmentByAttachmentId, downloadFileFromURL, getUploadUrl } from "../common/service";
import UnAuthorizedError from "../common/error/UnAuthorizedError";
import FileViewer from "../File/FileView";
const gutter = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
}
const ViewSnag = ({ project, snag, projectUsers, categories, priorityList, taskStatusList, fetchData, setShowTaskModal, isModal = false, breadCrumbItem = [] }) => {
    const navigate = useNavigate();
    const permissions = getPermissions()
    const [isEdit] = useState(permissions.includes(PERMISSIONS.SNAG_UPDATE));
    const initialShowEdit = {
        project_category_id: false,
        start_date: false,
        due_date: false,
        number_of_days: false,
        priority: false,
        assigned_to: false,
        status: false,
        description: false,
    }
    const [showEdit, setShowEdit] = useState(initialShowEdit);
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('');
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(false)
    const [snagData, setSnagData] = useState(snag)
    const [description, setDescription] = useState(snag?.description)
    const [assignTo, setAssignTo] = useState()
    const [assignBy, setAssignBy] = useState()
    const [updateCommentData, setUpdateCommentData] = useState('')
    const [updateCommentId, setUpdateCommentId] = useState(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const { user } = getUserDetails()
    const [fileList, setFileList] = useState([]);
    const [attachmentList, setAttachmentList] = useState([])
    const [previewFileData, setPreviewFileData] = useState({})
    const [allProjectMembers, setAllProjectMembers] = useState([])
    const [documentModalVisible, setDocumentrModalVisible] = useState(false);
    const [fileData, setFileData] = useState({})

    useEffect(() => {
        setShowEdit(initialShowEdit)
        setSnagData(snag)
        setDescription(snag.description)
        getAssignToDetails(snag)
        getAssignByDetails(snag)
        fetchComments()
        getAllTeamMembersData(snag?.project_id)
        setAttachmentList(snag?.attachments)
    }, [snag])


    const updateSnagHandler = (field, value) => {
        if (snagData[field] !== value) {
            updateSnagDetails({ [field]: value })
        }
        editHandler(field, false)
    }

    const getAllTeamMembersData = async (project_id) => {
        const users = await getProjectMembersData(project_id)
        setAllProjectMembers([...users.defaultUsers, ...users.projectMainMembers, ...users.projectTeamMembers])
    }

    const updateSnagDetails = (payload) => {
        setLoading(true)
        updateSnag(snag.snag_id, payload).then((data) => {
            if (data.success) {
                setSnagData(data.data)
                setDescription(data.data.description)
                getAssignToDetails(data.data)
                getAssignByDetails(data.data)
                setAttachmentList(data.data.attachments)
            }
            else {
                message.error(data?.message ? data.message : "failed");
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const descriptionUpdate = async () => {
        const files = []
        setLoading(true)
        if (fileList && fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i].originFileObj
                const url = await getUrlToUpload(file)
                files.push({
                    url,
                    type: 'snag',
                    file_name: file.name,
                    file_type: file.type
                })
            }
        }
        updateSnagHandler('description', description)
        if (files.length) {
            updateSnagDetails({ attachments: files })
            setFileList(null)
        }
    }

    const getUrlToUpload = async (file) => {
        const path = generateURLForFile(file)
        return getUploadUrl({ path }).then((data) => {
            if (data.success) {
                const { url } = data.data
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", file?.type);
                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: file,
                };
                return fetch(url, requestOptions)
                    .then(response => {
                        if (response.status === 200) {
                            return path
                        }
                    })
                    .catch(error => console.log('error', error));
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        })
    }

    const generateURLForFile = (fileDetails) => {
        return `${project.project_name}/snag/${moment().format('DD-MM-YYYY')}/${Date.now()}_${fileDetails?.name}`
    }

    const addNewComment = () => {
        setLoading(true)
        const payload = {
            "project_id": project.project_id,
            "task_id": snag.snag_id,
            "type": 'snag',
            "comment": newComment,
        }
        addComment(payload).then((data) => {
            if (data && data.success) {
                setNewComment('')
                fetchComments()
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

    const fetchComments = () => {
        setLoading(true)
        const payload = {
            "project_id": project.project_id,
            "task_id": snag.snag_id,
            "type": "snag"
        }
        getComments(payload).then((data) => {
            if (data && data.success) {
                setComments(data.data.rows)
                setCommentCount(data.data.count)
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

    const moveToTrash = () => {
        setLoading(true)
        deleteSnag(snag.snag_id).then((data) => {
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
    const editHandler = (field, value) => {
        if (isEdit) {
            setShowEdit((pervious) => ({ ...pervious, [field]: value }))
        }
    }

    const getAssignToDetails = async (snag) => {
        let users = projectUsers;
        if (users.length < 1) {
            users = await getProjectUsersData(snag.project_id)
        }
        const user = users.filter(({ user_id }) => user_id === snag?.assigned_to)[0]
        setAssignTo(user)
        // const user = projectUsers.filter(({ user_id }) => user_id === snag?.assigned_to)[0]
        // setAssignTo(user)
    }

    const getAssignByDetails = (snag) => {
        const user = projectUsers.filter(({ user_id }) => user_id === snag?.assigned_by)[0]
        setAssignBy(user)
    }

    const handleDeleteComment = (id) => {
        setLoading(true)
        deleteComment(id).then((data) => {
            if (data && data.success) {
                fetchComments()
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleUpdateComment = () => {
        setLoading(true)
        updateComment(updateCommentId, { comment: updateCommentData }).then((data) => {
            if (data && data.success) {
                fetchComments()
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        }).finally(() => {
            setUpdateCommentData(null);
            setUpdateCommentId(null);
            setLoading(false)
        })
    }

    // const downloadFileFromURL = async (fileUrl) => {
    //     await downloadFile(fileUrl)
    // }

    const deleteById = async (id) => {
        const resp = await deleteSnagAttachmentByAttachmentId(snag.snag_id, id)
        setAttachmentList(attachmentList.filter(val => val.snag_attachment_id != id))
    }

    const getFileFromPresignedUrl = async (presignedUrl, fileName) => {
        setLoading(true)
        fetch(presignedUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                response.blob().then(blob => {
                    console.log(blob)
                    const fileData = new File([blob], fileName);
                    console.log(fileData, '11111111')
                    setPreviewFileData(fileData)
                    setPreviewOpen(true)
                })
            }).catch((error) => {
                message.error(error?.message ? error.message : "failed");
            }).finally(() => {
                setLoading(false)
            })
    }

    const closePreview = () => {
        setPreviewFileData({})
        setPreviewOpen(false)
    }

    const handleCancel = () => {
        setDocumentrModalVisible(false);
        setFileData({});
    };

    const handleViewDocumentClick = (item) => {
        setDocumentrModalVisible(true);
        setFileData(item);
    }

    return (

        <>
            {/* <Breadcrumb>
                <Breadcrumb.Item>Snag</Breadcrumb.Item>
                <Breadcrumb.Item>{snagData?.snag_number}</Breadcrumb.Item>
            </Breadcrumb> */}
            {permissions.includes(PERMISSIONS.SNAG_VIEW) ?
                <>
                    <Space size={3} style={{ height: '0px' }} align="baseline" wrap>
                        {!isModal && <ArrowLeftOutlined onClick={() => { navigate(ROUTES.TASK.PATH, { state: { project } }) }} />}
                        <Avatar src={ICONS.SNAG} size={30}></Avatar>
                        <Tag color="#E5ECF6" style={{ borderRadius: '20px', width: '60px', textAlign: 'center', color: '#00000066' }}><b>Snag</b></Tag>
                        <Tag color="#0084FF" style={{ fontSize: '10px' }}>{snagData?.snag_number}</Tag>
                    </Space>
                    <Card className="mt-5" title={<Typography.Title level={5} size={'small'} editable={isEdit ? {
                        tooltip: 'click to edit',
                        onChange: (text) => updateSnagHandler('snag_name', text),
                        enterIcon: null,
                        maxLength: 250,
                        autoSize: { minRows: 1, maxRows: 1 },
                        text: snagData?.snag_name,
                        triggerType: 'text',
                    } : false} style={{ margin: '0px 12px' }}>{snagData?.snag_name}</Typography.Title>} extra={
                        permissions.includes(PERMISSIONS.SNAG_DELETE) && <Dropdown
                            trigger={'click'}
                            menu={{
                                items: [
                                    getItem(permissions.includes(PERMISSIONS.SNAG_DELETE), (
                                        <Button type="link" danger
                                            onClick={(e) => {
                                                moveToTrash()
                                            }}
                                        >
                                            Move to trash
                                        </Button>
                                    ), "1"),

                                ],
                            }}
                            placement="bottom"
                        >
                            <MoreOutlined />
                        </Dropdown>
                    }>
                        <Spin spinning={loading}>
                            <Row gutter={gutter}>

                                {/* Description and comments */}
                                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }} lg={{ span: 16, order: 1 }} xl={{ span: 16, order: 1 }}>
                                    <div style={{ maxHeight: '65vh', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                                        {showEdit.description ?
                                            <div style={{ marginBottom: '30px' }}>
                                                <DescriptionEditor data={description} readOnly={!isEdit} setFileList={setFileList} fileList={fileList} setEditorData={setDescription} />
                                                <div style={{ float: 'right' }}>
                                                    <Space>
                                                        <Button onClick={() => { editHandler('description', false) }}>Cancel</Button>
                                                        <Button onClick={descriptionUpdate} type="primary">Save</Button>
                                                    </Space>
                                                </div>
                                            </div>
                                            : <Card title={'Description'} size="small">
                                                <div style={{ minHeight: '100px', maxHeight: '500px', overflow: 'hidden scroll' }} onDoubleClick={() => editHandler('description', true)}>
                                                    <DescriptionViewer htmlText={description} ></DescriptionViewer>
                                                </div>
                                            </Card>
                                        }
                                        <Divider />
                                        <Card title="attachments" size="small">
                                            <div className="flex flex-col">
                                                {
                                                    attachmentList?.map(val => {
                                                        let nameArray = val?.url.split('/')
                                                        return (
                                                            <div className="flex p-2">
                                                                <PaperClipOutlined />
                                                                <span className=" pl-2 cursor-pointer" onClick={() => {
                                                                    handleViewDocumentClick(val);
                                                                }}>{val?.file_name}</span>
                                                                <DownloadOutlined onClick={() => {
                                                                    downloadFileFromURL(val.url, val?.file_name)
                                                                }} className=" pl-2 " />
                                                                <Popconfirm
                                                                    title="Are you sure?"
                                                                    description="you want to delete the file"
                                                                    onConfirm={() => { deleteById(val.snag_attachment_id) }}
                                                                    onCancel={() => {
                                                                        return 0;
                                                                    }}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <DeleteOutlined style={{ color: 'red' }}
                                                                        className="pl-2"
                                                                    />
                                                                </Popconfirm>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Card>
                                        <Divider />
                                        <Typography.Paragraph strong className="mt-1">Comments ({commentCount})</Typography.Paragraph>
                                        <Mentions value={newComment} placeholder="Add a comment..." onChange={(e) => setNewComment(e)} options={
                                            allProjectMembers.map(({ username }) => ({ value: username, label: username }))
                                        }></Mentions>
                                        <Button className="mt-1" type="primary" style={{ float: 'right' }} disabled={!newComment} onClick={addNewComment}>Send</Button>
                                        {comments && comments.length ?
                                            <List
                                                className="mt-10"
                                                size="small"
                                                dataSource={comments}
                                                style={{ maxHeight: '250px', overflow: 'hidden scroll', scrollbarWidth: 'none' }}
                                                renderItem={(item, index) => <List.Item
                                                    actions={(item.created_by === user?.user_id) ? [<Button size='small' disabled={updateCommentData} onClick={() => { setUpdateCommentData(item?.comment); setUpdateCommentId(item?.project_comment_id) }} type="link" icon={<EditOutlined />}></Button>,

                                                    <Popconfirm
                                                        title="Delete Comment"
                                                        description="Are you sure to delete?"
                                                        onConfirm={() => handleDeleteComment(item?.project_comment_id)}
                                                        onCancel={() => { return 0 }}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        okType='danger'
                                                    >
                                                        <Button size='small' type="link" disabled={updateCommentData} danger icon={<DeleteOutlined />}></Button>
                                                    </Popconfirm>
                                                    ] : []}
                                                >
                                                    <List.Item.Meta
                                                        avatar={<Avatar size={'small'}>{getUserShortName(item?.user?.first_name, item?.user?.last_name)}</Avatar>}
                                                        title={<Space style={{ height: '0px' }}>
                                                            <Typography.Text>{item?.user?.first_name + " " + item?.user?.last_name}</Typography.Text>
                                                            <Typography.Text type="secondary" style={{ fontSize: "10px" }}>
                                                                {(moment(item?.created_at).format('MM-DD-YYYY HH:mm:ss')) ||
                                                                    "-"}
                                                            </Typography.Text>
                                                        </Space>
                                                        }
                                                        description={item.project_comment_id === updateCommentId ?
                                                            <>
                                                                <Mentions value={updateCommentData} onChange={(e) => setUpdateCommentData(e)} options={
                                                                    allProjectMembers.map(({ username }) => ({ value: username, label: username }))
                                                                }></Mentions>
                                                                <div style={{ float: 'right', marginTop: '10px' }}>
                                                                    <Space style={{ height: '25px' }}>
                                                                        <Button size="small" onClick={() => { setUpdateCommentData(null); setUpdateCommentId(null) }}>Cancel</Button>
                                                                        <Button type="primary" size="small" onClick={handleUpdateComment}>Save</Button>
                                                                    </Space>
                                                                </div>
                                                            </>
                                                            : <>{item.comment.split(" ").map((word, index) => (
                                                                <span key={index} style={{ color: word.startsWith('@') ? '#1890ff' : 'inherit' }}>
                                                                    {word + ' '}
                                                                </span>
                                                            ))}</>}
                                                    />
                                                </List.Item>}
                                            /> : <></>}
                                    </div>
                                </Col>


                                {/* Details */}
                                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }} lg={{ span: 8, order: 2 }} xl={{ span: 8, order: 2 }}>
                                    <Card size='small' title={'Details'} bordered={false} extra={
                                        showEdit.status ?
                                            <Select
                                                defaultOpen={true}
                                                autoFocus={true}
                                                variant="borderless"
                                                defaultValue={snagData?.status}
                                                size="small"
                                                options={taskStatusList.map(({ key, value }) => ({ label: value, value: key }))}
                                                style={{ flex: 1 }}
                                                onChange={(e) => updateSnagHandler('status', e)}
                                                onBlur={() => editHandler('status', false)}

                                            /> : <Tag color="#2db7f5" bordered={false} onClick={() => editHandler('status', true)} style={{ borderRadius: '20px' }}>{taskStatusList.filter(({ key }) => snagData?.status === key)[0]?.value}</Tag>
                                    }
                                    >
                                        <div style={{ maxHeight: '65vh', overflow: 'hidden scroll', scrollbarWidth: 'none' }}>
                                            <Card title='Category' size="small">
                                                {showEdit.project_category_id ?
                                                    <Select
                                                        defaultOpen={true}
                                                        autoFocus={true}
                                                        showSearch
                                                        filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
                                                        variant="filled"
                                                        options={categories.map(({ ref_category }) => ({ label: ref_category?.category_name, value: ref_category?.category_id }))}
                                                        style={{ width: '100%' }}
                                                        defaultValue={snagData?.project_category_id}
                                                        value={snagData?.project_category_id}
                                                        onChange={(e) => updateSnagHandler('project_category_id', e)}
                                                        onBlur={() => editHandler('project_category_id', false)}
                                                    />
                                                    : <Tag bordered={false} onClick={() => editHandler('project_category_id', true)} style={{ borderRadius: '20px', fontSize: '14px' }}> {categories.filter(({ ref_category }) => ref_category.category_id == snagData?.project_category_id)[0]?.ref_category?.category_name}</Tag>
                                                }

                                            </Card>

                                            <Card title='Timeline' size="small" className="mt-5">
                                                <Descriptions column={1} size="small" colon={false} layout="vertical">
                                                    <Descriptions.Item label='Start Date'>
                                                        {showEdit.start_date ?
                                                            <DatePicker autoFocus={true} open={true} size="small" variant="borderless" allowClear={false} defaultValue={dayjs(snagData?.start_date, 'YYYY-MM-DD')} value={dayjs(snagData?.start_date, 'YYYY-MM-DD')} onChange={(date, dateString) => updateSnagHandler('start_date', dateString)} style={{ width: '100%' }} onBlur={() => editHandler('start_date', false)}></DatePicker>
                                                            :
                                                            <Typography.Text onClick={() => editHandler('start_date', true)}>{getFormatDate(snagData?.start_date) || '-'}</Typography.Text>
                                                        }

                                                    </Descriptions.Item>


                                                    <Descriptions.Item label='End Date'>

                                                        {showEdit.end_date ?
                                                            <DatePicker autoFocus={true} open={true} size="small" variant="borderless" allowClear={false} defaultValue={dayjs(snagData?.due_date, 'YYYY-MM-DD')} value={dayjs(snagData?.due_date, 'YYYY-MM-DD')} onChange={(date, dateString) => updateSnagHandler('due_date', dateString)} style={{ width: '100%' }} onBlur={() => editHandler('due_date', false)}></DatePicker>
                                                            : <Typography.Text onClick={() => editHandler('due_date', true)}>{getFormatDate(snagData?.due_date) || '-'}</Typography.Text>
                                                        }
                                                    </Descriptions.Item>


                                                    <Descriptions.Item label='Number Of Days'> <Input size="small" type="number" variant="borderless" defaultValue={snagData?.number_of_days} value={snagData?.number_of_days} disabled /></Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                            <Card title='Priority' size="small" className="mt-5">
                                                {showEdit.priority ?
                                                    <Select
                                                        defaultOpen={true}
                                                        autoFocus={true}
                                                        showSearch
                                                        filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
                                                        options={priorityList.map(({ key, value }) => ({ label: value, value: key }))}
                                                        variant="filled"
                                                        style={{ width: '100%' }}
                                                        defaultValue={snagData?.priority}
                                                        value={snagData?.priority}
                                                        onChange={(e) => updateSnagHandler('priority', e)}
                                                        onBlur={() => editHandler('priority', false)}
                                                    />
                                                    : <Tag onClick={() => editHandler('priority', true)} color={priorityList.filter(({ key }) => key == snagData?.priority)[0]?.meta_code}>{priorityList.filter(({ key }) => key == snagData?.priority)[0]?.value}</Tag>}
                                            </Card>
                                            <Card title='Assignee' size="small" className="mt-5">
                                                {showEdit.assigned_to ? <Select
                                                    defaultOpen={true}
                                                    autoFocus={true}
                                                    showSearch
                                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
                                                    options={userDataFormatter(projectUsers)}
                                                    variant="filled"
                                                    style={{ width: '100%' }}
                                                    defaultValue={snagData?.assigned_to}
                                                    value={snagData?.assigned_to}
                                                    onChange={(e) => updateSnagHandler('assigned_to', e)}
                                                    onBlur={() => editHandler('assigned_to', false)}
                                                />
                                                    :
                                                    <Space style={{ height: '0px' }} onClick={() => editHandler('assigned_to', true)}>
                                                        {assignTo && assignTo?.first_name && assignTo?.last_name ? <Avatar size={'small'}>{getUserShortName(assignTo?.first_name, assignTo?.last_name)}</Avatar> : <Avatar size={'small'} icon={<UserOutlined />}></Avatar>}
                                                        <Typography.Text>{assignTo?.first_name + " " + assignTo?.last_name}</Typography.Text>
                                                    </Space>
                                                }
                                            </Card>
                                            <Card title='Assigned By' size="small" className="mt-5">
                                                {showEdit.assigned_to ? <Select
                                                    defaultOpen={true}
                                                    autoFocus={true}
                                                    showSearch
                                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').includes(input?.toLocaleLowerCase())}
                                                    options={userDataFormatter(projectUsers)}
                                                    variant="filled"
                                                    style={{ width: '100%' }}
                                                    defaultValue={snagData?.assigned_to}
                                                    value={snagData?.assigned_to}
                                                    onChange={(e) => updateSnagHandler('assigned_to', e)}
                                                    onBlur={() => editHandler('assigned_to', false)}
                                                />
                                                    :
                                                    <Space style={{ height: '0px' }} onClick={() => editHandler('assigned_to', true)}>
                                                        {assignBy && assignBy?.first_name && assignBy?.last_name ?
                                                            <>
                                                                <Avatar size={'small'}>{getUserShortName(assignBy?.first_name, assignBy?.last_name)}</Avatar>
                                                                <Typography.Text>{assignBy?.first_name + " " + assignBy?.last_name}</Typography.Text>
                                                            </>
                                                            :
                                                            <>
                                                                <Avatar size={'small'} icon={<UserOutlined />}></Avatar>
                                                                <Typography.Text>{'Super Admin'}</Typography.Text> {/* Need to change */}
                                                            </>
                                                        }

                                                    </Space>
                                                }
                                            </Card>
                                        </div>

                                    </Card>
                                </Col>
                            </Row>
                        </Spin>
                    </Card >
                </> : <UnAuthorizedError />}

            <Modal
                open={previewOpen}
                title={'Preview'}
                onCancel={closePreview}
                footer={[
                    <Button key="back" onClick={closePreview}>
                        Cancel
                    </Button>
                ]}
                width={800}
            >
                <DocumentViewer file={previewFileData} />

            </Modal>

            {documentModalVisible && <FileViewer data={fileData}
                visible={documentModalVisible}
                handleCancel={handleCancel} />}
        </>
    )
}

export default ViewSnag;