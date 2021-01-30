import { useRef, useState } from "react";
import Upload from "../Components/Upload";
import Image from '../Images/Image.png';
import '../Styles/Admin.scss';

export default function Admin ( ) {

    const [ state, setState ] = useState({

        authenticated: localStorage.getItem('isAdmin') === 'true'
                          ? true : false
    })

    const password = useRef( );

    function authenticate ( ) {

        if( password.current.value === 'dlowbeatbox' ) {

            setState( function ( prevState ) {

                localStorage.setItem( 'isAdmin', true );

                return {

                    ...prevState,
                    authenticated: true
                };
            })
        }
    }

    return (

        <section className = 'Admin'>

            {

                state.authenticated
                  ? <Upload />
                  : <div className = 'image'>

                      <img src = { Image } alt = '' />

                      <input
                          placeholder = 'password'
                          type = 'password'
                          required
                          name = 'password'
                          ref = { password }
                          onKeyPress = { authenticate }
                      />
                  </div>
            }
        </section>
    );
}