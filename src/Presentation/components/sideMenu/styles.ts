import styled from 'styled-components';

export const SideMenuContainer = styled.nav<{
  active: boolean;
}>`
  display: flex;
  width: ${(props: { active: boolean }) => props.active ? "200px" : "40px"};
  background-color: #242334;
  color: white;
  display: flex;
  flex-direction: column;
  margin-top: 65px;
  height: calc(100% - 64px);
  position: fixed;
  `;

export const SideMenuInner = styled.ul`
  color: white;
  display: flex;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 10;
  `;
export const SideMenuInnerBottom = styled.ul`
  color: white;
  display: flex;
  flex: 1;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
  `;

export const MenuItem = styled.li`
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;
  &:hover {
      border-left: 5px solid #EDF1F7;
    background-color: #302F45;
  }
`;

export const MenuLink = styled.a`
    text-justify: center;
    text-decoration: none;
    color: #E4E9F2;
`;