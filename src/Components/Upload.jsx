import '../Styles/Upload.scss';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Image from '../Images/Image.png';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import axios from '../Config/axios';

export default function Upload ( ) {

    const [ state, setState ] = useState({

        type: 'movies',
        category: 'romantic',
        uploading: false
    });

    const title = useRef( ), files = useRef( ), indicator = useRef( );

    function submitHandler ( event ) {

        event.preventDefault( );

        if( title.current.value === '' ) return;

        setState( function ( prevState ) {

            return {

                ...prevState,
                uploading: true
            };
        });

        const fileList = Object.values( files.current.files );

        if( fileList.length === 0 ) return;

        const formData = new FormData( );
 
        for( var i=0; i< fileList.length; i++ ) {

            formData.append( `file` + i, fileList[i] );
        }

        formData.append( 'title', title.current.value );
        formData.append( 'type', state.type );
        formData.append( 'category', state.category );

        axios.post( '/admin/upload', formData, {

            headers: {

                'Content-Type': 'multipart/form-data'
            },

            onUploadProgress: function ( progressEvent ) {

                console.log('Uploading');
                console.log( parseInt(
                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                ) )

                indicator.current.style.width = `${parseInt(
                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )} %`
            }
        }).then(

            function ( ) {

                setState( function ( prevState ) {

                    return {

                        ...prevState,
                        uploading: false
                    }
                })
            }
        );
    }

    const Button = styled.button`
    
        background: ${

            function ( props ) {

                return props.selected ? 'orange !important' : 'transparent';
            }
        };

        color: ${

            function ( props ) {

                return props.selected ? 'white !important' : 'black';
            }
        };
    `;

    function select ([ field, value ]) {

        if( field === 'type' ) {

            setState( function ( prevState ) {

                return {

                    ...prevState,
                    type: value
                };
            });

            return;
        }

        setState( function ( prevState ) {

            return {

                ...prevState,
                category: value
            };
        });
    }

    return (

        <form className = 'Upload'>

            <div className = 'uploadStatus'>
                <span ref = { indicator }></span>
            </div>

            <div className = 'left'>

                <img src = { Image } alt = '' />
            </div>
            <div className = 'right'>

                <div className = 'wrapper'>

                    <h1>Description</h1>

                    <div className = 'row'>

                        {

                            [ 'movies','series' ].map(

                                item => <Button
                                    selected = { item=== state.type }
                                    onClick = { select.bind( null, [ 'type',item ]) }
                                >{ item }</Button>
                            )
                        }
                    </div>

                    <div className = 'row'>

                        {

                            [ 'romantic', 'horror', 'documentary', 'comedy', 'action' ].map(

                                item => <Button
                                    selected = { item=== state.category }
                                    onClick = { select.bind( null, [ 'category',item ]) }
                                >{ item }</Button>
                            )
                        }
                    </div>

                    <input
                        placeholder = 'title'
                        name = 'title'
                        type = 'text'
                        required
                        ref = { title }
                        autoComplete = 'off'
                    />

                    <label htmlFor = 'file'>Select Folder</label>
                    <input
                        type = 'file'
                        multiple
                        directory=""
                        webkitdirectory=""
                        moxdirectory=""
                        required
                        ref = { files }
                        id = 'file'
                    />
                </div>
            </div>

            <div
                className = 'bar'
                style= {{ display: state.uploading ? 'block': 'none' }}
            > Uploading </div>

            <button
                className = 'circle'
                onClick = { submitHandler }
                type = 'submit'
            >
            
                <ArrowForwardIcon />
            </button>
        </form>
    );
}