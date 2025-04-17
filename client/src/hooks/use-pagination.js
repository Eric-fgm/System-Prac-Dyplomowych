import { useSearchParams } from "react-router";

const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
};

export default usePagination;
