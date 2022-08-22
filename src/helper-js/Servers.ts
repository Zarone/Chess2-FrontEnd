import { serverID, getRoomCount } from "../../dist/helper-js/utils";

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
        label: 'Original (max 50)',
        limit: 50
    },
    'heroku-2': {
        http: 'https://chess2-server2.herokuapp.com',
        ws: 'ws://chess2-server2.herokuapp.com',
        label: 'Backup Server (max 75)'
    },
    'dedicated-1': {
        http: 'http://198.84.240.109:8081',
        ws: 'ws://198.84.240.109:8081',
        label: 'Ontario (max 1000)',
        hidden: true
    }
};

export const ServerUtil = {
    getDefault: async () => {
        if ( Servers['localhost'].visible() ) {
            return 'localhost';
        } else if ( (await getRoomCount(Servers['heroku-1'].http)||Infinity) < Servers['heroku-1'].limit*0.8 ){
            return 'heroku-1';
        } else {
            return 'heroku-2'
        }
    }
};
