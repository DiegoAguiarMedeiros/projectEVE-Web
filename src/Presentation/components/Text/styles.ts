import styled from 'styled-components';

export const Title = styled.h1<{
  color: string,
}>`
  color:${(props: { color: string; }) => props.color};
  font-size: 20px;
`;
export const SubTitle = styled.h2<{
  color: string,
}>`
  color:${(props: { color: string; }) => props.color};
  font-size: 16px;
`;
export const Text = styled.p<{
  color: string,
  center?: boolean,
}>`
  color:${(props: { color: string; }) => props.color};
  font-size: 14px;
  padding: 0;
  margin: 0;
  text-align: ${(props) => (props.center ? "center" : "left")}; 
`;