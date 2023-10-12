import { Text } from "../../../../components/Text";
import * as Styled from "./styles";
type TableHeaderProps = {
  items: string[];
};
const TableHeader = ({ items }: TableHeaderProps) => {
  return (
    <Styled.Container>
      {items.map((item) => (
        <Text color="#8F9BB3">{item}</Text>
      ))}
    </Styled.Container>
  );
};

export default TableHeader;
