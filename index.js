const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
server.db = router.db;

const middleWares = jsonServer.defaults();

const port = 8000;

const whitelist = [
  'http://localhost', 
  'http://localhost:8000',
  'http://localhost:3000',
  'https://glitch.com',
  'https://amy-hub.github.io'
];

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: 'accept, content-type, authorization'
};

server.use(cors(corsOptions));
server.use(middleWares);

server.get('/echo', (req, res) => {
    res.jsonp(req.query)
  });

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next();
})

server.use(router);
server.listen(port);