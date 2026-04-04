const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('express').json;
const authRoutes = require('./routes/auth');
const billingRoutes = require('./routes/billing');
const { auditMiddleware } = require('./middleware/audit');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(auditMiddleware);

app.get('/health', (req,res)=>res.json({status:'ok'}));
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).json({error:'internal_error'});
});

module.exports = app;
