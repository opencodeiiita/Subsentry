import cors from 'cors';
import express from 'express';
import subscriptionRoutes from './routes/subscription.routes.js';
import attachUser from './middleware/attachUser.js';
import { Subscription } from './models/Subscription.js'; // ✅ CHANGED: Use named import with {}

const app = express();

app.use(cors());
app.use(express.json());


app.use(attachUser);



app.get('/', (_, res) => {
  res.send('SubSentry API running');
});

// PATCH route
app.patch('/api/subscriptions/:id', async (req, res) => {
  try {
    console.log('🔵 PATCH route executing...');
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      console.log('❌ No userId - returning 401');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('✅ User authenticated:', userId);
    console.log('📦 Request body:', req.body);

    const updates = req.body;
    delete updates.userId;
    delete updates._id;

    console.log('🔄 Executing update...');

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedSubscription) {
      console.log('❌ Subscription not found');
      return res.status(404).json({ error: 'Subscription not found' });
    }

    console.log('✅ Update successful!');
    res.json({ 
      message: 'Subscription updated successfully',
      subscription: updatedSubscription 
    });
  } catch (error) {
    console.error('❌ Error in PATCH:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE route
app.delete('/api/subscriptions/:id', async (req, res) => {
  try {
    console.log('🔵 DELETE route executing...');
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      console.log('❌ No userId - returning 401');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('✅ User authenticated:', userId);

    const deletedSubscription = await Subscription.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!deletedSubscription) {
      console.log('❌ Subscription not found');
      return res.status(404).json({ error: 'Subscription not found' });
    }

    console.log('✅ Delete successful!');
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/subscriptions', subscriptionRoutes);

export default app;
