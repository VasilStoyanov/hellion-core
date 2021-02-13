module.exports = ({ uuid, recipient }) => `
    <h1>Romanspiration password reset</h1>
    <h3>Hello ${recipient},</h3>
    <div>You are recieving this email because a request has been made in romanspiration.com for reseting your password.</div>
    <div>If you did <b>not</b> made this request, <b>please ignore this email</b> and continue using your old password.</div>
    <br />
    <div>If you made the request and wish to reset you password, please follow this link: http://romaspiration.com/password-reset/${uuid}</div>
`;
