import React, { useEffect, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVer, setPasswordVer] = useState("");
  const [isMatch, setIsMatch] = useState(true);

  useEffect(() => {
    setIsMatch(password === passwordVer);
  }, [passwordVer]);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 201) {
      alert("Account created");
    } else {
      alert(`${response.status}, Error creating account`);
    }
  };

  return (
    <>
      <form onSubmit={handleSignUp}>
        <Stack m={"auto"} mt={"10%"} width={"40%"} spacing={2.5}>
          <Typography variant="h4">Sign up</Typography>
          <div>
            <Typography variant="h6">Username</Typography>
            <TextField
              label="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              fullWidth
              required
              placeholder="Enter your username"
            ></TextField>
          </div>
          <div>
            <Typography variant="h6">Password</Typography>
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="pass"
              fullWidth
              required
              placeholder="••••••••"
              type="password"
            ></TextField>
          </div>
          <div>
            <Typography variant="h6">Confirm Password</Typography>
            <TextField
              onChange={(e) => {
                setPasswordVer(e.target.value);
              }}
              error={!isMatch}
              helperText={!isMatch ? "Passwords do not match" : ""}
              fullWidth
              required
              placeholder="••••••••"
              type="password"
            />
          </div>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!isMatch}
            type="submit"
          >
            Sign Up
          </Button>
          <Typography>
            Already have an account?
            <Link to={"/SignIn"}>
              <Button variant="text" color="secondary">
                Sign In
              </Button>
            </Link>
          </Typography>
        </Stack>
      </form>
    </>
  );
}
