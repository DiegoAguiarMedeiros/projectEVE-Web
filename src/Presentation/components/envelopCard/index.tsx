import * as Styled from "./styles";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import Arrow from "./Arrow";
import { Title } from "../Text";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

type EvelopCardProps = {
  title: string;
  value: number;
  color: string;
  fill: string;
  icon: React.ReactNode;
};

const EvelopCard = ({ title, value, icon, color, fill }: EvelopCardProps) => {
  return (
    <Styled.Container>
      <Styled.Header>
        {icon}
        <Title color="#E4E9F2">{title}</Title>
      </Styled.Header>
      <Styled.Body>
        <Styled.BodyValue>
          <Styled.Amount>R$ {value.toFixed(2)}</Styled.Amount>
          <Arrow value={0} />
        </Styled.BodyValue>
        <Styled.BodyGraph>
          <Styled.Graph>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area
                  dot={false}
                  type="natural"
                  dataKey="pv"
                  stroke={color}
                  fill={fill}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Styled.Graph>
        </Styled.BodyGraph>
      </Styled.Body>
    </Styled.Container>
  );
};

export default EvelopCard;
