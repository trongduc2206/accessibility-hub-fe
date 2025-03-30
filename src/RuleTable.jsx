/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';

export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

const RuleTable = ({ serviceId, rules, rowSelectionModel, setRowSelectionModel, setRules }) => {
  const [initialRowSelectionModel, setInitialRowSelectionModel] = useState([]);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [enabledCount, setEnabledCount] = useState(0);

  useEffect(() => {
    setInitialRowSelectionModel(rowSelectionModel);
    setEnabledCount(rules.filter(rule => rule.ci === 'Enabled').length);
  }, []);

  useEffect(() => {
    setEnabledCount(rowSelectionModel.length);
    setRules(rules.map(rule => {
      if (rowSelectionModel.includes(rule.id)) {
        return { ...rule, ci: 'Enabled' };
      }
      return { ...rule, ci: 'Disabled' };
    }));
  }, [rowSelectionModel]);

  const paginationModel = { page: 0, pageSize: 10 };
  // const sortModel = [{ field: 'ci', sort: 'desc' }];

  const handleSave = () => {
    setOpenSaveDialog(true);
  };

  const handleDiscard = () => {
    setOpenDiscardDialog(true);
  };

  const handleSaveDialogClose = () => {
    setOpenSaveDialog(false);
  };

  const handleDiscardDialogClose = () => {
    setOpenDiscardDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSaveDialogConfirm = async () => {
    try {
      const data = {
        ruleIds: rowSelectionModel.join(",")
      };
      const updatedService = await axios.put(`https://accessibility-hub-be.onrender.com/rules/${serviceId}`, data);
      console.log(updatedService.data);
      setOpenSaveDialog(false);
      setSnackbarOpen(true);
      setInitialRowSelectionModel(rowSelectionModel);
    } catch (error) {
      console.error("Error saving rules:", error);
    }
  };

  const handleDiscardDialogConfirm = () => {
    setRowSelectionModel(initialRowSelectionModel);
    setOpenDiscardDialog(false);
  };



  const isRowSelectionChanged = !arraysEqual(initialRowSelectionModel, rowSelectionModel);

  const addedRules = rowSelectionModel.filter(id => !initialRowSelectionModel.includes(id));
  const removedRules = initialRowSelectionModel.filter(id => !rowSelectionModel.includes(id));

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Number of rules enabled in CI: {enabledCount}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button 
          variant="contained"
          style={{ marginLeft: 'auto', visibility: isRowSelectionChanged ? 'visible' : 'hidden' }}
          onClick={handleSave}
        >
          Save changes
        </Button>
        <Button 
          variant="outlined"
          style={{ visibility: isRowSelectionChanged ? 'visible' : 'hidden' }}
          onClick={handleDiscard}
        >
          Discard changes
        </Button>
      </div>
      <DataGrid
        rows={rules}
        columns={[
          { field: 'id', headerName: 'ID', width: 150 },
          { field: 'desc', headerName: 'Description', width: 450 },
          { 
            field: 'ci', 
            headerName: 'CI Status', 
            width: 150,
            renderCell: (params) => (
              <span style={{ color: params.value === 'Enabled' ? 'green' : 'red' }}>
                {params.value}
              </span>
            )
          },
          { 
            field: 'manual', 
            headerName: 'Manual Test', 
            width: 200,
            renderCell: (params) => (
              <span style={{ color: params.value === 'Passed' ? 'green' : params.value === 'Not tested' ? 'blue' : 'red' }}>
                {params.value}
              </span>
            )
          },
        ]}
        initialState={{ 
          pagination: { paginationModel },
          // sorting: { sortModel } 
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 1 }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        keepNonExistentRowsSelected
      />
      <Dialog
        open={openSaveDialog}
        onClose={handleSaveDialogClose}
      >
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have made changes to the selected rules. Do you want to save these changes?
          </DialogContentText>
          {addedRules.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              Added Rules: {addedRules.join(", ")}
            </Typography>
          )}
          {removedRules.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              Removed Rules: {removedRules.join(", ")}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDiscardDialog}
        onClose={handleDiscardDialogClose}
      >
        <DialogTitle>Discard Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to discard the changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDiscardDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Changes saved successfully"
      />
    </>
  );
};

export default RuleTable;