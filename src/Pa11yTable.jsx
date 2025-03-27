/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState, useEffect } from 'react';
import { arraysEqual } from './RuleTable';

const Pa11yTable = ({ rules, ignoredRules, onIgnoredRulesChange }) => {
  const [localIgnoredRules, setLocalIgnoredRules] = useState([...ignoredRules]); // Local state for changes
  const [isChanged, setIsChanged] = useState(false); // Track if changes were made
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false); // State for discard confirmation dialog
  const [openSaveDialog, setOpenSaveDialog] = useState(false); // State for save confirmation dialog

  useEffect(() => {
    setLocalIgnoredRules([...ignoredRules]); // Sync local state with parent state
  }, [ignoredRules]);

  const handleSaveChanges = () => {
    onIgnoredRulesChange(localIgnoredRules); // Save changes to parent state
    setIsChanged(false); // Reset change tracking
    setOpenSaveDialog(false); // Close the save confirmation dialog
  };

  const handleDiscardChanges = () => {
    setLocalIgnoredRules([...ignoredRules]); // Reset local state to initial state
    setIsChanged(false); // Reset change tracking
    setOpenDiscardDialog(false); // Close the discard confirmation dialog
  };

  const handleRowSelectionChange = (newSelection) => {
    setLocalIgnoredRules(newSelection); // Update local state
    setIsChanged(true); // Mark changes as made
  };

  const isRowSelectionChanged = !arraysEqual(ignoredRules, localIgnoredRules);

  return (
    <>
      {rules.length === 0 ? (
        <Typography variant="body1" color="textSecondary" style={{ marginTop: 40 }}>
          There is no rule violated in manual evaluation or the manual evaluation has not been executed
        </Typography>
      ) : (
        <>
          <Typography variant="h7" gutterBottom style={{ marginTop: 20 }}>
            Number of ignored rules in CI: {localIgnoredRules.length}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Violated rules with manual evaluation
          </Typography>
          <div style={{ justifyContent: 'flex-end', gap: '10px', marginBottom: '10px', display: 'flex' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSaveDialog(true)} // Open the save confirmation dialog
              style={{ visibility: isRowSelectionChanged ? 'visible' : 'hidden' }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenDiscardDialog(true)} // Open the discard confirmation dialog
              style={{ visibility: isRowSelectionChanged ? 'visible' : 'hidden' }}
            >
              Discard Changes
            </Button>
          </div>
          <DataGrid
            rows={rules}
            columns={[
              {
                field: 'id',
                headerName: 'Rule Codes',
                width: 500,
              },
            ]}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => handleRowSelectionChange(newRowSelectionModel)}
            rowSelectionModel={localIgnoredRules} // Use local state for selection
            sx={{ border: 1 }}
          />

          {/* Save Confirmation Dialog */}
          <Dialog
            open={openSaveDialog}
            onClose={() => setOpenSaveDialog(false)} // Close the dialog without saving
          >
            <DialogTitle>Save Changes</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to save these changes? This action will update the ignored rules in CI.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSaveDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Discard Confirmation Dialog */}
          <Dialog
            open={openDiscardDialog}
            onClose={() => setOpenDiscardDialog(false)} // Close the dialog without discarding
          >
            <DialogTitle>Discard Changes</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to discard all changes? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDiscardDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDiscardChanges} color="secondary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Pa11yTable;