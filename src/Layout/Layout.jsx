import '../Styles/Global.scss';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../Pages/Home';
import Admin from '../Pages/Admin';
import Dashboard from '../Pages/Dashboard';
import Movie from '../Pages/Movie';

const Themes = {

    dark: {

        background: '#000',
        color: '#fff'
    },

    light: {

        background: '#fff',
        color: '#000'
    }
}

export default function Layout ( ) {

    return (

        <div className = 'Layout'>

            <ThemeProvider theme = { Themes.light }>

                <BrowserRouter>
                
                    <Switch>

                        <Route
                            path = '/'
                            exact
                            component = { Home }
                        />

                        <Route
                            path = '/dashboard'
                            exact
                            component = { Dashboard }
                        />

                        <Route
                            path = '/movie:title'
                            exact
                            component = { Movie }
                        />

                        <Route
                            path = '/admin'
                            exact
                            component = { Admin }
                        />
                    </Switch>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    )
}