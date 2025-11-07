const express = require('express');
const { createSubscription, webhook, createSimulationPayment } = require('../controllers/payments');

const router = express.Router();

router.post('/subscription', createSubscription);
router.post('/simulation', createSimulationPayment);
router.post('/webhook', webhook);

module.exports = router;