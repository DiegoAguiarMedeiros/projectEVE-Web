import { useState } from "react";
import Header from "../components/header";
import SideMenu from "../components/sideMenu";
import * as styled from "./styles";
export type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(true);

  const handleToggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
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
