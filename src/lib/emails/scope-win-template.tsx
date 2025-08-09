import * as React from 'react';

interface ScopeWinTemplateProps {
    who: string;
    description: string;
    link: string;
}

export const ScopeWinTemplate: React.FC<Readonly<ScopeWinTemplateProps>> = ({
    who,
    description,
    link
}) => (
    <body style={{
        backgroundColor: '#fcfcfd',
        padding: '2rem 0px',
        fontFamily: 'Arial, Helvetica, sans-serif'
    }}>
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '450px',
            margin: 'auto',
            padding: '1rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'start'
            }}>
                <img src="https://Teamtjie.app/icon-192x192.png" width="40px"
                    height="40px" />
                <h4>Teamtjie</h4>
            </div>
            <div>
                <a style={{ fontSize: '12px' }} href="https://Teamtjie.app">Login to app</a>
            </div>
        </header>
        <main
            style={{
                maxWidth: '440px',
                margin: 'auto',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
            <div>
                <img src='https://Teamtjie.app/assets/gifs/leonardo-dicaprio-cheers.gif' width="100%" />
            </div>
            <h2 style={{ margin: 0 }}>{who} has been awarded a win!</h2>
            <p style={{ margin: 0 }}>&quot;for {description}&quot;</p>
            <a href={link}>
                <button style={{
                    cursor: 'pointer',
                    border: 'none',
                    padding: '0.8rem 2rem',
                    borderRadius: '8px',
                    color: 'white',
                    backgroundColor: '#4299e1',
                    fontWeight: 'bold',
                    maxWidth: '150px'
                }}>
                    Check it out
                </button>
            </a>
            <p style={{ color: '#667085' }}>
                Wins help team members feel appreciated and celebrated.
                It is important for team members to feel recognised and part of the team.
            </p>
        </main>
        <footer style={{ maxWidth: '68%', margin: 'auto', textAlign: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: '0 10px' }}>
                <h6 style={{ margin: 0 }}>Teamtjie</h6>
                <h6 style={{ margin: 0 }}>Cape Town, South Africa</h6>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <a href="https://Teamtjie.app/me" style={{ fontSize: '12px', textDecoration: 'underline' }}>
                    Manage Preferences
                </a>
            </div>
        </footer>
    </body>
);
