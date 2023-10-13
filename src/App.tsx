import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Presentation/layout";
import Home from "./Presentation/pages/home";
import About from "./Presentation/pages/about";
import { useState } from "react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Router>
          <Layout
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            colorModeContext={ColorModeContext}
          >
            <Routes>
              <Route path="/" element={<Home menuOpen={menuOpen} />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
