import { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";



const RegisterProf = () => {
  const [profForm, setProfForm] = useState({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProfForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (
      !profForm.fname ||
      !profForm.mname ||
      !profForm.lname ||
      !profForm.email ||
      !profForm.password ||
      !file
    ) {
      alert("Please fill in all fields and upload a profile image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fname", profForm.fname);
    formData.append("mname", profForm.mname);
    formData.append("lname", profForm.lname);
    formData.append("email", profForm.email);
    formData.append("password", profForm.password);
    formData.append("profileImage", file);

    try {
      const response = await axios.post("http://localhost:5000/register_prof", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(response.data.message);

      // Optional reset
      setProfForm({
        fname: '',
        mname: '',
        lname: '',
        email: '',
        password: '',
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

    } catch (error) {
      alert(error.response?.data?.error || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);


  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent"
      }}
    >
      <Container>
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            textAlign: "center",
            color: "maroon",
            marginTop: "25px",
          }}
        >
          PROFESSOR REGISTRATION
        </h1>
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "18px",
          }}
        >
          Welcome to the EARIST Professor Registration Portal. Please complete all required fields
          accurately to ensure your teaching profile is created successfully. Make sure to upload
          any necessary supporting documents, such as your credentials and valid identification.
          Thank you for your dedication and commitment to our students.
        </div>
      </Container>

      <br />

      <Container
        sx={{
          width: "60%",
          backgroundColor: "#6D2323",
          border: "2px solid black",
          maxHeight: "500px",
          overflowY: "auto",
          color: "white",
          borderRadius: 2,
          boxShadow: 3,
          padding: "4px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            style={{
              fontSize: "20px",
              padding: "10px",
              fontFamily: "Arial Black",
            }}
          >
            College Department Professor's
          </Typography>
        </Box>
      </Container>

      <Container
        sx={{
          width: "60%",
          backgroundColor: "#f1f1f1",
          border: "2px solid black",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium">Employee ID:</label>
          <TextField
            label="Enter your Employee ID"
            fullWidth
            margin="normal"
            name="fname"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium" style={{ minWidth: "100px" }}>
            First Name:
          </label>
          <TextField
            label="Enter your First Name"
            name="fname"
            value={profForm.fname}
            onChange={handleChanges}
            fullWidth
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium" style={{ minWidth: "100px" }}>
            Middle Name:
          </label>
          <TextField
            label="Enter your Middle Name"
            name="mname"
            value={profForm.mname}
            onChange={handleChanges}
            fullWidth
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium" style={{ minWidth: "100px" }}>
            Last Name:
          </label>
          <TextField
            label="Enter your Last Name"
            name="lname"
            value={profForm.lname}
            onChange={handleChanges}
            fullWidth
          />
        </Box>



        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium">Email Address:</label>
          <TextField
            label="Enter your Email Address"
            fullWidth
            margin="normal"
            name="email"
            type="email"
            value={profForm.email}
            onChange={handleChanges}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <label className="w-40 font-medium">Password:</label>
          <TextField
            label="Enter your Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={profForm.password}
            onChange={handleChanges}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <label
          style={{ marginTop: "20px", marginBottom: "5px", display: "block" }}
          className="w-40 font-medium"
        >
          Upload Profile Picture:
        </label>
        <TextField
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          inputRef={fileInputRef}
          inputProps={{ accept: ".png,.jpg,.jpeg,.pdf" }}
          fullWidth
        />

        {/* Single Register Button (with spinner & icon) */}
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CloudUploadIcon />
            )
          }
          disabled={loading}
          sx={{
            backgroundColor: "#6D2323",
            "&:hover": { backgroundColor: "#5a1f1f" },
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            py: 1,
            mt: 3,
          }}
          fullWidth
          onClick={handleRegister}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Container>
    </Box>
  );
};

export default RegisterProf;
