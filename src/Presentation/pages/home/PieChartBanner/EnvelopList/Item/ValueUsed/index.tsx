import { Text } from "../../../../../../components/Text";
import * as Styled from "./styles";

type ValueUsedProps = {
  value: number;
  color: string;
};
const ValueUsed = ({ color, value }: ValueUsedProps) => {
  return (
    <Styled.Container>
      <Styled.ContainerInner>
        <Text color={`${color}`}>R$ {value.toFixed(2)}</Text>
      </Styled.ContainerInner>
    </Styled.Container>
  );
};

export default ValueUsed;
