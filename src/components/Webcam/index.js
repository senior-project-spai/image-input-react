import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Box, IconButton } from "@material-ui/core";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos";

const DEFAULT_FACING_MODE = "environment";

export default React.forwardRef((props, ref) => {
  const { onGetScreenshot, ...rest } = props;

  const webcamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState(2);
  const [facingMode, setFacingMode] = useState(DEFAULT_FACING_MODE); // "user"

  const changeCameraStatus = error => {
    if (cameraStatus === 2) {
      setCameraStatus(1);
      setFacingMode("user");
    } else if (cameraStatus === 1) {
      setCameraStatus(0);
    } else {
      console.error(error);
    }
  };

  const onClickCapture = () => {
    onGetScreenshot && onGetScreenshot(webcamRef.current.getScreenshot());
  };

  const onClickFlipCamera = () => {
    if (facingMode === "environment") {
      setFacingMode("user");
    } else {
      setFacingMode("environment");
    }
  };

  const videoConstraints = cameraStatus
    ? {
        facingMode: { exact: facingMode }
      }
    : undefined;

  return (
    <Box position="relative">
      <Webcam
        {...rest}
        ref={webcamRef}
        width="100%"
        onUserMediaError={changeCameraStatus}
        videoConstraints={videoConstraints}
        style={{ display: "block" }}
      />
      <Box
        position="absolute"
        bottom={0}
        display="flex"
        justifyContent="center"
        width="100%"
      >
        <IconButton onClick={onClickCapture}>
          <PhotoCameraIcon fontSize="large" color="secondary" />
        </IconButton>
        {cameraStatus === 2 && (
          <Box position="absolute" right={0} bottom={0}>
            <IconButton onClick={onClickFlipCamera}>
              <FlipCameraIosIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
});
