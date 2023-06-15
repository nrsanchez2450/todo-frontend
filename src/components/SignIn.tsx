import React, { useContext, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, ChangeUserContext } from "../App";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const changeUser = useContext(ChangeUserContext);
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 201) {
      changeUser(username);
      const responseJson = await response.json();
      localStorage.setItem("token", JSON.stringify(responseJson));
      navigate("/");
    } else {
      alert("Incorrect credentials");
    }
  };

  return (
    <>
      <form onSubmit={handleSignIn}>
        <Stack m={"auto"} mt={"12.5%"} width={"40%"} spacing={2.5}>
          <Typography variant="h4">Sign in</Typography>

          <div>
            <Typography variant="h6">Username</Typography>
            <TextField
              fullWidth
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
              placeholder="Enter your username"
            ></TextField>
          </div>

          <div>
            <Typography variant="h6">Password</Typography>
            <TextField
              fullWidth
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              placeholder="••••••••"
            ></TextField>
          </div>

          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Sign In
          </Button>
          <Typography>
            Don't have an account?
            <Link to={"/SignUp"}>
              <Button variant="text" color="secondary">
                Sign up
              </Button>
            </Link>
          </Typography>
        </Stack>
      </form>
    </>
  );
}
