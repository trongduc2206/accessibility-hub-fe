import React, { useEffect } from 'react';
import { Modal, Box, Button, CircularProgress, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { API_URL } from './constants';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'white',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};
// eslint-disable-next-line react/prop-types
const InstructionModal = ({ ruleId, open, onClose, githubUrl, githubBranch }) => {
    const serviceId = localStorage.getItem("service_id");
    if (!serviceId) {
        console.error("Service ID not found in localStorage.");
    }

    if (!ruleId) {
        console.error("Rule ID is required to fetch instructions.");
    }

    const [instruction, setInstruction] = React.useState(sessionStorage.getItem(`instruction-${ruleId}`));
    const [loading, setLoading] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    console.log("render InstructionModal with ruleId:", ruleId, "and open:", open);

    useEffect(() => {
        console.log("use effect for InstructionModal triggered with ruleId:", ruleId);
        async function fetchInstruction() {
            try {
                if (!sessionStorage.getItem(`instruction-${ruleId}`)) {
                    setLoading(true);
                    let response;
                    if (githubUrl && githubBranch) {
                        response = await axios.post(`${API_URL}/instruction-agent/${serviceId}`, { ruleId: ruleId, githubUrl, githubBranch }, { timeout: 120000 });
                    } else {
                        response = await axios.post(`${API_URL}/instruction-agent/${serviceId}`, { ruleId: ruleId }, { timeout: 120000 });
                    }
                    // await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network delay
                    // response = {
                    //     data: {
                    //         output: "This is a placeholder instruction. Replace with actual API call."
                    //     }
                    // }
                    if (response && response.data?.output) {
                        setInstruction(response.data.output);
                        sessionStorage.setItem(`instruction-${ruleId}`, response.data.output); // Store in sessionStorage
                    } else {
                        console.error("Output not found in response.");
                    }
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                setAlertMessage("Failed to fetch instruction with error: " + error.message);
                console.error("Error fetching instruction:", error);
            }
        }

        fetchInstruction();
    }, [ruleId, serviceId, githubUrl, githubBranch]);

    // const testInstruction = "The \"landmark-one-main\" violation indicates that your webpage is missing a `<main>` landmark. The `<main>` element is crucial for accessibility as it helps assistive technologies (like screen readers) identify the primary content of the page.\n\nTo fix this issue, follow these steps:\n\n1. **Add the `<main>` Element:**\n   Ensure your HTML document includes a `<main>` element that wraps around the main content of your page. This element should not be nested within other landmark elements (like `<header>`, `<footer>`, `<nav>`, etc.).\n\n   Here's an example of how to structure it:\n\n   ```html\n   <!DOCTYPE html>\n   <html lang=\"en\">\n   <head>\n       <meta charset=\"UTF-8\">\n       <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n       <title>Your Page Title</title>\n   </head>\n   <body>\n       <header>\n           <h1>Site Title</h1>\n           <nav>\n               <!-- Navigation links -->\n           </nav>\n       </header>\n       \n       <main>\n           <h2>Main Content Title</h2>\n           <p>This is the main content of the webpage.</p>\n           <!-- More content -->\n       </main>\n       \n       <footer>\n           <p>Footer information</p>\n       </footer>\n   </body>\n   </html>\n   ```\n\n2. **Validate the Structure:**\n   After adding the `<main>` element, validate your HTML structure to ensure there are no nesting issues and that the document is semantically correct.\n\n3. **Re-run the Accessibility Test:**\n   Once you have made the changes, re-run the axe-core evaluation to confirm that the \"landmark-one-main\" violation has been resolved.\n\n4. **Consult Additional Resources:**\n   For more details, you can refer to the [Deque University guideline](https://dequeuniversity.com/rules/axe/4.10/landmark-one-main) on this specific rule.\n\nBy following these steps, you should be able to eliminate the accessibility violation related to the main landmark.";

    return (
        <div>
        <Modal open={open} onClose={onClose} aria-labelledby="modal-message-title">
            <Box sx={style}>

                <h2>Instructions generated by AI</h2>
                {
                    loading ?
                        <div style={{ textAlign: "center", margin: "20px 0" }}>
                            <CircularProgress />
                            <p>Please wait while the instruction is generating. This could take up to a few minutes.</p>
                        </div>
                        :
                        <div style={{ textAlign: "left", margin: "0 auto" }}>
                            <ReactMarkdown>{instruction}</ReactMarkdown>
                            {/* <ReactMarkdown>{testInstruction}</ReactMarkdown> */}
                        </div>
                }

                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <Button onClick={onClose} variant="contained" disabled={loading}>
                        Close
                    </Button>
                    <Tooltip title="Generate new instruction" placement='left-start'>
                        <IconButton
                            onClick={async () => {
                                try {
                                sessionStorage.removeItem(`instruction-${ruleId}`)
                                setLoading(true);
                                let response;
                                if (githubUrl && githubBranch) {
                                    response = await axios.post(`${API_URL}/instruction-agent/${serviceId}`, { ruleId: ruleId, githubUrl, githubBranch }, { timeout: 120000 });
                                } else {
                                    response = await axios.post(`${API_URL}/instruction-agent/${serviceId}`, { ruleId: ruleId }, { timeout: 120000 });
                                }
                                // await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate network delay
                                // response = {
                                //     data: {
                                //         instruction: "This is a placeholder instruction. Replace with actual API call."
                                //     }
                                // }
                                if (response && response.data?.instruction) {
                                    setInstruction(response.data.instruction);
                                    sessionStorage.setItem(`instruction-${ruleId}`, response.data.instruction); // Store in sessionStorage
                                } else {
                                    setAlertMessage("Instruction not found in response.");
                                    console.error("Instruction not found in response.");
                                }
                                setLoading(false);
                            } catch (error) {
                                setLoading(false);
                                setAlertMessage("Failed to refresh instruction: " + error.message);
                            }}
                            }
                            sx={{ marginLeft: 'auto' }}
                            color='primary'
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>
        </Modal>
        <Snackbar open={alertMessage !== ''} autoHideDuration={6000} onClose={() => setAlertMessage('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                  onClose={() => setAlertMessage('')}
                  severity="error"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
        </div>
    );
};

export default InstructionModal;