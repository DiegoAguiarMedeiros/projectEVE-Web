import Item, { ItemProps } from "./Item";

const data: ItemProps[] = [
  { name: "Contas Fixas", value: 3200, color: "#0091EA", used: 2000 },
  { name: "Alimentação", value: 1200, color: "#00B8D4", used: 600 },
  { name: "Lazer", value: 400, color: "#00BFA5", used: 150 },
  { name: "Transporte", value: 400, color: "#FFD600", used: 95 },
  { name: "Saúde", value: 400, color: "#FFAB00", used: 300 },
  { name: "Bem Estar", value: 400, color: "#FF6D00", used: 380 },
];

const EnvelopList = () => {
  return (
    <>
      {data.map((item) => (
        <Item {...item} />
      ))}
    </>
  );
};

export default EnvelopList;
