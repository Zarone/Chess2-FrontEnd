import { serverID, getRoomCount } from "../../dist/helper-js/utils";

interface Server {
    visible: ()=>boolean,
    label: string,
    http: string,
    ws: string,
    limit: number;
}

export const Servers: { [key:string]: Server } = {
    'localhost': {
        visible: () =>
            window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost",
        label: 'Development (:8080)',
        http: 'http://127.0.0.1:8080',
        ws: 'ws://127.0.0.1:8080',
        limit: 75
    },
    'localhost-2': {
        visible: () =>
            window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost",
        label: 'Development (:8081)',
        http: 'http://127.0.0.1:8081',
        ws: 'ws://127.0.0.1:8081',
        limit: 75
    },
    'heroku-1': {
        visible: ()=>true,
        http: 'https://chess2-api.herokuapp.com',
        ws: 'ws://chess2-api.herokuapp.com',
        label: 'Server 1 (max 50)',
        limit: 50,
    },
    'heroku-2': {
        visible: ()=>true,
        http: 'https://chess2-server2.herokuapp.com',
        ws: 'ws://chess2-server2.herokuapp.com',
        label: 'Server 2 (max 75)',
        limit: 75,
    },
    'glitchapi': {
        visible: ()=>true,
        http: 'https://chess2-api.glitch.me',
        ws: 'ws://chess2-api.glitch.me',
        label: "Server 3 (max 50)",
        limit: 75
    },
    'dedicated-1': {
        visible: ()=>true,
        http: 'http://198.84.240.109:8081',
        ws: 'ws://198.84.240.109:8081',
        label: 'Ontario (max 1000)',
        limit: 75,
    }
};

const serverPriority = [ 'localhost', 'heroku-1', 'heroku-2', 'glitchapi' ]

export const ServerUtil = {
    getDefault: async (availableServers: string[]) => {

        for (let i = 0; i < serverPriority.length; i++){
            if ( availableServers.includes(serverPriority[i]) && Servers[serverPriority[i]].visible() && (await getRoomCount(Servers[serverPriority[i]].http)) < Servers[serverPriority[i]].limit*0.8 ){
                return serverPriority[i]
            }
        }

        // in case the only server available is nearly full
        for (let i = 0; i < serverPriority.length; i++){
            if ( Servers[serverPriority[i]].visible() ){
                return serverPriority[i];
            }
        }

    },

    getAvailableServers: async (gradualSetter: ((output: string[])=>Promise<void>) ): Promise<string[]> => {

        let output: string[] = []
        let promises: Promise<any>[] = []
        for (let i = 0; i < serverPriority.length; i++){
            if ( Servers[serverPriority[i]].visible() ){

                promises.push((async ()=>{
                    if ((await getRoomCount(Servers[serverPriority[i]].http) !== false)){
                        output.push(serverPriority[i]);
                        await gradualSetter(output);
                    }
                })())

            }
        }
        await Promise.all(promises);
        return output;

    }
};
