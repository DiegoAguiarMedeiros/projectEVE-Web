import Header from "../components/header";
import SideMenu from "../components/sideMenu";
import * as styled from "./styles";
import React from "react";
export type LayoutProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  colorModeContext: React.Context<{
    toggleColorMode: () => void;
  }>;
};

const Layout = ({
  children,
  menuOpen,
  setMenuOpen,
  colorModeContext,
}: LayoutProps) => {
  const handleToggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <>
      <Header
        handleToggleMenu={handleToggleMenu}
        colorModeContext={colorModeContext}
      />
      <styled.MainContainer>
        <SideMenu menuOpen={menuOpen} />
        <styled.MainContent style={{ backgroundColor: "#1e1e20" }}>
          {children}
        </styled.MainContent>
      </styled.MainContainer>
    </>
  );
};

export default Layout;
