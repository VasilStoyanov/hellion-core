module.exports = ({ emailConfirmationUuid, recipient }) => `
    <h1>Romanspiration email confirmation</h1>
    <h3>Hello ${recipient},</h3>
    <div>Please click <a href="https://www.google.com/search?q=${emailConfirmationUuid}">here</a> to confirm your account.</div>
    <br />
`;
