const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema  = mongoose.Schema;
// const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email)=>{
	if(!email){
		return false
	}
	else{
		if(email.length < 5 || email.length > 30){
			return false
		}
		else{
			return true;
		}
	}
}
let validaEmailChecker =(email)=>{
	if(!email){
		return false;
	}else{
		const regExp = new 
		RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
return regExp.test(email)

	}
}

let passwordLengthChecker =(password)=>{
	if(!password){
		return false;
	}
	else{
		if( password.length < 5 || password.length > 10){
			return false;
		}
		else{
			return true;
		}
	}
}


let validPassword =(password)=>{
	if(!password){
		return false;
	}
	else{
		const regExp = new RegExp( /^[a-zA-Z0-9!@#$%^&*]{5,10}$/);
		return regExp.test(password)

	}
}
const passwordValidators=[{
	validator: passwordLengthChecker,
	message:'Password must be at least 5 charachters but no more then 10'
},{
	validator: validPassword,
	message :'Password must be valid with at least one specil characters'
}]
let usernameChecker =(username)=>{
	if(!username){
		return false;
	}
	else{
		if( username.length < 3 || username.length >30){
			return false;
		}
		else{
			return true;
		}
	}
}
let validUsername =(username)=>{
	if(!username){
		return false;
	}else{
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(username)
	}
}
const usernamevalidator =[{
	validator: usernameChecker,
	message: 'usernmae must be at least 5 characters but not grater then 30'
},{
	validator:validUsername,
	message: 'username must be valid'
}]

const emailValidators = [{
	validator : emailLengthChecker,
	message:'E-mail must be at least 5 characters but not grater then 30'
},{
	validator : validaEmailChecker,
	message:'Email must be valid formate'
}]


const userSchema = new Schema({
	email:{type:String ,required : true, unique: true, lowercase: true ,validate : emailValidators},
	username:{type:String ,required : true, unique: true, lowercase: true /*,validate : usernamevalidator*/},
	password:{type:String ,required : true/* ,validate:passwordValidators*/}

});
//for password incrept decrpt

// userSchema.pre('save',function(next){
// 	if(!this.isModified('password'))
// 		return next();

// 	bcrypt.hash(this.password,null,null,(err,hash)=>{
// 		if(err) return next(err);
// 		this.password = hash;
// 		next();
// 	});
	
// })
// userSchema.methods.comparePassword = function(password){
// 		return bcrypt.compareSysn(password, this.password);
// 	}
module.exports = mongoose.model('user',userSchema);