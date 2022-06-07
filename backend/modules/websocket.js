var WebSocket = require("ws");
var queryString = require("query-string");

exports.webSocketConig = async (expressServer) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/websockets",
    });

    expressServer.on("upgrade", (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, request);
        });
    });

    websocketServer.on(
        "connection",
        function connection(websocketConnection, connectionRequest) {
            const [_path, params] = connectionRequest?.url?.split("?");
            const connectionParams = queryString.parse(params);

            // NOTE: connectParams are not used here but good to understand how to get
            // to them if you need to pass data with the connection to identify it (e.g., a userId).
            console.log(connectionParams);

            websocketConnection.on("message", (message) => {
                const parsedMessage = JSON.parse(message);
                console.log(parsedMessage);
            });
        }
    );

    return websocketServer;
};