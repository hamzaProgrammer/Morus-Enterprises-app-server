const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config({
    path: './config.env'
})
require('./db/conn')
var port = process.env.PORT || 8080;

app.use(bodyParser.json({
    limit: '30mb',
    extended: true
}))
app.use(bodyParser.urlencoded({
    limit: '30mb',
    extended: true
}))
app.use(cors())

app.use(express.static('public'));

app.use('/siteAdvancePics', express.static('siteAdvancePics'));


app.use(express.json())

// adding routes
app.use(require('./routes/AdminsRoutes'))
app.use(require('./routes/SiteRoutes'))
app.use(require('./routes/ManagerRoutes'))
app.use(require('./routes/WorkersRoutes'))
app.use(require('./routes/AttendencesRoutes'))
app.use(require('./routes/SiteAdvaanceRoutes'))
app.use(require('./routes/MealChargesRoutes'))
app.use(require('./routes/AgentRoutes'))
app.use(require('./routes/SiteCashRegisterRoutes'))
app.use(require('./routes/SiteMealChargesRoutes'))



app.listen(process.env.PORT || 8080, (req, res) => {
    console.log(`Express Server Running at ${port}`)
})