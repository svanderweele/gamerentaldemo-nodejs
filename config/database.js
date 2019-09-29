
var development = process.env.NODE_ENV !== 'production';
if (!development) {
  module.exports = {
    mongoURI:process.env.PROD_MONGODB
  };
} else {
  module.exports = {
      mongoURI:"mongodb://localhost/nodejscrashcoursedb"
  };
}
