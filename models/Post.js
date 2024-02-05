const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    text:{
        type:String,
         require:true,  
    },
    name:{
        type:String,
    },
    avatar:{
        type:string
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ],
    comment:[
        {
            user:{
          type:Schema.Types.ObjectId,
           ref:'users'

        },
        text:{
            type:String,
            require:true,
        },
        avatar:{
            type:string,
        },
        date:{
            type:Date,
            default:Date.now()
        }

    }
    ],
    date:{
        type:Date,
        default:Date.now()
    }


})