import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

const drawerWidth = 240;
const navItems = ["Resume", "Contact"];

const Header = ({ children, window }) => {
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", width: "100vw" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "secondary.main",
          padding: { sm: "24px 80px", md: "24px 150px" },
        }}
      >
        <Toolbar
          sx={{
            "&.MuiToolbar-root": {
              padding: "0",
            },
            alignItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              padding: "0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              color="primary"
              sx={{
                textAlign: "left",
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
              }}
            >
              Roan.
            </Typography>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                gap: { xs: "20px", sm: "30px" },
              }}
            >
              {navItems.map((item) => (
                <Button
                  color="primary"
                  key={item}
                  sx={
                    item === "Contact" && {
                      border: (theme) =>
                        `4px solid ${theme.palette.primary.main}`,
                      padding: "10px 20px",
                    }
                  }
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" pt={3}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Header;
