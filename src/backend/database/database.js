const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const ObjectID = require('mongodb').ObjectID;
const dbName = 'tvastra';

const client = new MongoClient(url,{useUnifiedTopology:true});
console.log("the db file is running");

const insertOne = function(namespace,doc){
  namespace.insertOne(
    doc, 
    function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
      });
}
const updateOne = function(namespace,query,dc){
    namespace.updateOne(query,{
        $set:dc
    },function(err,r){
        assert.equal(null,err);
        assert.equal(1,r.matchedCount);
    });
}
const updateMany = function(namespace,query,doc){
    namespace.updateMany(query,{
        $set:{"specialization":{
            "doctorProfile":'Convallis sed mattis nibh nostra. Ut praesent donec quia ac, lacinia nunc pede scelerisque cras pede, et at cras tristique lorem lorem donec. Adipiscing fusce elit dolor non. Tortor orci sit nonummy, ut pede phasellus elit nascetur dolorem tellus. Odio eu, pharetra tellus mollis ipsum pretium, nulla dictumst nulla sed aliquet.'
        }}
    },function(err,r){
        assert.equal(null,err);
        console.log("deleted");
        client.close();
    })
}
// console.log(new ObjectID().getTimestamp());
const deleteDoc = function(namespace,query){
    namespace.deleteMany(query,function(err,r){
        assert.equal(null,err);
        console.log("deleted successfully");
        client.close();
    });
}
module.exports = {
    dbName,
    client,
    // createConnection,
    insertOne,
    updateOne,
    deleteDoc
    // doctors
};
// doc = {   
//     // name:"John Nission",
//     specialization:{
//         doctorProfile:`Lorem dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:""
//     },
//     listOfTreatments:{
//         doctorProfile:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:""
//     },
//     workExperience:{
//         doctorProfile:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:`3 years of Experience`
//     },
//     qualification:{
//         doctorProfile:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:"MBBS, MD"
//     },
//     awards:{
//         doctorProfile:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:"MBBS"
//     },
//     location:{
//         doctorProfile:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
//         doctorPage:"Greater Noida"
//     },
//     avgFees:`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`
// }

// const createConnection = function(){
//     return client.connect(function(err, client){
//         assert.equal(null,err);
//         console.log("connected correctly to server");
//         // const db = client.db(dbName);
//         console.log("db inside client.connect() callback "+db);
//         return client;
//     });
// }
// client.connect(function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");

//   const db = client.db(dbName);
//   const collection = "doctors";
//   const namespace = db.collection(collection);
 
// //   insertOne(namespace,doc);
// //   insertOne(namespace,doc);
//     namespace.findOne({name:"John Nission"},{_id:1},function(err,res){
//         assert.equal(null,err);
//         console.log(res);
//         updateOne(namespace,{_id:new ObjectID(res._id.toString())},doc);
//     });
//     // deleteDoc(namespace,{_id:new ObjectID("5e8619a44c116d329bebad95")});
// //   client.close();  
// });
// async function clien(){
//     const clnt = await createConnection();
//     return clnt;
// }
// const d = clien().db(dbName);
// console.log("db outside client.connect() callback "+clien());
// const collection = "doctors";
// const d = clien().db(dbName);
// const namespace = d.collection(collection);
// // update(namespace,{name:"John Nission"},doc);
// client.connect(function(err,client){
//     assert.equal(null,err);
//     console.log("connected correctly to server");
//     const db = client.db(dbName);
//     const collection = 'doctors';
//     const namespace = db.collection(collection);
//     namespace.find(function(err,r){
//         assert.equal(null,err);
//         updateMany(namespace,{});
//     })
//     namespace.find().toArray(function(err,r){
//         assert.equal(null,err);
//         // updateOne(namespace,{name:"John Nission"},doc);
//         // deleteDoc(namespace,{});
//         console.log(r);
//     })
// })
// const update = function(){
//         client.connect(function(err,client){
//             assert.equal(err,null);
//             var doctorCol = client.db(dbName).collection('doctors');
//             doctorCol.find({}).toArray(function(err,doctors,next){
//                 assert.equal(err,null);
//                 doctors.forEach(doc => {
//                     client.db(dbName).collection('users').updateOne({name:doc.name},{$set:{
//                         doctor:{
//                             about:doc.about,
//                             speciality:doc.speciality,
//                             treatmentList:doc.treatmentList,
//                             hospitalList:doc.hospitalList,
//                             awards:doc.awards,
//                             qualification:doc.qualification,
//                             location:doc.location,
//                             achievements:doc.achievements,
//                             yearsOfExperience:doc.yearsOfExperience,
//                             avgFees:doc.avgFees
//                         }
//                     }});
//                 });
//             });
//             client.db(dbName).collection('users').find({}).toArray(function(err,res,next){
//                 console.log(res);
//             })
//         })
//     }
    
