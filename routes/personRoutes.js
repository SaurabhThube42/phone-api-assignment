const express=require('express');

const personController=require('../controllers/personController');

const router=express.Router();

router.get('/number/:phonenumber',personController.getPersonByPhoneNumber);

router.get('/uuid/:uuid',personController.getPersonByUUID);

router.post('/number/:phonenumber',personController.postPersonByPhoneNumber);

router.put('/uuid/:uuid',personController.putPersonByUUID);

router.delete('/uuid/:uuid',personController.deletePersonByUUID);

module.exports=router;

