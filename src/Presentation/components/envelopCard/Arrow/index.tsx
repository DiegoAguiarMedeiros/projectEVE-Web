import CallMadeIcon from "@mui/icons-material/CallMade";
import EastIcon from "@mui/icons-material/East";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import * as Styled from "./styles";

type ArrowProps = {
  value: number;
};

const Arrow = ({ value }: ArrowProps) => {
  const returnIcon = () => {
    if (value > 9)
      return (
        <>
          <Styled.Title style={{ color: "#1B5E20" }}>{value}</Styled.Title>
          <NorthIcon style={{ color: "#1B5E20" }} />
        </>
      );
    if (value > 0)
      return (
        <>
          <Styled.Title style={{ color: "#66BB6A" }}>{value}</Styled.Title>
          <CallMadeIcon style={{ color: "#66BB6A" }} />
        </>
      );
    if (value >= 0)
      return (
        <>
          <Styled.Title style={{ color: "#FFEE58" }}>{value}</Styled.Title>
          <EastIcon style={{ color: "#FFEE58" }} />
        </>
      );
    if (value > -9)
      return (
        <>
          <Styled.Title style={{ color: "#E65100" }}>{value}</Styled.Title>
          <SouthEastIcon style={{ color: "#E65100" }} />
        </>
      );

    return (
      <>
        <Styled.Title style={{ color: "#DD2C00" }}>{value}</Styled.Title>
        <SouthIcon style={{ color: "#DD2C00" }} />
      </>
    );
  };

  return <Styled.Container>{returnIcon()}</Styled.Container>;
};

export default Arrow;
