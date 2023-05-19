export interface Group {
    name: String;
    connections: Connection[];
}
export interface Connection {
    connectionId: String;
    username: String;
}