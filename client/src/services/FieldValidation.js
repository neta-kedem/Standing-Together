export default class FieldValidation {
    fields = [];
    tests = [];
    setFields(f){
        this.fields = f;
        let tests = [];
        for(let i = 0; i < f.length; i++){
            tests[f[i].name] = (val) => {
                if(!val && !f[i].required)
                    return true;
                if(!val && f[i].required)
                    return false;
                return f[i].validation.test(val)
            }
        }
        this.tests = tests;
    }
    validate(value, field){
        const test = this.tests[field];
        const fieldVal = value;
        if(test !== null && test !== undefined && typeof fieldVal === "function"){
           return test(fieldVal);
        }
        return true;
    }
    validateAll(activists){
        for(let i=0; i<activists.length; i++){
            for(let j=0; j<this.fields.length; j++){
                const type = this.fields[j].type;
                const required = this.fields[j].required;
                const fieldVal = activists[i][this.fields[j].name] || null;
                //return false if the value is required, but missing
                const missingRequiredValue = (required && (!fieldVal || fieldVal === "" || (fieldVal === 0 && type === "select")));
                if(missingRequiredValue){
                    activists[i][this.fields[j].name+"Valid"] = false;
                    return false
                }
                //if this is true, it means that the value is missing (null, 0, "", etc.), and that's ok (i.e. the value isn't required).
                const validMissingValue = (!required && (!fieldVal || fieldVal === "" || (fieldVal === 0 && type === "select")));
                //if the field is outright invalid - return false
                if(activists[i][this.fields[j].name+"Valid"] === false && !validMissingValue){
                    return false;
                }
                //if the field wasn't checked yet - check it, and return false if it turns out to be invalid
                if(!activists[i][this.fields[j].name+"Valid"]){
                    const test = this.fields[j].validation;
                    if(test !== null && test !== undefined){
                        const valid = test.test(fieldVal) || validMissingValue;
                        if(!valid){
                            activists[i][this.fields[j].name+"Valid"] = false;
                            return false;
                        }
                        else{
                            activists[i][this.fields[j].name+"Valid"] = true;
                        }
                    }
                }
            }
        }
        return true;
    }
}