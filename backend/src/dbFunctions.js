const Users = require('./models/Users')
const Pharmacy = require('./models/Pharmacy')
const Medicines = require('./models/Medicines')
const Posts = require('./models/Posts')
const Medicalnotes = require('./models/Medicalnotes')
const Problem = require('./models/Problems')
const Box = require('./models/Box')
const Notes = require('./models/Notes')
const MedReminder = require('./models/MedicineReminder')
const ApoReminder = require('./models/AppointmentReminder')
const Service = require('./models/MedicalserviceReminder')
const Medicalservices = require('./models/Medicalservices')

module.exports={
    find_medical_services:(query)=> Medicalservices.find(query),

    find_problem:(query)=> Problem.find(query),
    findOne_problem:(query)=> Problem.findOne(query),

    new_member:(data)=>new Users(data),
    find_member:(query)=> Users.find(query),
    findOne_member:(query)=> Users.findOne(query),
    findOneAndUpdate_member:(query,update,option={returnNewDocument:true})=> Users.findOneAndUpdate(query,update,option),

    new_med:(data)=>new Pharmacy(data),
    find_med:(query)=> Pharmacy.find(query), 
    findOne_med:(query)=> Pharmacy.find(query),   
    delete_med:(query)=>Pharmacy.findOneAndRemove(query),
    findOneAndUpdate_med:(query,update,option={returnNewDocument:true})=> Pharmacy.findOneAndUpdate(query,update,option),

    new_post:(data)=>new Posts(data),
    find_post:(query)=> Posts.find(query),
    findOne_post:(query)=> Posts.findOne(query),
    findOneAndUpdate_post:(query,update,option={returnNewDocument:true})=> Posts.findOneAndUpdate(query,update,option),
    delete_post:(query)=>Posts.findOneAndRemove(query),
    
    new_medicalnote:(data)=>new Medicalnotes(data),
    delete_note:(query)=>Medicalnotes.findOneAndRemove(query),
    findOneAndUpdate_note:(query,update,option={returnNewDocument:true})=> Medicalnotes.findOneAndUpdate(query,update,option),
    find_note:(query)=> Medicalnotes.find(query), 
    findOne_note:(query)=> Medicalnotes.find(query),   

    new_med_personal:(data)=>new Medicines(data),
    find_med_personal:(query)=> Users.find(query),  
    delete_med_personal:(query)=>Medicines.findOneAndRemove(query),
    findOneAndUpdate_med_personal:(query,update,option={returnNewDocument:true})=> Medicines.findOneAndUpdate(query,update,option),

    new_box_personal:(data)=>new Box(data),
    find_box_personal:(query)=> Box.find(query), 
    delete_box_personal:(query)=>Box.findOneAndRemove(query),
    findOne_box:(query)=> Box.find(query),   
    findOneAndUpdate_box_personal:(query,update,option={returnNewDocument:true})=> Box.findOneAndUpdate(query,update,option),

    new_note_personal:(data)=>new Notes(data),
    delete_note_personal:(query)=>Notes.findOneAndRemove(query),
    findOneAndUpdate_note_personal:(query,update,option={returnNewDocument:true})=> Notes.findOneAndUpdate(query,update,option),

    new_medrem_personal:(data)=>new MedReminder(data),
    find_medrem_personal:(query)=> MedReminder.find(query), 
    delete_med_reminder_personal:(query)=>MedReminder.findOneAndRemove(query),
    findOneAndUpdate_med_reminder_personal:(query,update,option={returnNewDocument:true})=> MedReminder.findOneAndUpdate(query,update,option),

    new_aporem_personal:(data)=>new ApoReminder(data),
    find_aporem_personal:(query)=> ApoReminder.find(query), 
    delete_apo_reminder_personal:(query)=>ApoReminder.findOneAndRemove(query),
    findOneAndUpdate_apo_reminder_personal:(query,update,option={returnNewDocument:true})=> ApoReminder.findOneAndUpdate(query,update,option),


    new_servicerem_personal:(data)=>new Service(data),
    find_servicerem_personal:(query)=> Service.find(query), 
    delete_srevice_reminder_personal:(query)=>Service.findOneAndRemove(query),
    findOneAndUpdate_service_reminder_personal:(query,update,option={returnNewDocument:true})=> Service.findOneAndUpdate(query,update,option),

}