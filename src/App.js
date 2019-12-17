import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import theme from "./theme";

import ImageUploadPage from "pages/ImageUpload";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ImageUploadPage />
    </ThemeProvider>
  );
}

export default App;
