import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { authenticate, isAuth } from './helper';
import Google from './Google';
import Facebook from './Facebook';
import Layout from '../core/Layout';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = () => {
    let history = useHistory();
    const [values, setValues] = useState({
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const { email, password, buttonText } = values;

    const handleChange = name => event => {
        setValues({
            ...values,
            [name]: event.target.value
        });
    };

    const informParent = response => {
        authenticate(response, () => {
            // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
            isAuth() && isAuth().role === 'admin' 
                ? history.push('/admin')
                : history.push('/private');
            });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }
        })
            .then(response => {
                // console.log('SIGNIN SUCCESS', response);

                // save the response (user, token) localstorage/cookie
                informParent(response);
                setValues({ ...values, email: '', password: '', buttonText: 'Submitted' });
            })
            .catch(err => {
                console.log('SIGNIN ERROR', err.response.data);
                setValues({ ...values, buttonText: 'Submit' });
                toast.error(err.response.data.error);
            });
    };

    const signinForm = () => (
        <form>
            <div className="form-group mb-3">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" onChange={handleChange('email')} value={email} />
            </div>
            <div className="form-group mb-5">
                <label className="text-muted">Password</label>
                <input type="password" className="form-control" onChange={handleChange('password')} value={password} />
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
                {isAuth() && <Redirect to="/" />}
                <h1 className="p-5 text-center">Signin</h1>
                <Facebook informParent={informParent} />
                <Google informParent={informParent} />
                {signinForm()}
                <br />
                <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-primary">
                    Forgot Password
                </Link>
            </div>
        </Layout>
    );
};

export default Signin;
