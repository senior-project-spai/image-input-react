import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import theme from "./theme";

import FaceImageUploadPage from "pages/FaceImageUpload";
import ObjectImageUploadPage from 'pages/ObjectImageUpload'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/object">
            <ObjectImageUploadPage />
          </Route>
          <Route path={["/face", "/"]} exact>
            <FaceImageUploadPage />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
