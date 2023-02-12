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
  Checkbox,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { loginUserInvoker } from "renderer/ipc/userInvokers";
import { Copyright } from "../components/Copyright";

const BackgroundGrid = styled(Grid)(
  ({ theme }) => `
    background-color: ${theme.palette.primary.main};
    width: 100vw;
    height: 100vh;
  `
);

const registerText = `Don't have an account`;

export const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selected, setSelected] = React.useState(false);
  const [autofocusPw, setAutofocusPw] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await loginUserInvoker(username, password);
    if (result.error) return;
    if (selected) {
      localStorage.setItem("remember_me", username);
    } else {
      localStorage.removeItem("remember_me");
    }
    setUsername("");
    setPassword("");
  };

  React.useEffect(() => {
    const rememberMe = localStorage.getItem("remember_me");
    if (!rememberMe) return;
    setUsername(rememberMe);
    setSelected(true);
    setAutofocusPw(true);
  }, []);

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
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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

              {!autofocusPw && (
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
              )}
              {autofocusPw && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Typography>
                Remember me?{" "}
                <Checkbox
                  color="default"
                  checked={selected}
                  style={{ padding: 0 }}
                  onChange={() => {
                    setSelected(!selected);
                  }}
                />
              </Typography>
              <Grid container>
                <Grid item xs>
                  <Link to="/register">{registerText}</Link>
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
