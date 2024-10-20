"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import Image from "next/image";
import getStripe from "@/utils/stripeClient";
import { usePricing } from "../StatSig/StatSig";
import { useStatsigClient } from "@statsig/react-bindings";
import { Product } from "@/types/Product";
import product_img from "../../../public/product.png";

const ProductList = () => {
  const { priceTier } = usePricing();
  const client = useStatsigClient().client;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        const updatedProducts = data.map((product: Product) => {
          let price = product.price;

          const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));

          if (!isNaN(numericPrice)) {
            if (priceTier === "tier_10") {
              price = (numericPrice * 0.9).toFixed(2);
            } else if (priceTier === "tier_20") {
              price = (numericPrice * 1.1).toFixed(2);
            }

            price = `${price}`;
          }

          console.log(price);
          return {
            ...product,
            price,
          };
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [priceTier]);

  const handleBuyClick = async (productId: string, price: string) => {
    try {
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, price: numericPrice * 100 }),
      });

      const { id } = await response.json();
      const stripe = await getStripe();
      console.log(numericPrice * 100)
      if (client) {
        client.logEvent("purchase_attempt", undefined, {
          productId,
          priceTier: priceTier ?? "default",
        });
      }

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Failed to initiate purchase:", error);
    }
  };

  return (
    <Grid container spacing={5} justifyContent="center">
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card sx={{ maxWidth: 400, mx: "auto", marginTop: "20px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "5px",
              }}
            >
              <Image
                width={350}
                height={350}
                src={product_img}
                alt={product.name}
              />
            </Box>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: "black" }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h6" color="primary" mt={2}>
                {product.price}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleBuyClick(product.id, product.price)}
              >
                Buy
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
