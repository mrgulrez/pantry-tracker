"use client";
import { firestore } from "../firebase";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Modal,
  Stack,
  TextField,
  Button,
} from "@mui/material";


export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [search, setSearch] = useState("");

  const updatePantry = async () => {
    const pantryCollection = collection(firestore, "pantry");
    const querySnapshot = await getDocs(pantryCollection);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, "pantry", item.id); // Corrected to use doc()
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    updatePantry(); // Refresh pantry after modification
  };

  const addItem = async (itemName) => {
    const docRef = doc(firestore, "pantry", itemName); // Using itemName as the document ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1, name: itemName }); // Assuming name field should be set
    }
    updatePantry(); // Refresh pantry after modification
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      setFilteredPantry(pantry);
    } else {
      const filtered = pantry.filter((item) =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredPantry(filtered);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={2}
    >
      
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="80vw" display="flex" alignItems="center" justifyContent="space-between">
      <TextField
        label="Search Items"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      </Box>

      <Box border="1px solid #333" mt={2}>
        <Box
          width="80vw"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="80vw" height="100" maxHeight="60vh" spacing={2} overflow="auto">
          {filteredPantry.map((item) => (
            <Box
              key={item.id}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {item.name
                  ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  : ""}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {item.quantity}
              </Typography>
              <Button variant="outlined" onClick={() => removeItem(item)} color="error">
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}