import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the workerSrc to the appropriate location
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileViewer = ({ data, visible, handleCancel }) => {
  const [fileType, setFileType] = useState("");
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    if (data?.file_name) {
      const extension = data?.file_name?.split(".").pop().toLowerCase();
      if (extension === "pdf") {
        setFileType("pdf");
      } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
        setFileType("image");
      } else {
        setFileType("");
      }
    }
  }, [data?.file_name]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF document:", error);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Modal
        title="Document Viewer"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {fileType === "pdf" && (
          <iframe src={data?.url} width="100%" height="600"></iframe>
          // <Document
          //   file={data?.url}
          //   onLoadSuccess={onDocumentLoadSuccess}
          //   onLoadError={onDocumentLoadError}
          // >
          //   {Array.from(new Array(numPages), (el, index) => (
          //     <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          //   ))}
          // </Document>
        )}
        {fileType === "image" && (
          <img
            src={data?.url}
            alt="Document"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
        {fileType === "" && <p>Unsupported file type</p>}
      </Modal>
    </div>
  );
};

export default FileViewer;
