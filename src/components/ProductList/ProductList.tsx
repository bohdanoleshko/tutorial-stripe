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
import products from "@/utils/staticData";
import Image from "next/image";
import getStripe from "@/utils/stripeClient";
import { usePricing } from "../StatSig/StatSig";
import { useStatsigClient } from "@statsig/react-bindings";

type PriceTier = 'tier_10' | 'tier_15' | 'tier_20' | 'default';

const priceMapping: Record<PriceTier, Record<string, string>> = {
  tier_10: {
    'prod_R2aY3wLtI9mop4': '$10.99/month',
    'prod_R2aYmX3YAYYAYO': '$9.99/month',
    'prod_R2aZe2SU4qAggv': '$99.99 (one-time payment)',
    'prod_R2aa7aTxUNSVGB': '$10.99/month',
    'prod_R2aaX0RywpZRbM': '$19.99 (one-time payment)',
    'prod_R2abieD0Oez8YT': '$149.99/year',
  },
  tier_15: {
    'prod_R2aY3wLtI9mop4': '$15.99/month',
    'prod_R2aYmX3YAYYAYO': '$12.99/month',
    'prod_R2aZe2SU4qAggv': '$129.99 (one-time payment)',
    'prod_R2aa7aTxUNSVGB': '$14.99/month',
    'prod_R2aaX0RywpZRbM': '$24.99 (one-time payment)',
    'prod_R2abieD0Oez8YT': '$179.99/year',
  },
  tier_20: {
    'prod_R2aY3wLtI9mop4': '$20.99/month',
    'prod_R2aYmX3YAYYAYO': '$16.99/month',
    'prod_R2aZe2SU4qAggv': '$149.99 (one-time payment)',
    'prod_R2aa7aTxUNSVGB': '$19.99/month',
    'prod_R2aaX0RywpZRbM': '$29.99 (one-time payment)',
    'prod_R2abieD0Oez8YT': '$199.99/year',
  },
  default: {
    'prod_R2aY3wLtI9mop4': '$25.99/month',
    'prod_R2aYmX3YAYYAYO': '$18.99/month',
    'prod_R2aZe2SU4qAggv': '$169.99 (one-time payment)',
    'prod_R2aa7aTxUNSVGB': '$24.99/month',
    'prod_R2aaX0RywpZRbM': '$34.99 (one-time payment)',
    'prod_R2abieD0Oez8YT': '$219.99/year',
  },
};

const ProductList = () => {
  const { priceTier } = usePricing();
  const [dynamicProducts, setDynamicProducts] = useState(products);
  const client = useStatsigClient().client; 

  useEffect(() => {
    if (priceTier) {
      const updatedProducts = products.map((product) => {
        const updatedPrice = priceMapping[priceTier as PriceTier][product.id] || product.price;
        return {
          ...product,
          price: updatedPrice,
        };
      });

      updatedProducts.sort((a, b) => parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, '')));

      setDynamicProducts(updatedProducts);
    }
  }, [priceTier]);

  const handleBuyClick = async (productId: string) => {

  
    try {
      
      localStorage.setItem("productId", productId);
      localStorage.setItem("priceTier", priceTier ?? "default");
  
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, priceTier }),
      });
  
      const { id } = await response.json();
      const stripe = await getStripe();
  
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
      {dynamicProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card sx={{ maxWidth: 400, mx: "auto", marginTop: "20px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: "5px" }}>
              <Image width={350} height={350} src={product.image} alt={product.name} />
            </Box>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ color: 'black' }}>
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
              <Button variant="contained" color="primary" onClick={() => handleBuyClick(product.id)}>
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
