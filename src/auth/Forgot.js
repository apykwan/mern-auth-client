import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Layout from '../core/Layout';
import 'react-toastify/dist/ReactToastify.min.css';

const Forgot = () => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request password reset link'
    });

    const { email, buttonText } = values;

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
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
            .then(response => {
                console.log('FORGOT PASSWORD SUCCESS ', response);

                toast.success(response.data.message);
                setValues({ ...values, buttonText: 'Requested' });
            })
            .catch(err => {
                console.log('SIGNIN ERROR', err.response.data);
                setValues({ ...values, buttonText: 'Request password reset link' });
                toast.error(err.response.data.error);
            });
    };

    const passwordForgotForm = () => (
        <form>
            <div className="form-group mb-3">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" onChange={handleChange('email')} value={email} />
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
                <h1 className="p-5 text-center">Forgot Password</h1>
                {passwordForgotForm()}
            </div>
        </Layout>
    );
};

export default Forgot;
