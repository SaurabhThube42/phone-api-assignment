
const express=require('express');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const personRoutes=require('./routes/personRoutes');

app.use('/api/person',personRoutes);

app.use('/',(req,res)=>{
    res.status(404).send({message:"resource does not exist! Check api URL"});
});


app.listen(3000);
