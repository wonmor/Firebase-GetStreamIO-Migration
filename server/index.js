const admin = require("firebase-admin");
const StreamChat = require("stream-chat").StreamChat;
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Firebase-GetStreamIO Chat Server");
});

app.post('/chat/addAllFirebaseUsersToStream', async (req, res) => {
  try {
      const serviceAccount = req.body.serviceAccount;
      const streamApiKey = req.body.streamApiKey;
      const streamApiSecret = req.body.streamApiSecret;
      
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
      });

      const serverClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

      // Get list of all users from Firebase
      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users.map(user => ({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL || null,
      }));
      
      // Get list of all users from Stream
      const response = await serverClient.queryUsers({});
      const streamUsers = response.users;
      
      // Filter out users that already exist in Stream
      const newUsers = users.filter(user => !streamUsers.some(streamUser => streamUser.id === user.id));
      
      // Add new users to Stream
      if (newUsers.length > 0) {
          await serverClient.upsertUsers(newUsers);
      }

      res.status(200).send({ message: 'Users added successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
}); 


app.listen(8080, () => {
    console.log('Listeing on port 8080');
});