"use strict";
/// <reference path="./types/express.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
// routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes/authRoutes"));
const createNewVacationRoute_1 = __importDefault(require("./routes/vacationsRoutes/createNewVacationRoute"));
const getAllVacationsRoute_1 = __importDefault(require("./routes/vacationsRoutes/getAllVacationsRoute"));
const updateVacationRoute_1 = __importDefault(require("./routes/vacationsRoutes/updateVacationRoute"));
const deleteVacationroute_1 = __importDefault(require("./routes/vacationsRoutes/deleteVacationroute"));
const createNewFollowerRoute_1 = __importDefault(require("./routes/followerRoutes/createNewFollowerRoute"));
const removeFollowerRoute_1 = __importDefault(require("./routes/followerRoutes/removeFollowerRoute"));
const getFollowerQuantityRoute_1 = __importDefault(require("./routes/followerRoutes/getFollowerQuantityRoute"));
const getFollowedVacationsRoute_1 = __importDefault(require("./routes/followerRoutes/getFollowedVacationsRoute"));
const reportRoute_1 = __importDefault(require("./routes/reports/reportRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static('uploads'));
// Init DB
(0, db_1.initDB)();
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/api', createNewVacationRoute_1.default);
app.use('/api', getAllVacationsRoute_1.default);
app.use('/api', updateVacationRoute_1.default);
app.use('/api', deleteVacationroute_1.default);
app.use('/api', createNewFollowerRoute_1.default);
app.use('/api', removeFollowerRoute_1.default);
app.use('/api', getFollowerQuantityRoute_1.default);
app.use('/api', getFollowedVacationsRoute_1.default);
app.use('/api', reportRoute_1.default);
// Health check
app.get('/check', (req, res) => {
    res.send('Server OK');
});
// Don't run server in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
exports.default = app;
