import '../Styles/Register.scss';
import Image from '../Images/Image.png';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../Config/axios';
import styled from 'styled-components';

export default function Register ( ) {

    const [ state, setState ] = useState({

        authStatus: 'Register',
        error: false,
        plan: 499,
        expiredPlan: false
    });

    const history = useHistory( );

    const Button = styled.button`
    
        background-color: ${

            function ( props ) {

                return props.colored ? 'orange' : 'transparent';
            }
        } !important;

        border: ${

            function ( props ) {

                return props.colored ? 'none' : '1px solid orange';
            }
        } !important;

        color: ${

            function ( props ) {

                return props.colored ? 'white' : 'black';
            }
        } !important;
    `;

    function submitHandler ( event ) {

        event.preventDefault( );
        event.persist( );

        axios.post( '/register', {

            status: state.authStatus,
            email: event.target.email.value,
            password: event.target.password.value,
            plan: state.plan

        }).then(

            function ( response ) {

                if( response.data.error ) {

                    setState( function ( prevState ) {

                        return {
    
                            ...prevState,
                            error: true,
                            expiredPlan: false
                        };
    
                    });
                }

                else if ( response.data.expiredPlan ) {

                    setState( function ( prevState ) {

                        return {

                            ...prevState,
                            expiredPlan: true,
                            error: false
                        }
                    })
                }
                
                else {

                    localStorage.setItem( 'authenticated', true );
                    localStorage.setItem( '_id', response.data._id );
                    history.push('/dashboard');
                }
            }
        );
    }

    function changeStatus ( ) {

        setState( function ( prevState ) {

            return {

                ...prevState,
                authStatus: prevState.authStatus === 'Login'
                              ? 'Register' : 'Login'
            }
        })
    }

    function togglePlan ( ) {

        setState( prevState => ({

            ...prevState,
            plan: prevState.plan === 499 ? 999 : 499
        }));
    }

    return (

        <div className = 'Register'>

            <div className = 'left'>

                <img src = { Image } alt = '' />
            </div>

            <div className = 'right'>

                <h1>{ state.authStatus }</h1>

                {

                    (state.error || state.expiredPlan) && <div className = 'error' style= {{ color: 'red' }}>
                    
                        {
                            state.error ? 'Error occured' : 'Plan expired'
                        }
                    </div>
                }

                <form onSubmit = { submitHandler }>

                    {

                        [ 'email','password' ].map( function ( item ) {

                            return <input
                                type = { item }
                                name = { item }
                                placeholder = { item }
                                autoComplete = 'off'
                                required
                            />;
                        })
                    }

                    {
                        state.authStatus === 'Register' && <div className = 'row'>
                        
                            <Button onClick = { togglePlan } colored = { state.plan === 499 }>499 Rs</Button>
                            <Button onClick = { togglePlan } colored = { state.plan === 999 } style = {{ marginLeft: '1rem' }}>999 Rs</Button>
                        </div> 
                    }

                    <div onClick = { changeStatus }>or
                    
                        <span>{

                            state.authStatus === 'Login' ? 'Register' : 'Login'
                        }</span>
                    </div>

                    <button style= {{ color: 'orange' }}>Let's Go</button>
                </form>

                <p style= {{ marginTop: '1.5rem', fontStyle: '1rem' }}>
                    * Choose 499 Rs. for 6 months and 699 Rs. for 1 year
                </p>
            </div>
        </div>
    );
}