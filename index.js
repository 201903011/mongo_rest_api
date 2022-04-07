const express = require('express')
const app = express()
const port = 3000

var mongoose = require('mongoose') ;

app.use(express.json()); //this is the build in express body-parser 
app.use(                //this mean we don't need to use body-parser anymore
  express.urlencoded({
    extended: true,
  })
); 

mongoose.connect("mongodb://localhost:27017/rahulExp10",{
		useNewUrlParser: true, useUnifiedTopology: true
	}

).then(() => {
	console.log("connection successful");
}).catch( (error) =>{
	console.log(error);
})

const students = mongoose.model('student',new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    rollno: {
        type: Number,
        required: true,
        unique : true
    },
    branch: {
        type: String,
        required : true,
    },
   
}));

app.get('/', (req, res) => res.send('Mongo Express restful api'))

app.get('/students', async (req, res) => {
    const all_stude = await students.find() ;
    console.log(all_stude) ;
    res.send(all_stude);
})

app.get('/students/:uid', async (req, res) => {
    const all_stude = await students.find({"rollno" : req.params.uid }) ;
    if(all_stude.length == 0){
        res.send("Id not found");
    }
    console.log(all_stude) ;
    res.send(all_stude);
})

app.post('/create', async (req, res) => {
    //res.send(req.body);
    try{
    var newstud = new students(); 
    
    newstud.name    = req.body.name ;
    newstud.rollno  = parseInt(req.body.rollno) ;
    newstud.branch  = req.body.branch;

    await newstud.save() ;
    res.send("saved");

    }catch (error) {
        
        res.send("Rollno already taken" );
    }
    
    res.send("the user with rollno is saved");
})

app.put('/update', async (req, res) => {

    try{
    
    const filter = { rollno : parseInt(req.body.rollno) }
	const update = { branch : req.body.branch}

    await students.findOneAndUpdate(filter,update)

    res.send("update");

    }catch (error) {
        
        res.send("Rollno is not found" );
    }
    
    res.send("the user with rollno is saved");
})

app.delete('/delete', async (req, res) => {

    try{
    
    const filter = { rollno : parseInt(req.body.rollno) }

    await students.deleteOne(filter)
    
    res.send("delete");

    }catch (error) {
        
        res.send("Rollno is not found" );
    }
    
    res.send("the user with rollno is saved");
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))