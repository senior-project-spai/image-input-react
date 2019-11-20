import React from "react";
import { CssBaseline, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ImageUploadForm from "./components/imageUploadForm";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    },
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(3)
  }
}));

function App() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Image Upload Form
          </Typography>
          <ImageUploadForm />
        </Paper>
      </main>
    </React.Fragment>
  );
}

export default App;
