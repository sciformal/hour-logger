import { Link } from "@material-ui/core";
import { Alert } from "react-bootstrap"

export const UnauthenticatedPage = () => {
    return (
        <div style={{width: '100%', textAlign: 'center'}}>
            <div style={{ padding: '5%', paddingTop: '100px', width: '100%' }}>
                <Alert variant="danger" style={{ width: '100%', textAlign: 'center' }}>
                    <h2>Page can't be loaded: Unauthorized Access</h2>
                </Alert>
            </div>
            <div style={{justifyContent: 'space-between' }}>
              <Link
                href="/"
                variant="body2"
              >
                &#8592; Back To My Hours
              </Link>
            </div>
        </div>
        
    )
}