import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [uniqueProducts,setUniqueProducts]= useState([])
 
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchAllProducts();
  }, []);

  
  const fetchAllProducts = async () => {
    const token = localStorage.getItem('token');
    const data = jwtDecode(token).email;
    const res = await axios.post("http://localhost:8080/api/cart/items",{email:data});
    setProducts(res.data.data);
    // console.log(res.data.data);
    // console.log(products)
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
    window.location.reload();
  };

  const handleCart = ()=>{
   const token = localStorage.getItem('token');
   console.log(token);
   console.log(jwtDecode(token));
  }
 
  const handleHome = ()=>{
    navigate('/home')
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
              onClick={handleHome}
            >
              <img src="/ps.png" width="100" height="60" />
            </Typography>
            
            
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <h1>Cart :</h1>
        <Grid container spacing={2}>
          {products && products !== undefined && products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    height: 330,
                    border: "0.1px solid gray",
                    color: "text.primary",
                    borderRadius: "8px",

                    transition: "background-color 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      border: "white",
                      backgroundColor: "#e8f4f8",
                      boxShadow: "0px 8px 14px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="180"
                    image={product.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.title.length > 15
                        ? `${product.title.substring(0, 15)}...`
                        : product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description.length > 40
                        ? `${product.description.substring(0, 40)}...`
                        : product.description}
                    </Typography>
                  </CardContent>

                  <Grid
                    container
                    spacing={2}
                    columns={16}
                    sx={{ marginLeft: "0px" }}
                  >
                    <Grid item xs={8}>
                      <Typography>Price : {product.price}$</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Button variant="outlined" >Order Now</Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))
          ) : (
            <Container sx={{ marginTop: 2 }}>No product found...</Container>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Cart;
