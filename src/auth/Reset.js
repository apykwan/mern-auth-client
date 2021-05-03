import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Layout from '../core/Layout';
import 'react-toastify/dist/ReactToastify.min.css';

const Reset = ({ match }) => { // props.match from react router dom
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password'
    });

    useEffect(() => {
        let token = match.params.token;
        let { name } = jwt.decode(token);
        if (token) {
            setValues({ ...values, name, token });
        }
    }, []);

    const { name, token, newPassword, buttonText } = values;

    const handleChange = name => event => {
        setValues({
            ...values,
            [name]: event.target.value
        });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/reset-password`,
            data: { newPassword, resetPasswordLink: token }
        })
            .then(response => {
                console.log('RESET PASSWORD SUCCESS ', response);

                toast.success(response.data.message);
                setValues({ ...values, buttonText: 'Done' });
            })
            .catch(err => {
                console.log('RESET PASSWORD ERROR', err.response.data);
                setValues({ ...values, buttonText: 'Reset Password' });
                toast.error(err.response.data.error);
            });
    };

    const passwordResetForm = () => (
        <form>
            <div className="form-group mb-3">
                <label className="text-muted">Password</label>
                <input 
                    type="password"
                    placeholder="Type new password" 
                    className="form-control" 
                    onChange={handleChange('newPassword')} 
                    value={newPassword} 
                    required
                />
            </div>
            <div>
                <button className="btn btn-danger" onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <h1 className="p-5 text-center">Hey {name}. Type your new password</h1>
                {passwordResetForm()}
            </div>
        </Layout>
    );
};

export default Reset;
