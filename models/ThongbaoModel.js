const mongoose = require("mongoose");

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

module.exports = mongoose.model("ThongbaoDB", ThongbaoDB);