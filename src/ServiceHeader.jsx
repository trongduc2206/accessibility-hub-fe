/* eslint-disable react/prop-types */
import { Box, Button, Tooltip, Typography, TextField, Snackbar, Alert, CircularProgress, Divider } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const ServiceHeader = ({ setShowForm, serviceInfo, updateGithubInfo }) => {
  const handleChangeService = () => {
    const confirmed = window.confirm("Are you sure you want to change the service?");
    if (confirmed) {
      localStorage.removeItem("service_name");
      localStorage.removeItem("service_id");
      setShowForm(true);
    }
  };

  const [openGithubForm, setOpenGithubForm] = useState(false);
  const [newGithubUrl, setNewGithubUrl] = useState("");
  const [newGithubBranch, setNewGithubBranch] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [updating, setUpdating] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0e7ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}>
        <h2>Service: {serviceInfo.service_name}</h2>
        <Button variant="contained" onClick={handleChangeService} style={{ width: 'fit-content' }}>Change Service</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', backgroundColor: '#e0e7ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}>
        <Tooltip title="Use this ID in your CI/CD pipeline">
          <h3 style={{ marginRight: 8 }}>Service ID: {localStorage.getItem("service_id")}</h3>
        </Tooltip>
        <Tooltip title="Copy Service ID to clipboard">
          <ContentCopyIcon style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(localStorage.getItem("service_id"))} />
        </Tooltip>
        </div>
        {
          serviceInfo.github_url && !openGithubForm ?
            
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', flexDirection: 'column', backgroundColor: '#e0e7ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}>
              
              <p style={{margin: '2px', marginRight: 'auto', fontSize: '1rem', fontWeight: 'bold'}}>GitHub URL: {serviceInfo.github_url}</p>
              <p style={{margin: '2px', marginRight: 'auto', fontSize: '1rem', fontWeight: 'bold'}}>Branch: {serviceInfo.github_branch}</p>
              <Button
                variant="contained"
                onClick={() => setOpenGithubForm(true)}
                sx={{ width: "fit-content", margin: "auto", marginTop: '8px' }}
              >
                Update
              </Button>
              
            </div>
            
            : <div style={{ marginLeft: 'auto', backgroundColor: '#e0e7ff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '16px' }}>
              <Box component="form" >
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                  Add your GitHub information to get more useful instruction.
                </Typography>
                <TextField
                  label="Github URL"
                  variant="outlined"
                  fullWidth
                  value={newGithubUrl}
                  onChange={(e) => setNewGithubUrl(e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <TextField
                  label="Github Branch"
                  variant="outlined"
                  fullWidth
                  value={newGithubBranch}
                  onChange={(e) => setNewGithubBranch(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => updateGithubInfo(newGithubUrl, newGithubBranch, setUpdating, setUpdateSuccess, setUpdateError, setOpenGithubForm)}
                  sx={{ width: "fit-content", margin: "auto", marginTop: '8px' }}
                >
                  Add
                </Button>
                { serviceInfo.github_url &&
                  <Button
                    variant="outlined"
                    onClick={() => setOpenGithubForm(false)}
                    sx={{ width: "fit-content", margin: "auto", marginTop: '8px', marginLeft: '8px' }}
                  >
                    Cancel
                  </Button>
                }
                {updating &&
                  <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <CircularProgress />
                  </div>
                }
              </Box>
            </div>
        }
      </div>
      <Snackbar open={updateSuccess} autoHideDuration={6000} onClose={() => { setUpdateSuccess(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          // onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Update GitHub info successfully.
        </Alert>
      </Snackbar>
      <Snackbar open={updateError} autoHideDuration={6000} onClose={() => { setUpdateError(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          // onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Failed to update GitHub info.
        </Alert>
      </Snackbar>
      <Divider style={{ margin: '16px 0' }} />
    </div>
  );
};

export default ServiceHeader;