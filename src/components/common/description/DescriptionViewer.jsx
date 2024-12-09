import React from "react";

const DescriptionViewer = ({ htmlText }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
};

export default DescriptionViewer;
