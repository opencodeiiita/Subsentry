const express = require('express');
const router = express.Router();
const { addSubscription, getSubscriptions } = require('../controllers/Api');


router.get('/subscriptions', getSubscriptions )
router.post('/subscriptions',addSubscription )


module.exports = router;