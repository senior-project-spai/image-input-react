import React, { useState, useRef, useMemo } from "react";
import Webcam from "react-webcam";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Grid
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/Camera";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const useStyles = makeStyles(theme => ({
  inputFile: {
    margin: `${theme.spacing(0.5)}px 0`
  },
  button: {
    marginTop: theme.spacing(3)
  }
}));

async function urlToFile(url, filename, mimeType) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
}

export default function ImageUploadForm(props) {
  const [file, setFile] = useState(undefined);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [endpoint, setEndpoint] = useState(
    "https://image-to-s3-spai.apps.spai.ml/_api/image"
  );
  const [cameraID, setCameraID] = useState(0);
  const [branchID, setBranchID] = useState(0);

  const uploadFile = async (file, fileName, endpoint) => {
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("pictureName", fileName);
    formData.append("time", Math.round(Date.now() / 1000));
    formData.append("branch_id", branchID);
    formData.append("camera_id", cameraID);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      console.log(res.status, res.data);
    } catch (error) {
      console.error(error);
    }
    setIsUploading(false);
  };

  /* Presentation */

  const [isShowWebcam, setIsShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const fileEl = useRef(null);
  const previewImageURL = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  const onClickBrowseButton = () => {
    fileEl.current.click();
  };

  const onChangeFileInput = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "");
  };

  const onChangeFileNameInput = e => {
    setFileName(e.target.value);
  };

  const onChangeEndpointInput = e => {
    setEndpoint(e.target.value);
  };

  const onChangeBranchIDInput = e => {
    setBranchID(parseInt(e.target.value));
  };

  const onChangeCameraIDInput = e => {
    setCameraID(parseInt(e.target.value));
  };

  const onSubmit = e => {
    e.preventDefault();
    uploadFile(file, fileName, endpoint);
  };

  const onClickWebcam = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const webcamFile = await urlToFile(
      imageSrc,
      `webcam-${Math.round(Date.now() / 1000)}.jpg`,
      "image/jpeg"
    );
    setFile(webcamFile);
    setFileName(webcamFile.name);
    setIsShowWebcam(false);
  };

  const onClickWebcamToggle = () => {
    setIsShowWebcam(!isShowWebcam);
  };

  const classes = useStyles();

  return (
    <form onSubmit={onSubmit}>
      <TextField
        type="text"
        name="endpoint"
        label="Endpoint"
        value={endpoint}
        onChange={onChangeEndpointInput}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField
            type="text"
            name="branch_id"
            label="branch_id"
            onChange={onChangeBranchIDInput}
            fullWidth
            margin="normal"
            defaultValue={0}
          />
        </Grid>
        <Grid item xs>
          <TextField
            type="text"
            name="camera_id"
            label="camera_id"
            onChange={onChangeCameraIDInput}
            fullWidth
            margin="normal"
            defaultValue={0}
          />
        </Grid>
      </Grid>
      <input
        ref={fileEl}
        type="file"
        onChange={onChangeFileInput}
        style={{ display: "none" }}
      />
      <TextField
        disabled
        type="text"
        label="Selected Image"
        value={file ? file.name : ""}
        margin="normal"
        fullWidth
        InputProps={{
          endAdornment: (
            <React.Fragment>
              <InputAdornment position="end">
                <IconButton onClick={onClickWebcamToggle}>
                  <CameraIcon color="secondary" />
                </IconButton>
                <IconButton onClick={onClickBrowseButton}>
                  <InsertDriveFileIcon color="secondary" />
                </IconButton>
              </InputAdornment>
            </React.Fragment>
          )
        }}
      />
      {isShowWebcam && (
        <Box marginTop={4}>
          <Typography variant="body2" color="textSecondary">
            Webcam (Click to Capture)
          </Typography>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            onClick={onClickWebcam}
            videoConstraints={{ facingMode: { exact: "environment" } }}
          />
        </Box>
      )}
      <TextField
        type="text"
        name="fileName"
        label="Image Name"
        value={fileName}
        onChange={onChangeFileNameInput}
        fullWidth
        margin="normal"
      />
      {file && (
        <Box marginTop={2}>
          <Typography variant="body2" color="textSecondary">
            Preview Image
          </Typography>
          <img
            src={previewImageURL}
            alt={file.name}
            style={{ width: "100%" }}
          />
        </Box>
      )}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        className={classes.button}
        disabled={isUploading}
      >
        {isUploading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
    </form>
  );
}
