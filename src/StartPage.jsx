import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from 'axios';
import { API_URL } from "./constants";

// eslint-disable-next-line react/prop-types
const ServiceForm = ({ handleServiceId }) => {
  const [serviceName, setServiceName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const serviceIdResponse = await axios.post(`${API_URL}/service-id/`, { serviceName: serviceName });
      if (serviceIdResponse.data) {
        const serviceId = serviceIdResponse.data.service_id;
        console.log('serviceId:', serviceId);
        await axios.get(`${API_URL}/rules/${serviceId}`);
        localStorage.setItem("service_id", serviceId);
        localStorage.setItem("service_name", serviceName);
        handleServiceId(serviceId);
        alert(`Service Name: ${serviceName}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Service not found. A new service will be created for you.");
        try {
          const serviceIdResponse = await axios.post(`${API_URL}/rules/`, { serviceName: serviceName, ruleIds: "" });
          localStorage.setItem("service_name", serviceName);
          handleServiceId(serviceIdResponse.data);
          alert(`Service Name: ${serviceName}`);
        } catch (postError) {
          console.error("Error creating service:", postError);
          alert("An error occurred while creating the service. Please try again.");
        }
      } else {
        console.error("Error accessing service:", error);
        alert("An error occurred while accessing the service. Please try again.");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto" }}>
      <Typography variant="body2" color="textSecondary">
        Access your service page or create a new one. If the service name does not exist, the system will create a new one for you.
      </Typography>
      <TextField
        label="Service Name"
        variant="outlined"
        fullWidth
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Access
      </Button>
    </Box>
  );
};

export default ServiceForm;
