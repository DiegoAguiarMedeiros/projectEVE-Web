import React from "react";
import * as Styled from "./styles";
interface TextProps {
  children: React.ReactNode;
  color: string;
}

const Title: React.FC<TextProps> = ({ children, color }) => {
  return <Styled.Title color={color}>{children}</Styled.Title>;
};
const SubTitle: React.FC<TextProps> = ({ children, color }) => {
  return <Styled.SubTitle color={color}>{children}</Styled.SubTitle>;
};
const Text: React.FC<TextProps> = ({ children, color }) => {
  return <Styled.Text color={color}>{children}</Styled.Text>;
};

export { Title, SubTitle, Text };
