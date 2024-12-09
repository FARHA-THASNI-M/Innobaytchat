import {
    PaperClipOutlined
} from "@ant-design/icons";
import { Button, Modal, Typography, Upload, message } from 'antd';
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './description.css';
import DocumentViewer from "../documentviewer/DocumentViewer";

const MAX_FILES = 5;
const DescriptionEditor = ({ data, setEditorData, setFileList, fileList, height = "200px", readOnly = false, blur, showAddAttachments = true }) => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState("");
    const handleChange = (content, delta, source, editor) => {
        setEditorData(content)
    };
    const handleBlur = () => {
        if (!readOnly) {
            blur()
        }
    };

    const handleUploadChange = (e) => {
        if (e.fileList && e.fileList.length > MAX_FILES) {
            return message.error(`cannot select more than ${MAX_FILES}`)
        }
        setFileList(e.fileList);
    };

    const customRequest = (e) => {
        e.onSuccess([], e.file);
    };

    const handlePreview = async (file) => {
        setPreviewData(file?.originFileObj);
        setPreviewOpen(true);
    };

    const handleCancel = async () => {
        setPreviewData(null);
        setPreviewOpen(false);
    };

    return (
        <div>
            <ReactQuill
                modules={{
                    toolbar: [
                        [{ header: [1, 2, true] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                    ],
                }}
                formats={[
                    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'link', 'image'
                ]}
                value={data}
                onChange={handleChange}
                readOnly={readOnly}
            // onBlur={handleBlur}
            />
            {showAddAttachments && !readOnly && <div className="mt-2">
                <Upload
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={(e) => handleUploadChange(e)}
                    customRequest={(e) => customRequest(e)}
                    multiple
                    maxCount={MAX_FILES}
                >
                    <Button icon={<PaperClipOutlined />}>Attach </Button><Typography.Text type="warning">  (Max {MAX_FILES} files)</Typography.Text>
                </Upload>
            </div>}


            <Modal
                open={previewOpen}
                title={'Preview'}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                ]}
                width={800}
            >
                <DocumentViewer file={previewData}></DocumentViewer>
            </Modal>

        </div>


    );
};
export default DescriptionEditor;