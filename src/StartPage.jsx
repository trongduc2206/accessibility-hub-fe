import { useState } from "react";
import { TextField, Button, Box, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import axios from 'axios';
import { API_URL } from "./constants";

// eslint-disable-next-line react/prop-types
const ServiceForm = ({ handleServiceId }) => {
  const [serviceId, setServiceId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [createNewService, setCreateNewService] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [githubBranch, setGithubBranch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const serviceIdResponse = await axios.post(`${API_URL}/service-id/`, { serviceId: serviceId });
      if (serviceIdResponse.data) {
        const serviceId = serviceIdResponse.data.service_id;
        console.log('serviceId:', serviceId);
        await axios.get(`${API_URL}/rules/${serviceId}`);
        localStorage.setItem("service_id", serviceId);
        setLoading(false);
        // localStorage.setItem("service_name", serviceName);
        handleServiceId(serviceId);
        // alert(`Service Name: ${serviceName}`);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        setNotFound(true);
      //   alert("Service not found. A new service will be created for you.");
      //   try {
      //     const serviceIdResponse = await axios.post(`${API_URL}/rules/`, { serviceName: serviceName, ruleIds: "" });
      //     localStorage.setItem("service_name", serviceName);
      //     handleServiceId(serviceIdResponse.data);
      //     alert(`Service Name: ${serviceName}`);
      //   } catch (postError) {
      //     console.error("Error creating service:", postError);
      //     alert("An error occurred while creating the service. Please try again.");
      //   }
      // } else {  
      //   console.error("Error accessing service:", error);
      //   alert("An error occurred while accessing the service. Please try again.");
      }
    }
  };

  const handleClose = () => {
    setNotFound(false);
  }

  const handleCreateNewService = async () => {
    console.log("Creating new service", serviceName, githubLink);
    try {
      setLoading(true);
      const serviceIdResponse = await axios.post(`${API_URL}/service/`, { serviceName: serviceName, githubUrl: githubLink, githubBranch: githubBranch });
      const serviceId = serviceIdResponse.data;
      setLoading(false);
      localStorage.setItem("service_id", serviceId);
      handleServiceId(serviceId);
      // alert(`Service Name: ${serviceName}`);
    } catch (postError) {
      console.error("Error creating service:", postError);
      alert("An error occurred while creating the service. Please try again.");
    }
  }

  return (
     createNewService ? 
      (
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto" }}>
          <Typography variant="body2" color="textSecondary">
            Create a new service to start. A new service ID will be generated for you.
          </Typography>         
          <TextField
            label="Service Name"
            variant="outlined"
            fullWidth
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
          <TextField
            label="Github Link"
            variant="outlined"
            fullWidth
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
          <TextField
            label="Github Branch"
            variant="outlined"
            fullWidth
            value={githubBranch}
            onChange={(e) => setGithubBranch(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" onClick={handleCreateNewService} disabled={loading}>
            Create
          </Button>
          {loading && 
            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <CircularProgress />
            </div>
          }
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
            or access an existing service.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setCreateNewService(false)}
            sx={{ width: "fit-content", margin: "auto" }}
          >
            Access Existing Service
          </Button>
        </Box>
      ) :
      (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto" }}>
      <Typography variant="body2" color="textSecondary">
        Access your service page or create a new one. If the service name does not exist, the system will create a new one for you.
      </Typography>
      <TextField
        label="Service ID"
        variant="outlined"
        fullWidth
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Access
      </Button>
      {loading && 
        <div style={{ textAlign: "center", margin: "20px 0" }}>
            <CircularProgress />
        </div>
      }
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
        or create a new service.
      </Typography>
      <Button
        variant="outlined"
        // color="secondary"
        onClick={() => setCreateNewService(true)}
        sx={{ width: "fit-content", margin: "auto" }}
      >
        Create New Service
      </Button>
      <Snackbar open={notFound} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {`Service ID "${serviceId}" not found. You should create a new service to get a service ID.`}
        </Alert>
      </Snackbar>
    </Box>)
  );
};

export default ServiceForm;
