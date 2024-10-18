"use client";
import Header from "@/components/Header/Header";
import { Box,  Button,  Typography } from "@mui/material";
import Link from "next/link";
import { useStatsigClient } from "@statsig/react-bindings";
import { useEffect } from "react";



const PageSuccess = () => {
    const client = useStatsigClient().client; 
   

    useEffect(() => {
        if (client) {
          
          const productId = localStorage.getItem("productId");
          const priceTier = localStorage.getItem("priceTier");
          const revenue = localStorage.getItem("price");
    
         
          client.logEvent("purchase_success", undefined, {
            productId: productId ?? "unknown",
            tier: priceTier ?? "default",
            revenue: revenue ?? "0",
          });
    
          
          localStorage.removeItem("productId");
          localStorage.removeItem("priceTier");
          localStorage.removeItem("price");
        }
      }, [client]);


    return (
        <Box sx={{
            height: '100vh',
        }}>
      <Header />
      <Box sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        <Typography sx={{
            fontSize: '32px',
            color: 'green',
            marginBottom: '30px',
        }}> Payment Success!</Typography>
        <Link href='/'>
        <Button sx={{
            borderRadius: '10px',
            color: 'white',
            backgroundColor: 'grey',
        }}>
        Back to the products
        </Button>
            
        </Link>
        
      </Box>
    </Box>
    )
}

export default PageSuccess;