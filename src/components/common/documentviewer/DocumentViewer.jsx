import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const DocumentViewer = ({ file }) => {
  return (
    <>
      <DocViewer
        documents={[
          {
            uri: window.URL.createObjectURL(file),
            fileName: file.name,
          },
        ]}
        pluginRenderers={DocViewerRenderers}
      />
    </>
  );
};
export default DocumentViewer;
