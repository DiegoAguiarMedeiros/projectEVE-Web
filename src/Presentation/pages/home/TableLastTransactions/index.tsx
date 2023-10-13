import { Button } from "@mui/material";
import { Title } from "../../../components/Text";
import * as Styled from "./styles";
import Table, { TableProps } from "../../../components/Table";
import { RowProps } from "../../../components/Table/Row";

const headerData = ["Envelope", "Data", "Transação", "Status"];

const transactionExamples: RowProps[] = [
  {
    envelop: "A123",
    date: "2023-01-15",
    transactions: "Purchase groceries",
    status: "Completed",
  },
  {
    envelop: "B456",
    date: "2023-01-16",
    transactions: "Pay utility bill",
    status: "Pending",
  },
  {
    envelop: "C789",
    date: "2023-01-17",
    transactions: "Transfer funds",
    status: "Completed",
  },
  {
    envelop: "D101",
    date: "2023-01-18",
    transactions: "Withdraw cash",
    status: "Completed",
  },
  {
    envelop: "E111",
    date: "2023-01-19",
    transactions: "Deposit check",
    status: "Completed",
  },
  {
    envelop: "F121",
    date: "2023-01-20",
    transactions: "Online purchase",
    status: "Pending",
  },
  {
    envelop: "G131",
    date: "2023-01-21",
    transactions: "ATM withdrawal",
    status: "Completed",
  },
  {
    envelop: "H141",
    date: "2023-01-22",
    transactions: "Bill payment",
    status: "Pending",
  },
  {
    envelop: "I151",
    date: "2023-01-23",
    transactions: "Salary deposit",
    status: "Completed",
  },
];

const tableData: TableProps = {
  header: headerData,
  body: transactionExamples,
};

const TableLastTransactions = () => {
  return (
    <Styled.Container>
      <Styled.ContainerHeader>
        <Styled.ContainerHeaderTitle>
          <Title color="#E4E9F2">Transações Rescentes</Title>
        </Styled.ContainerHeaderTitle>
        <Styled.ContainerHeaderButton>
          <Button variant="contained">Ver Todas</Button>
        </Styled.ContainerHeaderButton>
      </Styled.ContainerHeader>
      <Styled.ContainerInner>
        <Table {...tableData} />
      </Styled.ContainerInner>
    </Styled.Container>
  );
};

export default TableLastTransactions;
