export const Servers = {
    'localhost': {
        visible: () =>
            window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost",
        label: 'Development (:8080)',
        http: 'http://127.0.0.1:8080',
        ws: 'ws://127.0.0.1:8080'
    },
    'localhost-2': {
        visible: () =>
            window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost",
        label: 'Development (:8081)',
        http: 'http://127.0.0.1:8081',
        ws: 'ws://127.0.0.1:8081'
    },
    'heroku-1': {
        http: 'https://chess2-api.herokuapp.com',
        ws: 'ws://chess2-api.herokuapp.com',
        label: 'Original (max 50)'
    },
    'dedicated-1': {
        http: 'http://198.84.240.109:8081',
        ws: 'ws://198.84.240.109:8081',
        label: 'Ontario (max 500)'
    }
};

export const ServerUtil = {
    getDefault: () => {
        if ( Servers['localhost'].visible() ) {
            return 'localhost';
        }
        return 'heroku-1';
    }
};
