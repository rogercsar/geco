const express = require('express');
const { createSubscription, webhook } = require('../controllers/payments');

const router = express.Router();

router.post('/subscription', createSubscription);
router.post('/webhook', webhook);

module.exports = router;