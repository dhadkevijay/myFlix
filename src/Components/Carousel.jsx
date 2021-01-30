import '../Styles/Carousel.scss';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useEffect, useLayoutEffect, useState } from 'react';
import axios from '../Config/axios';
import isAuthenticated from '../Functions/isAuthenticated';
import { Link } from 'react-router-dom';

export default function Carousel ({ heading }) {

    const [ list,setList ] = useState([ ]);

    useEffect(

        function ( ) {

            isAuthenticated('user');

            axios.get(`/getListByCategory?category=${ heading }`).then(

                function ( response ) {

                    setList( response.data );
                }
            );
        },
        [ ]
    );

    useLayoutEffect(

        function ( ) {

            //get the elements

            const slide = document.querySelector('.slide');
            const prevButton = document.querySelector('.prevButton');
            const nextButton = document.querySelector('.nextButton');

            //counter

            let counter = 0, size = 500;

            slide.style.transform = 'translateX(' + ( -size *counter ) + 'px)';

            nextButton.addEventListener( 'click', function ( ) {

                if( counter === 3 ) return;

                slide.style.transition = 'transform 0.4s ease-in-out';
                counter++;
                slide.style.transform = 'translateX(' + ( -size *counter ) + 'px)';
            })

            prevButton.addEventListener( 'click', function ( ) {

                if( counter === 0 ) return;

                slide.style.transition = 'transform 0.4s ease-in-out';
                counter--;
                slide.style.transform = 'translateX(' + ( -size *counter ) + 'px)';
            })

        }, []
    )

    return (

        <div className = 'Carousel'>

            <div className = 'row'>

                <h1>{ heading }</h1>

                <div>
                
                    <button className = 'prevButton'><ArrowBackIcon /></button>
                    <button className = 'nextButton'><ArrowForwardIcon /></button>
                </div>
            </div>

            <div className = 'container'>

                <div className = 'slide'>

                    {

                        list.map(

                            ( item, index ) => <div className = 'item'>
                            
                                <img src = { 'data:image/png;base64,' +item.photo } alt = '' />

                                <span className = 'title'>{ item.title }</span>
                                <div className = 'row'>
                                
                                    <Link to = { '/movie:' + item.title }>
                                        <button>View</button>
                                    </Link>
                                    <span>Rated - { item.rating }</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}