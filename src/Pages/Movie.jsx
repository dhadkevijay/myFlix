import { useCallback, useEffect, useState } from "react";
import '../Styles/Movie.scss';
import Image from '../Images/Image.png';
import isAuthenticated from '../Functions/isAuthenticated';
import axios from "../Config/axios";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';

export default function Movie ({match: { params: { title } }}) {

    title = title.replace(':', '');

    const [ state, setState ] = useState({

        notFound: false,
        data: {},
        playing: false,
        playPreview: false,
        playEpisode: false,
        playingEpisode: null,
        url: `http://18.222.131.254:4000/getPreview?title=${ title }`,
        rating: 0,
        loading: true,
        meanRating: 0
    });

    useEffect(

        function ( ) {

            isAuthenticated('user');

            axios.post( '/getMovie', { title, _id: localStorage.getItem('_id') } ).then(

                function ( response ) {

                    if( response.data.error ) setState(
                        
                        {
                            notFound: true,
                            loading: false
                        }
                    );

                    else {

                        setState( prevState => ({
                        
                            ...prevState,
                            notFound:false,
                            data: response.data,
                            rating: response.data.userRating,
                            loading: false
                        }));
                    }
                }
            );
        }, []
    );

    const RenderVideo = useCallback( function ( ) {

        return (
    
            <video onEnded = { playNext } autoPlay controls crossOrigin = "anonymous">

                <source src = { state.url } type= "video/mp4" />
            </video>
        )},
        [ state.url ]
    );

    function playEpisode ( number ) {

        setState( function ( prevState ) {

            return {

                ...prevState,
                playingEpisode: number,
                playEpisode: true,
                playPreview: false,
                playing: true,
                url: `http://18.222.131.254:4000/getEpisode?title=${ title }&episode=${ number }`
            };
        });
    }

    function playNext ( ) {

        if( state.playEpisode && state.playingEpisode < state.data.episodeCount.length ) {

            setTimeout(

                ( ) => playEpisode( state.playingEpisode+1 ), 1000
            )
        }
    }

    function rate ( rating ) {

        console.log( rating )

        setState( prevState => ({

            ...prevState,
            rating
        }));

        axios.post('/addUserRating', {

            title,
            rating: rating,
            _id: localStorage.getItem('_id')

        })
    }

    return state.loading ?

    <div className = 'Loading'>Loading....</div>
    : (

        <section className = 'Movie'>
        
            {

                state.notFound
                  ? <div className = 'notFound'>

                    <h1>Page not found</h1>
                    <img src = { Image } alt = '' />
                </div>
                : <div className = 'content'>

                    {

                        !state.playing
                            ? <div 
                                className = 'background' 
                                style= {{ backgroundImage: `linear-gradient( to bottom, rgba( 0,0,0,0.2 ), rgba( 0,0,0,0.5 ) ), url(${ 'data:image/png;base64,' + state.data.cover })`}}
                            />
                            : <RenderVideo url = { state.url } />
                    }

                    <div className = 'details'>

                        <h1>{ title }</h1>

                        <div className = 'ratingRow'>
                        
                            {

                                [ 1,2,3,4,5 ].map(

                                    item => (item > state.meanRating) ? <StarBorderIcon /> : <StarIcon />
                                )
                            }
                        </div>

                        <span>{ state.data.description }</span>

                        <div className = 'row'>
                        
                            <button
                                onClick = { function ( ) {

                                    setState( function ( prevState ) {

                                        return {
    
                                            ...prevState,
                                            playPreview: true,
                                            playEpisode: false,
                                            playing: true,
                                            url: `http://18.222.131.254:4000/getPreview?title=${ title }`
                                        };
                                    });
                                }}
                            >Preview</button>
                            <button onClick = { playEpisode.bind( null, 1 ) }>Watch</button>
                        </div>

                        {

                            state.data.episodeCount.map(

                                (item, index) => <div className = 'episode'
                                    onClick = { playEpisode.bind( null, index+1 ) }
                                >

                                    <PlayCircleFilledWhiteIcon />
                                    {
                                        state.data.episodeCount.length === 1
                                            ? 'Episode'
                                            : 'Episode ' + item
                                    }
                                </div>
                            )
                        }

                        <div className = 'photos'>
                        
                            {

                                state.data.photos.map(

                                    photo => <img src = { 'data:image/png;base64,' + photo } alt = '' />
                                )
                            }
                        </div>
                    </div>

                    <div className = 'rating'>

                        <p>Rate This !</p>

                        <div className = 'stars'>
                        
                            {
                                [ 1,2,3,4,5 ].map(

                                    item => (item > state.rating)
                                        ? <StarBorderIcon onClick = { rate.bind( null, item ) } style= {{ marginRight: '10px' }} key = { item } />
                                        : <StarIcon onClick = { rate.bind( null, item ) } style= {{ marginRight: '10px' }} key = { item } />
                                )
                            }
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}