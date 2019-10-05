const fs=require('fs');
const path = require('path');

// const uuidGenerator=require('uuid');

const dynamoDB=require('../awsDynamoDB');
const redis=require('../redisClient');

class Person{
    constructor(username,city,phonenumber,uniformIdentifier){
        this.username=username;
        this.city=city;
        this.phonenumber=parseInt(phonenumber,10);
        this.uniformIdentifier=uniformIdentifier||`userID${this.username}${this.phonenumber}`;
    }

    save(){
        return new Promise((resolve,reject)=>{
            var item={
                TableName: "Person",
                Item:{
                    "username":this.username,
                    "city":this.city,
                    "phonenumber":this.phonenumber,
                    "uniformIdentifier":this.uniformIdentifier
                },
                ConditionExpression:"attribute_not_exists(uniformIdentifier)"
            };
            dynamoDB.put(item,err=>{
                if(err){
                    if (err.message==='The conditional request failed')
                        err.message=`Item of phonenumber ${this.phonenumber} and username ${this.username} already exists`;
                    reject(err);
                }
                else{
                    redis.del(this.phonenumber);
                    redis.setex(this.uniformIdentifier,20,JSON.stringify(this));
                    resolve(this);
                }

            })

        });
    }

    update(){
        return new Promise((resolve,reject)=>{
            var getPreviousItem={
                TableName:"Person",
                Key:{
                    "uniformIdentifier":this.uniformIdentifier
                }
            }
            const oldPerson=new Person();
            dynamoDB.get(getPreviousItem).promise().
            then(data=>{
                oldPerson.phonenumber=data.Item.phonenumber;
                oldPerson.city=data.Item.city;
                oldPerson.username=data.Item.username;

                var item={
                    TableName: "Person",
                    Key:{
                        "uniformIdentifier":this.uniformIdentifier
                    },
                    UpdateExpression:'set username = :username, city = :city, phonenumber = :phonenumber',
                    ExpressionAttributeValues: {
                        ":username": this.username || oldPerson.username,
                        ":city": this.city || oldPerson.city,
                        ":phonenumber":this.phonenumber || oldPerson.phonenumber
                    },
                    ConditionExpression:"attribute_exists(uniformIdentifier)",
                    ReturnValues:"ALL_NEW"
                };
                
                dynamoDB.update(item,(err,data)=>{
                    if(err){
                        console.log(err);
                        if (err.message==='The conditional request failed')
                            err.message=`No item with uuid ${this.uniformIdentifier} exists`;
                        reject(err);
                    }
                    else{
                        redis.del(this.uniformIdentifier);
                        redis.del(data.Attributes.phonenumber);
                        redis.setex(this.uniformIdentifier,20,JSON.stringify(data.Attributes));
                        resolve(data.Attributes);
                    }
                });

            })
            .catch(err=>{
                reject(err);
            });

        });
    }

    static retrieveByUUID(uniformIdentifier){
        return new Promise((resolve,reject)=>{
            redis.get(uniformIdentifier,(err, reply)=>{
                if(reply){
                    redis.setex(uniformIdentifier,20,reply);
                    resolve(JSON.parse(reply));
                }
                else{
                    var item={
                        TableName: "Person",
                        Key:{
                            "uniformIdentifier":uniformIdentifier
                        }
                    };
                    dynamoDB.get(item,(err,data)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            redis.setex(uniformIdentifier,20,JSON.stringify(data.Item));
                            resolve(data.Item);
                        }
                    });  
                }
            });
        });
    }

    static retrieveByPhoneNumber(phonenumber){
        return new Promise((resolve,reject)=>{
            redis.get(phonenumber,(err,reply)=>{
                if(reply){
                    redis.setex(phonenumber,20,reply);
                    resolve(JSON.parse(reply));
                }
                else{
                    var item={
                        TableName: "Person",
                        IndexName: "phone_index",
                        KeyConditionExpression: "phonenumber = :phonenumber",
                        ExpressionAttributeValues: {
                            ":phonenumber": phonenumber
                        }
                    };
                    dynamoDB.query(item,(err,data)=>{
                        if(err){
                            reject(err);
                        }
                        else{
                            redis.setex(phonenumber,20,JSON.stringify(data.Items));
                            resolve(data.Items);
                        }
                    });

                }
            });
            
        });
    }

    static delete(uniformIdentifier){
        return new Promise((resolve,reject)=>{
            var item={
                TableName: "Person",
                Key:{
                    "uniformIdentifier":uniformIdentifier
                },
                ConditionExpression:"attribute_exists(uniformIdentifier)",
                ReturnValues:"ALL_OLD"
            };
            dynamoDB.delete(item,(err,data)=>{
                if(err){
                    if (err.message==='The conditional request failed')
                        err.message=`No item with uuid ${this.uniformIdentifier} exists for deletion`;
                    reject(err);
                }
                else{
                    redis.del(uniformIdentifier);
                    redis.del(data.Attributes.phonenumber);
                    resolve({"deletedItem":data});
                }
            });

        });
    }

}

module.exports=Person;