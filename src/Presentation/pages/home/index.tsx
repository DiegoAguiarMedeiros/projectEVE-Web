import Cards from "./Cards";
import PieChartBanner from "./PieChartBanner";
import TableLastTransactions from "./TableLastTransactions";
import * as Styled from "./styles";
const Home = () => {
  return (
    <Styled.Container>
      <Styled.LeftContainer>
        <Styled.CardsContainer>
          <Cards />
        </Styled.CardsContainer>
        <Styled.LastTransactionsContainer>
          <TableLastTransactions />
        </Styled.LastTransactionsContainer>
      </Styled.LeftContainer>
      <Styled.RightContainer>
        <Styled.BannerContainer>
          <PieChartBanner />
        </Styled.BannerContainer>
      </Styled.RightContainer>
    </Styled.Container>
  );
};

export default Home;
