import * as React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Card,
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { createUserInvoker } from "renderer/ipc/userInvokers";
import { Copyright } from "../components/Copyright";

const BackgroundGrid = styled(Grid)(
  ({ theme }) => `
    background-color: ${theme.palette.primary.main};
    width: 100vw;
    height: 100vh;
  `
);

export const RegisterPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const result = await createUserInvoker(username, password);
    if (result.error === true) return;
    setUsername("");
    setPassword("");
  };

  return (
    <BackgroundGrid container direction="row" alignItems="center">
      <Container maxWidth="xs">
        <Card
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.dark" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Register
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/">I already have an account</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright />
        </Card>
      </Container>
    </BackgroundGrid>
  );
};

// MouseEvent<HTMLAnchorElement, MouseEvent>
