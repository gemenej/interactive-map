# Interactive Map Dashboard

This is an Angular application that provides an interactive map dashboard. The dashboard includes controls and uses services for signals, web sockets, and Leaflet.

## Installation 

First, clone the repository to your local machine:

```bash
git clone https://github.com/gemenej/interactive-map.git
```
## Backend 

To install the necessary dependencies, Navigate to nodesocket, then run the following command:

```bash
cd nodesocket
npm install
```
## Usage

To start the WebSocket server and the Express server simultaneously, run the following command:

```bash
npm start
```
This will start both servers at the same time.

## Dependencies

This project uses the following dependencies:

- `cors`: Used to enable Cross-Origin Resource Sharing (CORS).
- `express`: Used to create the Express server.
- `faker`: Used to generate fake data for testing.
- `moment`: Used to handle dates and times.
- `ws`: Used to create the WebSocket server.

## Frontend

Then, navigate to the project directory and install the dependencies:

```bash
cd frontend
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Features

- Interactive map
- Dashboard with controls
- Signal service for managing signal data
- WebSocket service for real-time data
- Leaflet service for managing map data

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](contributing.md) first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
