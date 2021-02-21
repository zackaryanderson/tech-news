const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require('./utils/helpers');

// set up handlebars as engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');
//end set up for handlebars engine

//set up cookies
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'super secret secret',
  cookie: { maxAge: 150000 },
  resave: false,
  rolling: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
//end cookie set up

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
}); 