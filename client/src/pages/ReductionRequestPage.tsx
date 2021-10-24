import API from "@aws-amplify/api"
import { TextField } from "@material-ui/core";
import { useState } from "react"
import { Button } from "react-bootstrap";
import { useUserContext } from "../libs/contextLib";

export const ReductionRequestPage = () => { 
    const { user } = useUserContext();
    const [reductionMessage, setReductionMessage] = useState("")

    const handleReductionMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReductionMessage(e.target.value);
    };

    const handleReductionRequest = async () => {
        const userId = user.userId;

        await API.post('hour-logger', '/requests', {
            body: {
            message: reductionMessage,
            userId: userId
            }
        });
    }

    return (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ textAlign: 'center', padding: '50px' }}>Submit a Reduction Request</h1>
          <TextField
          style={{ width: '50%', margin: 'auto' }}
            multiline
            rows={4}
            id="outlined-basic"
            label="Why should we reduce your hours?"
            variant="outlined"
            value={reductionMessage}
            onChange={handleReductionMessageChange}
          />
          <br></br>
          <br></br>
          <Button onClick={handleReductionRequest} variant="contained">
            Submit
          </Button>
        </div>
      );
}