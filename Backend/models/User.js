const mongoose = require("mongoose");
const validator = require('validator');
const UserSchema = new mongoose.Schema(
    {
        username: { type: String , required:[true,'Please tell us your username'], unique:true},
        email:{
            type:String,
            required:[true,'Please provide your mail'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'Please provide valid email'],
        },
        password: { type: String, required: [true,'Please enter your password']},
        role: {
            type: String,
            enum: ['Realtor','HQAdmin','BranchAdmin'],
            default: 'Realtor'
        },
        firstName: { type: String },
        surname: { type: String},
        phone: { 
            type: Number,
            maxLength:[11, "Number can't be more than 11 digit"],
            minLength:[11, "Number can't be less than 11 digit"],
            },
        gender: {
            type: String,
            enum: ["Male","Female"],
        },
        address: { type: String},
        dateOfBirth: { type: Date},
        maritalStatus: {
            type: String,
            enum: ["Single", "Married"],
        },
        nationality: { type: String},
        occupation: { type: String},
        branchPlacement: { type: String, required: true},
        accountDetails: [
            {
                bankName: { type: String},
                accountName: { type: String},
                accountNumber: {
                    type: Number,
                    maxLength:[10, "Number can't be more than 11 digit"],
                    minLength:[10, "Number can't be less than 11 digit"],
                }
            }
        ],
        hasSubscribed: { type: Boolean, default: false}
    },
    { timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);