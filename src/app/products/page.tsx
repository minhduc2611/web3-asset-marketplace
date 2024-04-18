import ProductList from '@/module/products/components/ProductList';
import { Metadata } from "next";
import ProductService from "@/module/products/service/products";

export const metadata: Metadata = {
  title: "Learn",
  description: "Learning",
};

async function Home() {
  const products = await ProductService.getProducts()
  return (
    <main className="min-h-screen p-10 md:px-24 flex items-center justify-center h-full  bg-base-100 text-primary">
      <div>
        <ProductList products={products} />

      </div>
    </main>
  );
}

export default Home;