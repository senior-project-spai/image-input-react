import React, { useState, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Paper, InputAdornment, IconButton } from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import CameraIcon from "@material-ui/icons/Camera";
import Webcam from "react-webcam";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(3)
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

function FileUploader(props) {
  const classes = useStyles();
  const [file, setFile] = useState(undefined);
  const [fileName, setFileName] = useState("");
  const [endpoint, setEndpoint] = useState(
    "http://image-to-s3-babe-test.apps.spai.ml/_api/image"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isShowWebcam, setIsShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  /* <input type=file /> */
  const fileEl = useRef(null);
  const onBrowseClick = () => {
    fileEl.current.click();
  };

  const onChangeFile = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "");
  };

  const onChangeFileName = e => {
    setFileName(e.target.value);
  };

  const onChangeEndpoint = e => {
    setEndpoint(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const res = await uploadFile(file, fileName, endpoint);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    setIsUploading(false);
  };

  const uploadFile = async (file, fileName, endpoint) => {
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("pictureName", fileName);
    return await fetch(endpoint, {
      method: "POST",
      body: formData
    });
  };

  const onWebcamClick = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const webcamFile = await urlToFile(
      imageSrc,
      `webcam-${Date.now()}.jpg`,
      "image/jpeg"
    );
    setFile(webcamFile);
    setFileName(webcamFile.name);
    setIsShowWebcam(false);
  };

  const onWebcamToggle = () => {
    setIsShowWebcam(!isShowWebcam);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        type="text"
        name="endpoint"
        label="Endpoint"
        value={endpoint}
        onChange={onChangeEndpoint}
        fullWidth
        margin="normal"
      />
      <input
        ref={fileEl}
        type="file"
        onChange={onChangeFile}
        style={{ display: "none" }}
      />
      <TextField
        disabled
        type="text"
        label="Selected Picture"
        value={file ? file.name : ""}
        margin="normal"
        fullWidth
        InputProps={{
          endAdornment: (
            <React.Fragment>
              <InputAdornment position="end">
                <IconButton>
                  <CameraIcon color="secondary" onClick={onWebcamToggle} />
                </IconButton>
                <IconButton onClick={onBrowseClick}>
                  <InsertDriveFileIcon color="secondary" />
                </IconButton>
              </InputAdornment>
            </React.Fragment>
          )
        }}
      />
      {isShowWebcam && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          onClick={onWebcamClick}
        />
      )}
      <TextField
        type="text"
        name="fileName"
        label="Picture Name"
        value={fileName}
        onChange={onChangeFileName}
        fullWidth
        margin="normal"
      />
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          style={{ width: "100%" }}
        />
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

function App() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Image Input
          </Typography>
          <FileUploader />
        </Paper>
      </main>
    </React.Fragment>
  );
}

export default App;
