import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import theme from "./theme";

import ImageUploadPage from "pages/ImageUpload";
import ObjectImageUploadPage from 'pages/ObjectImageUpload'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ImageUploadPage />
      <ObjectImageUploadPage />
    </ThemeProvider>
  );
}

export default App;
