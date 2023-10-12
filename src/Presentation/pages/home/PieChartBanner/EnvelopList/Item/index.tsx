import { Text } from "../../../../../components/Text";
import * as Styled from "./styles";
import ValueUsed from "./ValueUsed";

export type ItemProps = {
  name: string;
  color: string;
  value: number;
  used: number;
};

const Item = ({ name, value, color, used }: ItemProps) => {
  console.log(name, value, used, (used / value) * 100);

  function valueLabelFormat(value: number) {
    return `${value}%`;
  }

  return (
    <Styled.Container>
      <Styled.ContainerHeader>
        <Styled.ContainerName>
          <Text color="#E4E9F2">{name}</Text>
        </Styled.ContainerName>
        <Styled.ContainerValue>
          <ValueUsed color={color} value={value} used={used} />
        </Styled.ContainerValue>
      </Styled.ContainerHeader>
      <Styled.ContainerBody>
        <Styled.ContainerProgress>
          <Styled.PrettoSlider
            sx={{
              "& .MuiSlider-thumb": {
                color: color,
              },
              "& .MuiSlider-track": {
                color: color,
              },
              "& .MuiSlider-rail": {
                color: color,
              },
              "& .MuiSlider-active": {
                color: color,
              },
            }}
            colorSlider={color}
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            value={Number(((used / value) * 100).toFixed(0))}
            valueLabelFormat={valueLabelFormat}
          />
        </Styled.ContainerProgress>
      </Styled.ContainerBody>
    </Styled.Container>
  );
};

export default Item;
