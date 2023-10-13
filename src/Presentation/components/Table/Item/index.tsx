import { Text } from "../../Text";
import * as Styled from "./styles";

type ItemProps = {
  item: string;
};

const Item = ({ item }: ItemProps) => {
  return (
    <Styled.Container>
      <Text color="#8F9BB3" center>
        {item}
      </Text>
    </Styled.Container>
  );
};

export default Item;
