import React, { useState, useEffect } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';

import Layout from '../core/Layout';
import 'react-toastify/dist/ReactToastify.min.css';

const Activate = ({ match }) => {
    const [values, setValues] = useState({
        token: '',
        name: '',
        show: true
    });

    const { token, name, show } = values;

    useEffect(() => {
        let token = match.params.token;
        let { name } = jwt.decode(token);

        if (token) {
            setValues({
                ...values,
                name,
                token
            });
        }
    }, []);

    const clickSubmit = event => {
        event.preventDefault();
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
            .then(response => {
                console.log('ACCOUNT ACTIVATION', response);
                setValues({ ...values, show: false });
                toast.success(response.data.message);
            })
            .catch(err => {
                console.log('ACCOUNT ACTIVATION ERROR', err.response.data.error);
                toast.error(err.response.data.error);
            });
    };

    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5">Hey {name}, Ready to activate your account?</h1>
            <button className="btn btn-outline-danger" onClick={clickSubmit}>
                Activate Account
            </button>
        </div>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {activationLink()}
            </div>
        </Layout>
    );
};

export default Activate;
