"use client";
import { ReactFCC } from "@/types/common";
import Stripe from "stripe";
import ProductListItem from "./ProductListItem";

const ProductList: ReactFCC<{ products: Stripe.Product[] }> = ({
  products,
}) => {
  return products.map((product) => <ProductListItem key={product.id} product={product} />);
};

export default ProductList;
