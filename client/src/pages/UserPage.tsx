import API from "@aws-amplify/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Loader from "../components/global/Loader";
import { HourLoggerTable } from "../components/global/Table";
import { formatHourTransaction } from "../util/hours";

const hoursHeaders = ['Date', 'Check In', 'Check Out', 'Hours'];

export const UserPage = () => {
    // @ts-ignore
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [hoursFormatted, setHoursFormatted] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser(id);
    }, [id]);

    const loadUser = async (id: string) => {
        const user = await API.get('hour-logger', `/users/${id}`, {});
        const hoursEntries = user.transactions.map(transaction =>
            formatHourTransaction(transaction),
          );
        setHoursFormatted(hoursEntries);
        setUser(user);
        setLoading(false);
    }

    if (loading) {
        return <Loader />
    } else {
        return (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <h2>User: {user.firstName + ' ' + user.lastName}</h2>
            <br />
            <br />

            <h4>
                <b>Hours Summary</b>: {user.hours.toFixed(2)} / {user.hoursNeeded}{' '}
            </h4>
            <br />
            <br />

            <div style={{ width: '60%', margin: 'auto' }}>
            <HourLoggerTable rows={hoursFormatted} headers={hoursHeaders} />
            </div>
            </div>
        ) 
    }
}