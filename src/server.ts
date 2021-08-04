import http from 'http';
import Debug from 'debug';

import app from './app';

import ServerGlobal from './server-global';

const debug = Debug('node-angular');

const normalizePort = (val: string) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return null;
};

const onError = (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const addr = server.address();
    const bind = typeof addr === 'string' ? ('pipe ' + addr) : ('port ' + port);

    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? ('pipe ' + addr) : ('port ' + port);

    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT);

app.set('port', port);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

// Init global set up
ServerGlobal.getInstance();

ServerGlobal.getInstance().logger.info(`Server is running on port ${process.env.PORT}`);