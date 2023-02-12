import React from "react";
import {
  Card,
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import { styled } from "@mui/system";
import { userStore } from "renderer/store/userStore";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { updateUserInvoker } from "renderer/ipc/userInvokers";
import { User } from "main/database/schemas/userSchema";

const BackgroundGrid = styled(Grid)(
  ({ theme }) => `
    background-color: ${theme.palette.primary.main};
    width: 100vw;
    height: 100vh;
  `
);

export const ProfilePage = () => {
  const user = userStore((s) => s.user);
  const nav = useNavigate();

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [correctPassword, setCorrectPassword] = React.useState(false);

  React.useEffect(() => {
    if (!user) nav("/");
  }, [nav, user]);

  if (!user) {
    return null;
  }
  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    const pwMatch = newPassword === confirmPassword;
    if (!pwMatch) {
      toast.error("New password doesn't match");
      return;
    }
    const newUser: User = { ...user, password: newPassword };
    const result = await updateUserInvoker(newUser);
    if (result.error) return;
    toast.success("Password changed");
    nav("/app");
  };

  const handleOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pw = e.target.value;
    setOldPassword(pw);
    const isCorrect = pw === user.password;
    if (isCorrect) setCorrectPassword(true);
    if (!isCorrect) setCorrectPassword(false);
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
            <Typography>Change Password</Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm old password"
                type="password"
                value={oldPassword}
                onChange={handleOldPassword}
                autoFocus
                color={correctPassword ? "primary" : "error"}
              />
              <div
                style={{ visibility: correctPassword ? "visible" : "hidden" }}
              >
                <Divider />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  Change Password
                </Button>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  nav("/app");
                }}
              >
                Go back
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </BackgroundGrid>
  );
};
