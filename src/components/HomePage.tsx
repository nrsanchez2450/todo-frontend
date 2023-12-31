import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { BASE_URL, ChangeUserContext, UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

interface Item {
  id: number;
  body: string;
  completed: boolean;
}

const useStyles: Function = makeStyles(() => ({
  topRightButton: {
    position: "absolute",
    top: 8,
    right: -480,
  },
  bottomRightButton: {
    position: "absolute",
    bottom: -690,
    right: -350,
  },
}));

function HomePage(): JSX.Element {
  const [newItem, setNewItem] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [tasksRemaining, setTasksRemaining] = useState<number>(0);
  const username = useContext(UserContext);
  const navigate = useNavigate();
  const changeUser = useContext(ChangeUserContext);

  // Loading user and tasks on login
  useEffect(() => {
    async function loadUser() {
      if (!username) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/checkToken`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token?.slice(1, -1) }),
        });
        if (response.status === 200) {
          const responseJson = await response.json();
          changeUser(responseJson);
        } else {
          navigate("/SignIn");
        }
      }
    }

    async function fetchTasks() {
      const response = await fetch(`${BASE_URL}/getTasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      if (response.ok) {
        try {
          const tasks: Item[] = await response.json();
          setItems(tasks);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        console.error(
          "Failed to fetch tasks. Response status:",
          response.status
        );
      }
    }
    async function loadData() {
      if (!localStorage.getItem("token")) navigate("/SignIn");
      await loadUser();
      await fetchTasks();
    }

    loadData();
  }, [username]);

  function addToDB(body: string) {
    fetch(`${BASE_URL}/addTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: username, body: body }),
    });
  }

  const handleComplete = (id: number): void => {
    let list: Item[] = items.map((item) => {
      let index: Item = { ...item };
      if (item.id === id) {
        if (!item.completed) {
          setTasksRemaining(tasksRemaining + 1);
        } else {
          setTasksRemaining(tasksRemaining - 1);
        }
        index.completed = !item.completed;
        updateToDB(id);
      }

      return index;

      async function updateToDB(id: number) {
        fetch(`${BASE_URL}/updateTask`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, completed: true }),
        });
      }
    });
    setItems(list);
  };

  const deleteAll = (): void => {
    setItems([]);
    setTasksRemaining(0);

    fetch(`${BASE_URL}/clearTasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: username }),
    });
  };

  const addItem = async () => {
    if (!newItem) {
      return;
    } else {
      const response = await fetch(`${BASE_URL}/matchId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await response.json();
      const newItemObject: Item = {
        id: body.id,
        body: newItem,
        completed: false,
      };
      setItems((oldList) => [...oldList, newItemObject]);
      setNewItem("");
      addToDB(newItemObject.body);
    }
  };

  const handleSignOut = (): void => {
    localStorage.removeItem("token");
    navigate("/SignIn");
  };

  const classes = useStyles();

  const theme = createTheme({
    typography: {
      fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
    },
  });

  return (
    <div id="root">
      <div className="To-Do App">
        <Typography component="div">
          <Button
            className={classes.topRightButton}
            variant="text"
            sx={{ color: "#858585", textTransform: "capitalize" }}
            onClick={handleSignOut}
          >
            Logout
          </Button>

          <Button
            variant="text"
            sx={{ color: "#858585", textTransform: "capitalize" }}
            className={classes.bottomRightButton}
            onClick={() => deleteAll()}
          >
            Clear All
          </Button>

          <ThemeProvider theme={theme}>
            <Typography variant="h3" gutterBottom sx={{ color: "#111827" }}>
              {" "}
              Daily ToDo List
            </Typography>
          </ThemeProvider>
          <p className="remaining-tasks">
            {" "}
            {items.length - tasksRemaining} daily tasks left.{" "}
          </p>

          <Grid container spacing={0}>
            <Grid xs={8}>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter your task"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              ></TextField>
            </Grid>

            <Grid xs={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#7C3AED",
                  border: 1,
                  borderRadius: 8,
                  borderColor: "#7C3AED",
                  textTransform: "capitalize",
                }}
                onClick={() => addItem()}
              >
                {" "}
                Add{" "}
              </Button>
            </Grid>
          </Grid>
        </Typography>

        <ul>
          {Object.values(items).map((item) => {
            return (
              <li key={item.id}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onClick={() => handleComplete(item.id)}
                ></input>
                <p className={item.completed ? "strikethrough" : ""}>
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
        <Divider></Divider>
      </div>
    </div>
  );
}

export default HomePage;
