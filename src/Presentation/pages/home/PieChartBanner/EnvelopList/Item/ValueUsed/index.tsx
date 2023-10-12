import { Text } from "../../../../../../components/Text";
import * as Styled from "./styles";

type ValueUsedProps = {
  used: number;
  value: number;
  color: string;
};
const ValueUsed = ({ color, value, used }: ValueUsedProps) => {
  return (
    <Styled.Container>
      <Styled.ContainerInner>
        <Text color={"#E4E9F2"}>R$ {used.toFixed(2)}</Text>
      </Styled.ContainerInner>
      <Styled.ContainerInner>
        <Text color={`${color}`}>R$ {value.toFixed(2)}</Text>
      </Styled.ContainerInner>
    </Styled.Container>
  );
};

export default ValueUsed;
