import * as Styled from "./styles";

type ColorProps = {
  color: string;
  used: number;
  value: number;
};

const Slide = ({ used, value, color }: ColorProps) => {
  const valueLabelFormat = (value: number): string => {
    return `${value}%`;
  };

  const valueUsedPercent = (): number => {
    return Number(((used / value) * 100).toFixed(0));
  };

  return (
    <Styled.Container>
      <Styled.ContainerSlide>
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
          value={valueUsedPercent()}
          valueLabelFormat={valueLabelFormat}
        />
      </Styled.ContainerSlide>
      <Styled.ContainerVal>
        <Styled.ContainerUsed with={valueUsedPercent()}>
          {used}
        </Styled.ContainerUsed>
        <Styled.ContainerValue with={100 - valueUsedPercent()}>
          {100 - valueUsedPercent() == 0 ? "" : value}
        </Styled.ContainerValue>
      </Styled.ContainerVal>
    </Styled.Container>
  );
};

export default Slide;
