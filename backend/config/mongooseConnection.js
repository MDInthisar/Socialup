import mongoose from "mongoose";

const mongoConnect = async ()=>{

    try{
        const conn = await  mongoose.connect(process.env.MONGODB_URI)
        console.log(`MONGODB CONNECTED ${conn.connection.host}`);
    }catch(error){
        console.log(error);
        process.exit(1)
        
    }
}

export default mongoConnect;

