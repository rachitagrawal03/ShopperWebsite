import { useContext, useEffect, useState } from "react";
import {ShopContext} from "../context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";

const Product = () => {  
  
  const { all_product } = useContext(ShopContext);
  
  const {productId} = useParams();

  console.log(all_product);
  console.log(productId);
  const product = all_product.find((e)=> e.id === Number(productId))
  console.log(product);
  return <div>
    <Breadcrumbs product={product} />
    <ProductDisplay product={product}/>
    <DescriptionBox/>
    <RelatedProducts/>
  </div>;
};

export default Product;
