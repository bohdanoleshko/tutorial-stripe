import Header from "@/components/Header/Header";
import { Box,  Button,  Typography } from "@mui/material";
import Link from "next/link";




const PageFailed = () => {
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
        }}> Payment Failed!</Typography>
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

export default PageFailed;