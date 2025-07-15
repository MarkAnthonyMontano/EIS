import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

function RequirementUploader() {
  const [requirements, setRequirements] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userID, setUserID] = useState('');
  const [user, setUser] = useState('');
  const [userRole, setUserRole] = useState('');

  const fileInputRef = useRef(null); // ✅ add ref for file input

  useEffect(() => {
    const storedUser = localStorage.getItem('email');
    const storedRole = localStorage.getItem('role');
    const storedID = localStorage.getItem('person_id');

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === 'applicant' || storedRole === 'registrar') {
        fetchRequirements();
        fetchUploads(storedID);
      } else {
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchRequirements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/requirements');
      setRequirements(res.data);
    } catch (err) {
      console.error('Error fetching requirements:', err);
    }
  };

  const fetchUploads = async (personId) => {
    try {
      const res = await axios.get('http://localhost:5000/uploads', {
        headers: {
          'x-person-id': personId
        }
      });
      setUploads(res.data);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedRequirement || !file) {
      return alert('Please select a requirement and upload a file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirements_id', selectedRequirement);

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'x-person-id': userID,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSelectedRequirement('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // ✅ Clear file input
      }

      await fetchUploads(userID);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      try {
        await axios.delete(`http://localhost:5000/uploads/${id}`, {
          headers: {
            'x-person-id': userID
          }
        });
        await fetchUploads(userID);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: 1, backgroundColor: 'transparent' }}>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Container>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center', color: 'maroon', marginTop: '25px' }}>
            UPLOAD REQUIREMENT DOCUMENT
          </h1>
          <div style={{ textAlign: 'center' }}>
            Complete the applicant form to secure your place for the upcoming academic year at EARIST.
          </div>
        </Container>
        <br />
        <Container
          maxWidth="100%"
          sx={{
            backgroundColor: '#6D2323',
            border: '2px solid black',
            maxHeight: '500px',
            overflowY: 'auto',
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            padding: '4px'
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography style={{ fontSize: '20px', padding: '10px', fontFamily: 'Arial Black' }}>
              Step 6: Upload Documents
            </Typography>
          </Box>
        </Container>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '1px solid black', backgroundColor: '#f1f1f1' }}>
          <Typography style={{ fontSize: '20px', color: '#6D2323', fontWeight: 'bold' }}>Select Documents:</Typography>
          <hr style={{ border: '1px solid #ccc', width: '100%' }} />

          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <label style={{ marginTop: '-5px', marginBottom: '-20px' }} className="w-40 font-medium">
              Requirement:
            </label>
            <FormControl fullWidth>
              <InputLabel id="requirement-label">Select Requirement</InputLabel>
              <Select
                labelId="requirement-label"
                value={selectedRequirement}
                onChange={(e) => setSelectedRequirement(e.target.value)}
                label="Select Requirement"
              >
                <MenuItem value="">
                  <em>-- Select Requirement --</em>
                </MenuItem>
                {requirements.map((req) => (
                  <MenuItem key={req.id} value={req.id}>
                    {req.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <label style={{ marginTop: '-5px', marginBottom: '-20px' }} className="w-40 font-medium">
              Upload Documents:
            </label>
            <TextField
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              inputRef={fileInputRef} // ✅ Ref to reset input
              inputProps={{ accept: '.png,.jpg,.jpeg,.pdf' }}
              fullWidth
            />

            <Button
              onClick={handleUpload}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PhotoCameraIcon />}
              disabled={loading}
              sx={{
                backgroundColor: '#6D2323',
                '&:hover': { backgroundColor: '#5a1f1f' },
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none',
                py: 1
              }}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" align="center" mt={5} mb={2} color="#6D2323">
          Uploaded Documents
        </Typography>

        <Typography style={{ fontSize: "15px", color: "black", fontFamily: "Arial" }}>
          PLEASE NOTE: ONLY JPG, JPEG, OR PNG WITH MAXIMUM OF FILE SIZE OF 4MB ARE ALLOWED
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
          
            padding: 2,              // optional: adds space inside
            maxWidth: '100%',       // adjust width if needed
            margin: '0 auto'        // center if container allows
            
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Upload</TableCell>
                <TableCell>Date Uploaded</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: '#888', fontStyle: 'italic' }}>
                    No uploads found.
                  </TableCell>
                </TableRow>
              ) : (
                uploads.map((upload) => (
                  <TableRow key={upload.upload_id}>
                    <TableCell>{upload.description}</TableCell>
                    <TableCell>
                      <a
                        href={`http://localhost:5000${upload.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        Preview
                      </a>
                    </TableCell>
                    <TableCell>{upload.created_at ? new Date(upload.created_at).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(upload.upload_id)}
                        sx={{
                          color: 'white',
                          backgroundColor: 'maroon',
                          borderRadius: '4px',
                          fontSize: "15px",
                          '&:hover': { backgroundColor: '#600000' }
                        }}
                      >
                        <DeleteIcon sx={{ color: 'white' }} />
                        DELETE
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>



      </Container>
    </Box>
  );
}

export default RequirementUploader;
