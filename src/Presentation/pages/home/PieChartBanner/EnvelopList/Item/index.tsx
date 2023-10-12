import { Text } from "../../../../../components/Text";
import Slide from "./Slide";
import * as Styled from "./styles";
import ValueUsed from "./ValueUsed";

export type ItemProps = {
  name: string;
  color: string;
  value: number;
  used: number;
};

const Item = ({ name, value, color, used }: ItemProps) => {
  return (
    <Styled.Container>
      <Styled.ContainerHeader>
        <Styled.ContainerName>
          <Text color="#E4E9F2">{name}</Text>
        </Styled.ContainerName>
        <Styled.ContainerValue>
          <ValueUsed color={color} value={value} />
        </Styled.ContainerValue>
      </Styled.ContainerHeader>
      <Styled.ContainerBody>
        <Styled.ContainerProgress>
          <Slide color={color} used={used} value={value} />
        </Styled.ContainerProgress>
      </Styled.ContainerBody>
    </Styled.Container>
  );
};

export default Item;
