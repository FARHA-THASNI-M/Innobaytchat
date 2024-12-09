import React, { useState } from "react";

import { Input, message } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import "./chat.css";

const InputBox = ({
  inputValue,
  setInputValue,
  sendMessage,
  uploadFileToS3,
}) => {
  const recorderControls = useAudioRecorder();

  const addAudioElement = async (blob) => {
    console.log("blob", blob);
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);

    const reader = new FileReader();

    reader.readAsArrayBuffer(blob);

    reader.onload = async () => {
      try {
        const buffer = reader.result;
        console.log("bufferrrr", reader);
        let message_type = "audio";
        const url = await uploadFileToS3(buffer, message_type); // Upload the file to S3
        console.log("url", url);

        const meta = {
          size: buffer.size || 0,
        };
        sendMessage(url, message_type, meta);
      } catch (error) {
        console.log("audio error printing", error);
      }
    };
  };

  const  convertBytes =(bytes) => {
    const KB = 1024;
    const MB = KB * 1024;

    if (bytes < MB) {
      const kbValue = (bytes / KB).toFixed(2); // Convert to KB and round to 2 decimal places
      return `${kbValue} KB`;
    } else {
      const mbValue = (bytes / MB).toFixed(2); // Convert to MB and round to 2 decimal places
      return `${mbValue} MB`;
    }
  }

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0]; // Get the first file selected by the user
    console.log("files input", file);
    if (file) {
      try {
        const url = await uploadFileToS3(file); // Upload the file to S3
        console.log("url", url);
        let message_type = "file";
        if (file.type.includes("image")) {
          message_type = "image";
        } else if (file.type.includes("video")) {
          message_type = "video";
        } else if (file.type.includes("audio")) {
          message_type = "audio";
        }
        const meta = {
          size: convertBytes(file.size),
          name: file.name,
        };
        sendMessage(url, message_type, meta); // Send the URL of the uploaded file as a message
      } catch (error) {
        console.error("Failed to upload file:", error);
        message.error("Failed to upload file");
      }
    }
  };

  return (
    <div className="inputContainer" style={{ position: "bottom" }}>
      <Input
        style={{ width: "90%", background: "#fff" }}
        variant="borderless"
        placeholder="Enter message"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        autoFocus
        onPressEnter={() => sendMessage(inputValue, "text")}
        suffix={
          <>
            <SendOutlined
              onClick={() => sendMessage((inputValue, "text"))}
              style={{
                fontSize: 14,
                color: "#71717A",
                transform: "rotate(330deg)",
                cursor: "pointer",
              }}
            />
          </>
        }
      />
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
      />
      <label htmlFor="fileInput" className="fileAttachments">
        <PaperClipOutlined
          style={{ fontSize: 16, color: "#000", cursor: "pointer" }}
        />
      </label>
      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default InputBox;
