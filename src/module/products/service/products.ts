import nextInstance from "@/services/instances/nextInstance";
import Stripe from "stripe";

class ProductService {
  private path = "/products";
  private apiInstance = nextInstance;
  getProducts = async () => {
    const response =  await this.apiInstance.get<StripeListResponse<Stripe.Product>>(this.path);
    return response.data;
  };
}

export default new ProductService();
