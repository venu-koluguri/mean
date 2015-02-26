'use strict';

module.exports = {
    signup_email: function(user, req, mailOptions) {
        mailOptions.html = [
            'Hi ' + user.first_name + ',',
            'You have successfully registered. Click on below link to login.',
            ' http://' + req.headers.host + '/#!/auth/login'
        ].join('\n\n');
        mailOptions.subject = 'Registration Successful';
        return mailOptions;
    }
};
