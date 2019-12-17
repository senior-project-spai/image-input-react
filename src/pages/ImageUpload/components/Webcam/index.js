import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Box, IconButton } from "@material-ui/core";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos";

const DEFAULT_FACING_MODE = "environment";
const CAMERA_STATUS = {
  TWO_CAMERA: "two_camera",
  FRONT_CAMERA: "front_camera",
  AUTO_CAMERA: "auto_camera",
  ERROR: "error"
};

export default function MyWebcam(props) {
  const { onGetScreenshot, ...rest } = props;

  const webcamRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState(CAMERA_STATUS.TWO_CAMERA);
  const [facingMode, setFacingMode] = useState(DEFAULT_FACING_MODE);

  const changeCameraStatus = error => {
    switch (cameraStatus) {
      case CAMERA_STATUS.TWO_CAMERA:
        // Try Front Camera
        setCameraStatus(CAMERA_STATUS.FRONT_CAMERA);
        setFacingMode("user");
        break;
      case CAMERA_STATUS.AUTO_CAMERA:
        // Camera Error
        setCameraStatus(CAMERA_STATUS.ERROR);
        console.error(error);
        break;
      default:
      case CAMERA_STATUS.FRONT_CAMERA:
        // Try Auto Camera
        setCameraStatus(CAMERA_STATUS.AUTO_CAMERA);
        break;
    }
  };

  const onClickCapture = () => {
    // call onGetScreenshot() if it is passed
    onGetScreenshot && onGetScreenshot(webcamRef.current.getScreenshot());
  };

  const onClickFlipCamera = () => {
    // switch between 'environment' and 'user'
    if (facingMode === "environment") {
      setFacingMode("user");
    } else {
      setFacingMode("environment");
    }
  };

  // handle Camera Error
  if (cameraStatus === CAMERA_STATUS.ERROR) return null;

  // create video constraints
  const videoConstraints =
    cameraStatus === CAMERA_STATUS.TWO_CAMERA ||
    cameraStatus === CAMERA_STATUS.FRONT_CAMERA
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
        key={facingMode}
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
        {cameraStatus === CAMERA_STATUS.TWO_CAMERA && (
          <Box position="absolute" right={0} bottom={0}>
            <IconButton onClick={onClickFlipCamera}>
              <FlipCameraIosIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
