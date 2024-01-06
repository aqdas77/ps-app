import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { jwtDecode } from "jwt-decode";
import { UNSAFE_DataRouterStateContext, useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#288ae7",
  "&:hover": {
    backgroundColor: "#44bae2",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Main = () => {
  const [products, setProducts] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [cartCount,setCartCount]= useState(0)

  const navigate = useNavigate();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProduct(category, price);
  }, [category, price]);
  const filterProduct = async (category, price) => {
    if (category !== "" && price === "") {
      const res = await axios.get(
        `https://dummyjson.com/products/category/${category}`
      );
      if (res && res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } else if (category === "" && price !== "") {
      const res = await axios.get("https://dummyjson.com/products");
      var [minPrice, maxPrice] = price.split("-");
      minPrice = Number(minPrice);
      maxPrice = Number(maxPrice);

      if (res && res.data && res.data.products) {
        const items = res.data.products;
        const filteredItems = items.filter((ele) => {
          return ele.price >= minPrice && ele.price <= maxPrice;
        });
        setProducts(filteredItems);
      }
    } else if (category === "" && price === "") {
      const res = await axios.get("https://dummyjson.com/products");
      if (res && res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } else {
      const res = await axios.get(
        `https://dummyjson.com/products/category/${category}`
      );
      if (res && res.data && res.data.products) {
        if (res && res.data && res.data.products) {
          const items = res.data.products;
          var [minPrice, maxPrice] = price.split("-");
          minPrice = Number(minPrice);
          maxPrice = Number(maxPrice);
          const filteredItems = items.filter((ele) => {
            return ele.price >= minPrice && ele.price <= maxPrice;
          });
          setProducts(filteredItems);
        }
      }
    }
  };

  const fetchAllProducts = async () => {
    const res = await axios.get("https://dummyjson.com/products");
    setProducts(res.data.products);
    // console.log(product)
  };
  
  const handleCart = ()=>{
   navigate('/cart')
  }
  
  const handleAddToCart = async (product)=>{
    // console.log(product);
    const token = localStorage.getItem('token');
    const email = jwtDecode(token).email;
    const data = {...product,email:email}
    const res = await axios.post('http://localhost:8080/api/cart',data);
   
    setCartCount(cartCount+1);
    console.log(res);
  }

  const handleInputChange = async (event) => {
    setSearchValue(event.target.value);
    const res = await axios.get(
      `https://dummyjson.com/products/search?q=${searchValue}`
    );
    if (res && res.data && res.data.products) {
      setProducts(res.data.products);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/')
    window.location.reload();
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

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
            >
             
              <img src="/ps.png" width="100" height="60" />
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={handleInputChange}
              />
            </Search>
            <FormControl
              sx={{
                m: 1,
                minWidth: 120,
                borderColor: "#0276e3",
                backgroundColor: "#288ae7",
                "&:hover": {
                  backgroundColor: "#44bae2",
                },
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label" sx={{ color: "white" }}>
                Category
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
                sx={{
                  "&.MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  color: "white",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="smartphones">Smartphones</MenuItem>
                <MenuItem value="laptops">Laptops</MenuItem>
                <MenuItem value="fragrances">Fragrances</MenuItem>
                <MenuItem value="skincare">Skincare</MenuItem>
                <MenuItem value="groceries">Groceries</MenuItem>
                <MenuItem value="home-decoration">Home Decoration</MenuItem>
                <MenuItem value="sunglasses">Sunglasses</MenuItem>
                <MenuItem value="motorcycle">Motorcycle</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                minWidth: 120,
                borderColor: "#0276e3",
                backgroundColor: "#288ae7",
                "&:hover": {
                  backgroundColor: "#44bae2",
                },
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label" sx={{ color: "white" }}>
                Price(in $)
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={price}
                label="Price"
                onChange={handlePriceChange}
                sx={{
                  "&.MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  color: "white",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="0-99">{"<100"}</MenuItem>
                <MenuItem value="100-500">100 - 500</MenuItem>
                <MenuItem value="500-5000">{">500"}</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" aria-label="show cart" color="inherit">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartOutlinedIcon onClick={handleCart} />
                </Badge>
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <h1>Products :</h1>
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
                    image={product.images[0]}
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
                      <Button variant="outlined"  onClick={()=>{handleAddToCart(product)}}>Add to Cart</Button>
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

export default Main;
