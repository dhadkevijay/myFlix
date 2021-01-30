import { useEffect } from "react";
import Carousel from "../Components/Carousel";
import isAuthenticated from "../Functions/isAuthenticated";

export default function Dashboard ( ) {

    useEffect(

        function( ) {

            isAuthenticated('user');

        }, [ ]
    );

    return (

        <section className = 'Dashboard'

            style = {{

                paddingBottom: '3rem'
            }}
        >

            {

                [ 'romantic', 'comedy', 'documentary', 'horror', 'action' ].map(

                    category => <Carousel heading = { category } />
                )
            }
        </section>
    );
}