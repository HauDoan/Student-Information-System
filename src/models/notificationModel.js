import mongoose from 'mongoose'

const ThongbaoDB = new mongoose.Schema(
    {
        title: {
            type: String
            
        },
        text: {
            type: String  
        },
        user: {
            type: Object,
           
            name: 
            {
                tpye: String
            },
        },
         createdAt:
         {
             type: String
         },
 
    });

export default mongoose.model("ThongbaoDB", ThongbaoDB);