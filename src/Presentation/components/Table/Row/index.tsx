import Item from "../Item";
import * as Styled from "./styles";

export type RowProps = {
  envelop: string;
  date: string;
  transactions: string;
  status: string;
};

const Row = ({ envelop, date, transactions, status }: RowProps) => {
  return (
    <Styled.Container>
      <Item item={envelop} />
      <Item item={date} />
      <Item item={transactions} />
      <Item item={status} />
    </Styled.Container>
  );
};

export default Row;
