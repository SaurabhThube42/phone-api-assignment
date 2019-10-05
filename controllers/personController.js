
const Person=require('../models/personModel');

exports.postPersonByPhoneNumber=(req,res)=>{
    let username=req.body.username;
    let city=req.body.city;
    let phonenumber=req.params.phonenumber;
    const person=new Person(username,city,phonenumber);
    person.save()
    .then(data=>{
        res.status(201).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message
        })
    });

}  

exports.putPersonByUUID=(req,res)=>{
    let username=req.body.username;
    let city=req.body.city;
    let phonenumber=req.body.phonenumber;
    let uuid=req.params.uuid;
    const person=new Person(username,city,phonenumber,uuid);
    person.update()
    .then(data=>{
        res.status(200).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message
        })
    });

}  

exports.getPersonByUUID=(req,res)=>{
    let phonenumber=req.params.uuid;
    Person.retrieveByUUID(phonenumber)
    .then(data=>{
        res.status(200).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message
        })
    });
}

exports.getPersonByPhoneNumber=(req,res)=>{
    let phonenumber=parseInt(req.params.phonenumber,10);
    Person.retrieveByPhoneNumber(phonenumber)
    .then(data=>{
        res.status(200).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message
        })
    });
}

exports.deletePersonByUUID=(req,res)=>{
        let uuid=req.params.uuid;
        Person.delete(uuid)
        .then(data=>{
            res.status(200).send(data);
        })
        .catch(err=>{
            res.status(500).send({
                message: err.message
            })
        });
    }
  