// client.connect(function(err,client){
//     client.db(dbName).collection('users').deleteOne({name:"John Nission"});
//     client.db(dbName).collection('users').find({}).toArray(function(err,result,next){
//         console.log(result);
//     })
//     client.db(dbName).collection('users').insertOne({
//         name: 'John Nission',
//     email: 'johnnission974@gmail.com',
//     password: 'john123',
//     gender: 'male',
//     dob: '1990-03-12',
//     mobileNumber: '919511149374',
//     city: 'San Diego',
//     state: 'California',
//     country: 'USA',
//     doctor: {
//       about: 'Lorem ipsum dolor sit amet, amet nisl leo posuere in, hendrerit arcu libero mauris vitae risus at, nulla dis amet curabitur est blandit, suscipit conubia, amet vestibulum at egestas porttitor lacus maecenas. Vestibulum massa recusandae tempus ante, neque fusce, pellentesque turpis mi feugiat bibendum quam laoreet. Ante pulvinar sed vestibulum, lacus aenean mollis vel, est odio eros vel volutpat tempor, habitasse leo sit semper commodo accumsan quisque, quis lorem arcu. Nulla elit ac',
//       speciality: 'Radiology,Cardiology',
//       treatmentList: 'Surgery,Chemotherapy',
//       hospitalList: 'AIIMS,Rockland Hospital',
//       awards: 'best',
//       qualification: 'MBBS,MD',
//       location: 'Greater Noida',
//       achievements: '100+ successful surgeries',
//       yearsOfExperience: '30',
//       avgFees: '5000'
//     },
//     colony: '',
//     house: '',
//     timezone: '',
//     imgAddress: '../assets/johnNission.jpg',
//     id: '01129'
//     })
//     client.db(dbName).collection('users').
// })
//         .then(john=>{
//             console.log(john);
//         })
// update();
// const update = function (){
//     client.connect(function(err,client){
//         client.db(dbName).collection('users').updateOne({name:"John Nission"},{$set:{
//             doctor:{
//                 about : "Lorem ipsum dolor sit amet, amet nisl leo posuere in, hendrerit arcu libero mauris vitae risus at, nulla dis amet curabitur est blandit, suscipit conubia, amet vestibulum at egestas porttitor lacus maecenas. Vestibulum massa recusandae tempus ante, neque fusce, pellentesque turpis mi feugiat bibendum quam laoreet. Ante pulvinar sed vestibulum, lacus aenean mollis vel, est odio eros vel volutpat tempor, habitasse leo sit semper commodo accumsan quisque, quis lorem arcu. Nulla elit ac",
//                 speciality : "Radiology,Cardiology",
//                 treatmentList : "Surgery,Chemotherapy",
//                 hospitalList : "AIIMS,Rockland Hospital",
//                 awards : "best",
//                 qualification : "MBBS,MD",
//                 location : "Greater Noida",
//                 achievements : "100+ successful surgeries",
//                 yearsOfExperience : "30",
//                 avgFees : "5000",
//             }
//         }});
//         client.db(dbName).collection('users').findOne({name:"John Nission"})
//         .then(john=>{
//             console.log(john);
//         })
//     })
// }
// update();
