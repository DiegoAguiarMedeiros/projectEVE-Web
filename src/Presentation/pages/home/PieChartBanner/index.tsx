/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Styled from "./styles";
import PieChartCustom from "./PieChart";
import { Title } from "../../../components/Text";
import EnvelopList from "./EnvelopList";

const PieChartBanner = () => {
  return (
    <Styled.Container>
      <Styled.ContainerTitle>
        <Title color="#E4E9F2">Envelopes</Title>
      </Styled.ContainerTitle>
      <Styled.ContainerGraph>
        <PieChartCustom />
      </Styled.ContainerGraph>
      <Styled.ContainerEnvelopList>
        <EnvelopList />
      </Styled.ContainerEnvelopList>
    </Styled.Container>
  );
};

export default PieChartBanner;
