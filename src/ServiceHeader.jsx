import { Button, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// eslint-disable-next-line react/prop-types
const ServiceHeader = ({ setShowForm }) => {
  const handleChangeService = () => {
    const confirmed = window.confirm("Are you sure you want to change the service?");
    if (confirmed) {
      localStorage.removeItem("service_name");
      localStorage.removeItem("service_id");
      setShowForm(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{localStorage.getItem("service_name")}</h2>
        <Button variant="outlined" onClick={handleChangeService} style={{width: 'fit-content'}}>Change Service</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Use this ID in your CI/CD pipeline">
        <h3 style={{marginRight: 8}}>Service ID: {localStorage.getItem("service_id")}</h3>
        </Tooltip>
        <Tooltip title="Copy Service ID to clipboard">
        <ContentCopyIcon style={{cursor: 'pointer'}} onClick={() => navigator.clipboard.writeText(localStorage.getItem("service_id"))} />
        </Tooltip>
      </div>
    </div>
  );
};

export default ServiceHeader;