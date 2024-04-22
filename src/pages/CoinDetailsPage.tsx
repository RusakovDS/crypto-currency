import { useParams } from "react-router-dom";

const CoinDetailsPage = () => {
  const { symbol } = useParams();
  console.log(symbol)
  return <div>{symbol}</div>;
};

export default CoinDetailsPage;
