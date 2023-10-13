import Row, { RowProps } from "./Row";
import TableHeader from "./TableHeader";

export type TableProps = {
  header: string[];
  body: RowProps[];
};

const Table = ({ header, body }: TableProps) => {
  return (
    <>
      <TableHeader items={header} />
      {body.map((t) => (
        <Row {...t} />
      ))}
    </>
  );
};

export default Table;
