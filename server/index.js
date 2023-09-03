const admin = require("firebase-admin");
const StreamChat = require("stream-chat").StreamChat;
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET,
);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("UC Irvine ClassFinder Stream Helper is Running");
});

app.post('/chat/createStreamUser', async (req, res) => {
  const user = req.body;
  try {
    const response = await serverClient.upsertUser({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/chat/addAllFirebaseUsersToStream', async (req, res) => {
    try {
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
      res.status(500).send(err);
    }
  });  

app.listen(8080, () => {
    console.log('Listeing on port 8080');
});