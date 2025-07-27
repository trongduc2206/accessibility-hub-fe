// InstructionsPage.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { API_URL } from "./constants";
import ReactMarkdown from 'react-markdown';


const InstructionsPage = () => {
    const { id } = useParams(); // Get `id` from route
    const [instruction, setInstruction] = useState("");
    useEffect(() => {
        async function fetchInstruction() {
            const serviceId = localStorage.getItem("service_id")
            if(!serviceId) {
                console.error("Service ID not found in localStorage.");
                return;
            }
            const instructionResponse = await axios.get(`${API_URL}/axe-instruction/${serviceId}`); 
            if (!instructionResponse.data || !instructionResponse.data.axeInstruction) {
                console.error("Instruction not found in response.");
                return;
            }
            const instruction = instructionResponse.data.axeInstruction;
            console.log("Instruction:", instruction);
            

            setInstruction(instruction); // Use the response, update state
        }
        fetchInstruction();
    }, []);

  return (
    <div>
      <h1>Instructions</h1>
      <p>Showing instructions for ID: {id}</p>
      <div style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
            <ReactMarkdown>{instruction}</ReactMarkdown>
      </div>    
    </div>
  );
}

export default InstructionsPage;
