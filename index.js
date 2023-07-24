const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

var postschema = require('./Models/Schema')
mongoose.connect("mongodb://127.0.0.1:27017/Books")
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

//post all books data
app.post("/postbooks",async(req,res)=>{
  const  {title,author,description,publication_year} = req.body;
    var postdata= {
        title:title.toString(),
        author:author.toString(),
        description:description.toString(),
        publication_year:publication_year.toString(),
    }
    const data = new postschema(postdata)
    data.save().then(response=>{
        res.json("Book add successfully");
    }).catch(err=>{
        if(err){
            console.log('error',err)
        }
    })
})


//get all books
app.get("/getbooks",async(req,res)=>{
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try{
        const getalldata = await postschema.find().skip(offset).limit(limit);
        res.json(getalldata);
         }catch(error){
             console.log(error);
         }
})

//get books using id
app.get("/books/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        const book = await postschema.findById(id);
        if(!book){
            res.json("Book not found");
        }
        else{
            res.json(book);
        }
    }catch(error){
        console.log(error);
    }
})

//update books data using id
app.put("/update/:id",async(req,res)=>{
    const {id} = req.params;
  const  {title,author,description,publication_year} = req.body;
  try{
    const book = await postschema.findByIdAndUpdate(
        id,
        {
            title,
            author,
            description,
            publication_year,
        },
        {new:true}
    );
    if(!book){
        res.json("Book not found");
    }
    else{
        res.json("Book Updated successfully");
    }
}catch(error){
    console.log(error);
  }

})

//delete book using id
app.delete("/delete/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        const book = await postschema.findByIdAndDelete(id);
        if(!book){
            res.json("Book not found");
        }
        else{
            res.json("Book deleted successfully");
        }
    }catch(error){
        console.log(error);
    }
})

//get book when we search (titlt,author,description)

app.get('/search',async(req,res)=>{
    const query = req.query.query;
    try{
        const getsearchdata = await postschema.find({
            $or:[
                {title:{$regex:query,$options:'i'}},
                {author:{$regex:query,$options:'i'}},
                {description:{$regex:query,$options:'i'}},
            ],
        });
        res.json(getsearchdata);
    }catch(error){
        console.log(error);
    }
})

app.listen(5000,()=>{
    console.log('Server running on 5000');
})
