import EvelopCard from "../../../components/envelopCard";
import * as Styled from "./styles";
import PaidSharpIcon from "@mui/icons-material/PaidSharp";
import SavingsIcon from "@mui/icons-material/Savings";

const Cards = () => {
  return (
    <Styled.Container>
      <EvelopCard
        title="Receitas"
        value={9000}
        color="#66BB6A"
        fill="#66BB6A33"
        icon={<PaidSharpIcon fontSize="large" style={{ color: "#66BB6A" }} />}
      />
      <EvelopCard
        title="Metas"
        value={2000}
        color="#FFD600"
        fill="#FFD60033"
        icon={<SavingsIcon fontSize="large" style={{ color: "#FFD600" }} />}
      />
      <EvelopCard
        title="Despesas"
        value={6000}
        color="#FF5722"
        fill="#FF572233"
        icon={<PaidSharpIcon fontSize="large" style={{ color: "#FF5722" }} />}
      />
    </Styled.Container>
  );
};

export default Cards;
