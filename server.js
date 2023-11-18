const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('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');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., your HTML, CSS, and images)
app.use(express.static('public'));

// Your API endpoint for processing payments
app.post('/charge', async (req, res) => {
    const amount = req.body.amount;
    const cardToken = req.body.cardToken;
    const cardHolderName = req.body.cardHolderName;

    try {
        // Create a customer
        const customer = await stripe.customers.create({
            source: cardToken,
            name: cardHolderName,
        });

        // Charge the customer
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: 'Payment',
            customer: customer.id,
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

});
