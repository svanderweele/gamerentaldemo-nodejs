
var development = process.env.NODE_ENV !== 'production';
if (!development) {
  module.exports = {
    mongoURI:
      "mongodb://Simon:mypassword123@cluster0-shard-00-00-n4iai.gcp.mongodb.net:27017,cluster0-shard-00-01-n4iai.gcp.mongodb.net:27017,cluster0-shard-00-02-n4iai.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
  };
} else {
  module.exports = {
      mongoURI:"mongodb://localhost/nodejscrashcoursedb"
  };
}
