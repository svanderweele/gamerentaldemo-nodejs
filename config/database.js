if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://Simon:mypassword123@cluster0-n4iai.gcp.mongodb.net/test?retryWrites=true&w=majority"
  };
}else{
    module.exports = {
        mongoURI:"mongodb://localhost/nodejscrashcoursedb"
    };
}
