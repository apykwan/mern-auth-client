import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Layout from '../core/Layout';
import { isAuth, getCookie, signout, updateUser } from '../auth/helper';
import 'react-toastify/dist/ReactToastify.min.css';


const Private = ({ history }) => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const { role, name, email, password, buttonText } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE: ', response);
                const { role, name, email } = response.data;
                setValues({ ...values, role, name, email });
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPDATE ERROR: ', error.response.data.error);
                if (error.response.status === 401) {
                    signout(() => {
                        history.push("/");
                    });
                }
            })
    };

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
            url: `${process.env.REACT_APP_API}/user/update/${isAuth()._id}`,
            data: { name, password },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATED SUCCESS', response);
                updateUser(response, () => {
                    setValues({ ...values, buttonText: 'Submitted' });
                    toast.success('Profile updated successfully');
                });   
            })
            .catch(err => {
                console.log('PRIVATE PROFILE UPDATED ERROR', err.response.data.error);
                setValues({ ...values, buttonText: 'Submit' });
                toast.error(err.response.data.error);
            });
    };

    const updateForm = () => (
        <form>
            <div className="form-group mb-3">
                <label className="text-muted">Role</label>
                <input type="text" className="form-control" value={role} readOnly />
            </div>
            <div className="form-group mb-3">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange('name')} value={name} />
            </div>
            <div className="form-group mb-3">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" value={email} disabled />
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
                <h1 className="p-5 text-center">Private</h1>
                <p className="lead text-center">Profile Update</p>
                {updateForm()}
            </div>
        </Layout>
    );
};

export default Private;