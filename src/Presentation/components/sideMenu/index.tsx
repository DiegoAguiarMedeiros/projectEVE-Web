import ListItemIcon from "@mui/material/ListItemIcon";
import ContentPaste from "@mui/icons-material/ContentPaste";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DraftsIcon from "@mui/icons-material/Drafts";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import * as Styled from "./styles";

type SideMenuProps = {
  menuOpen: boolean;
};

const SideMenu = ({ menuOpen }: SideMenuProps) => {
  return (
    <Styled.SideMenuContainer active={menuOpen}>
      <Styled.SideMenuInner>
        <Styled.MenuItem>
          <ListItemIcon>
            <DashboardIcon fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && <Styled.MenuLink href="/">Dashboard</Styled.MenuLink>}
        </Styled.MenuItem>
        <Styled.MenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && (
            <Styled.MenuLink href="/about">Envelopes</Styled.MenuLink>
          )}
        </Styled.MenuItem>
        <Styled.MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && (
            <Styled.MenuLink href="/about">Entradas</Styled.MenuLink>
          )}
        </Styled.MenuItem>
        <Styled.MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && <Styled.MenuLink href="/about">Saídas</Styled.MenuLink>}
        </Styled.MenuItem>
      </Styled.SideMenuInner>
      <Styled.SideMenuInnerBottom>
        <Styled.MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && (
            <Styled.MenuLink href="/services">Configurações</Styled.MenuLink>
          )}
        </Styled.MenuItem>
        <Styled.MenuItem>
          <ListItemIcon>
            <LogoutIcon fontSize="small" style={{ color: "#E4E9F2" }} />
          </ListItemIcon>
          {menuOpen && <Styled.MenuLink href="/contact">Sair</Styled.MenuLink>}
        </Styled.MenuItem>
      </Styled.SideMenuInnerBottom>
    </Styled.SideMenuContainer>
  );
};

export default SideMenu;
