const User = require('../models/User');
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const forgotPassword = require('../models/forgotpassword');
require('dotenv').config();

const forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        console.log(user);

        if (user) {
            const id = uuid.v4();
            console.log(user.id);
            await forgotPassword.create({ id, active: true,userId:user.id });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.EMAIL_API_KEY;
            console.log('api key>>>',apiKey.apiKey)
            const transEmailApi = new Sib.TransactionalEmailsApi();
            
          console.log('transEmailApi',transEmailApi);
            const sender = {
                email: 'kayualagarsamy@gmail.com',
                name: 'Kayathri'
            }
            const receiver = [{
                email: email
            }];
               await transEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: `fogotPassword`,
                textContent: `Follow the link and reset the password`,
                htmlContent: `<h1>click on the link below to reset the password</h1><br>
                <a href="http://13.48.123.78:3000/password/resetpassword/${id}">Reset your password</a>`,
            })
                console.log('Link to reset password sent to your mail')
                return res.status(202).json({ success: true, message: "Link to reset password sent to your mail" });
            
            }
         else {
            throw new Error('User Doesnt exit');
        }

    } catch (err) {
        console.error(err);
        if (err.status === 401) {
            return res.status(401).json({ message: "Unauthorized: Invalid API key", success: false });
        } else {
            return res.status(500).json({ message: "Failed to send reset password email", success: false });
        }
    }
}
const resetpassword = async (req, res) => {
    const id = req.params.id;
    const ForgotPassword = await forgotPassword.findOne({ where: { id } });
    console.log(ForgotPassword);
    if (ForgotPassword) {
        await forgotPassword.update({ active: false }, { where: { id: ForgotPassword.id } });
        res.status(200).send(
                                `<html>
                                        <script>
                                            function formsubmitted(e){
                                                e.preventDefault();
                                                console.log('called')
                                            }
                                        </script>

                                        <form action="/password/updatepassword/${id}" method="get">
                                            <label for="newpassword">Enter New password</label>
                                            <input name="newpassword" type="password" required></input>
                                            <button>reset password</button>
                                        </form>
                                </html>`
        )
        res.end();
    }
}

const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        const resetpasswordreq = await forgotPassword.findOne({ where: { id: resetpasswordid } })

        const user = await User.findOne({ where: { id: resetpasswordreq }.userId })
        console.log('userDetails', user);
        if (user) {
            //encrypt password
            let saltRound = 10;
            bcrypt.hash(newpassword, saltRound, async (err, hash) => {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }

                await User.update({ password: hash }, { where: { id: user.id } })
                console.log('password change successfully')
                res.status(201).json({ message: 'Successfuly update the new password' })
            })
        } else {
            return res.status(404).json({ error: 'No user Exists', success: false })
        }


    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}


module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
}