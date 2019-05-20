import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import DynamicRouteparser from './DynamicRouteParser';
import AppRouter from './Routes/App';

const app : express.Application = express();
const port = process.env.PORT || 4000;

app.use(cors());
if(process.env.NODE_ENV !== 'development') {
    app.use(express.static(__dirname + '/../node_modules/@mockus/client/build/'));
}
app.use( bodyParser.json() );

app.get('/favicon.ico', (req, res) => res.status(204));
app.use("/api", AppRouter);

app.all("/**", (req, res) => {
    new DynamicRouteparser(req, res);
});

app.listen(port, () => console.log(`App listening on: ${port}`));