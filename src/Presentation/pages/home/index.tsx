import Cards from "./Cards";
import PieChartBanner from "./PieChartBanner";
import TableLastTransactions from "./TableLastTransactions";
import * as Styled from "./styles";
const Home = () => {
  return (
    <Styled.Container>
      <Cards />
      <PieChartBanner />
      <TableLastTransactions />
    </Styled.Container>
  );
};

export default Home;
