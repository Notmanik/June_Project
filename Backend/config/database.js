import mongoose from 'mongoose';
main()
.then(() => {
    console.log("connected to MonogDb");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/June_Project');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
export default main;