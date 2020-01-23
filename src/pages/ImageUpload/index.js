import React, { useState, useRef, useMemo } from "react";
import Webcam from "pages/ImageUpload/components/Webcam";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  Divider,
  CardContent,
  CardActions,
  AppBar,
  Toolbar
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/Camera";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const DEFAULT_ENDPOINT = "https://image-to-s3-spai.apps.spai.ml/_api/image";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    },
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
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
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [cameraID, setCameraID] = useState(0);
  const [branchID, setBranchID] = useState(0);

  const uploadFile = async (file, fileName, endpoint) => {
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("image_name", fileName);
    formData.append("time", Math.round(Date.now() / 1000));
    formData.append("branch_id", branchID);
    formData.append("camera_id", cameraID);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      const json = await res.json();
      console.log(res.status, `face_image_id: ${json["face_image_id"]}`);
    } catch (error) {
      console.error(error);
    }
    setIsUploading(false);
  };

  /* ------------------------------ Presentation ------------------------------ */

  const [isShowWebcam, setIsShowWebcam] = useState(false);
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

  const onGetScreenshot = async imageSrc => {
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
    <main className={classes.layout}>
      <Card>
        {/* <CardHeader title="Image Upload" />
        <Divider /> */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h5" color="">
              Image Upload
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={onSubmit}>
          <CardContent>
            <TextField
              type="text"
              name="endpoint"
              label="Endpoint"
              value={endpoint}
              onChange={onChangeEndpointInput}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Grid container spacing={3}>
              <Grid item xs>
                <TextField
                  type="text"
                  name="branch_id"
                  label="Branch ID"
                  onChange={onChangeBranchIDInput}
                  fullWidth
                  defaultValue={0}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs>
                <TextField
                  type="text"
                  name="camera_id"
                  label="Camera ID"
                  onChange={onChangeCameraIDInput}
                  fullWidth
                  margin="normal"
                  defaultValue={0}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <input
              ref={fileEl}
              type="file"
              onChange={onChangeFileInput}
              accept="image/jpeg"
              style={{ display: "none" }}
            />
            <TextField
              disabled
              type="text"
              label="Selected Image (image/jpeg)"
              value={file ? file.name : ""}
              margin="normal"
              fullWidth
              variant="outlined"
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
              <Box marginTop={2}>
                <Typography variant="body2" color="textSecondary">
                  Webcam
                </Typography>
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  onGetScreenshot={onGetScreenshot}
                />
              </Box>
            )}

            {file && (
              <React.Fragment>
                <TextField
                  type="text"
                  name="fileName"
                  label="Image Name"
                  placeholder="name"
                  value={fileName}
                  onChange={onChangeFileNameInput}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Box marginTop={1}>
                  <Typography variant="body2" color="textSecondary">
                    Preview Image
                  </Typography>
                  <img
                    src={previewImageURL}
                    alt={file.name}
                    style={{ width: "100%" }}
                  />
                </Box>
              </React.Fragment>
            )}
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              type="submit"
              disabled={isUploading}
              variant="contained"
              fullWidth
              disableElevation
            >
              {isUploading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </main>
  );
}
