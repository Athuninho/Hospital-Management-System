const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('express').json;
const authRoutes = require('./routes/auth');
const billingRoutes = require('./routes/billing');
const patientRoutes = require('./routes/patients');
const integrations = require('./routes/integrations');
const pharmacyRoutes = require('./routes/pharmacy');
const labRoutes = require('./routes/lab');
const nhifRoutes = require('./routes/nhif');
const { auditMiddleware } = require('./middleware/audit');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(auditMiddleware);

app.get('/health', (req,res)=>res.json({status:'ok'}));
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/integrations', integrations);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/nhif', nhifRoutes);

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).json({error:'internal_error'});
});

module.exports = app;
