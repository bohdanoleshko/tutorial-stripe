import Header from "@/components/Header/Header";
import ProductList from "@/components/ProductList/ProductList";
import { Box } from "@mui/material";



export default function Home() {
  return (
    <Box>
      <Header />
      <ProductList />
    </Box>
  );
}
