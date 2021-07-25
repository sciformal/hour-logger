import React from 'react';
import engsocLogo from '../../img/EngSoc-Logo-Black-2.png';

export default function Nav() {
    return (
        <div>
            <img alt="EngSoc Logo" width="200" style={{float: 'left'}} src={engsocLogo} />
            {/* <div style={{margin: 'auto'}}>
            <h2 style={{textAlign: 'center', padding: '20px 0'}}>Sci Formal Hour Logger</h2>
            </div> */}
        </div>
    )
}