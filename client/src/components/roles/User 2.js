import React from 'react';

// TODO: Add thing to apply for hour reduction.

export default function User({ user }) {
    return (
        <div>
            <h2>
                Welcome back { user.firstName } { user.lastName} !
            </h2>

            <br/>
            <br/>

            <div>
                { user.hours} / { user.hoursNeeded } Regular Hours Completed
            </div>

            <div>
                { user.finalHours } final hours completed
            </div>
        </div>
    )
}