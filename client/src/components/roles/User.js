import React from 'react';

// TODO: Add thing to apply for hour reduction.

export default function User(props) {
    return (
        <div>
            <h2>
                Welcome back { props.user.name }!
            </h2>

            <br/>
            <br/>

            <div>
                { props.user.hours} / { props.user.hoursNeeded} Regular Hours Completed
            </div>

            <div>
                { props.user.finalHours} final hours completed
            </div>
        </div>
    )
}