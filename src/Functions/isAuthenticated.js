export default function isAuthenticated ( client ) {

    switch( client ) {

        case 'user':

            if( localStorage.getItem('authenticated') !== 'true' ) {

                window.location.href = '/';
            }

            return;

        case 'admin':

            if( localStorage.getItem('isAdmin') !== 'true' ) {

                window.location.href = '/admin';
            }

            return;

        default: return;
    }
}