// MongoDB Playground
use("test");
db.users.insertOne({ name: "Alice", age: 30 });
db.users.find();