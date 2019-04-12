export default class FieldValidation {
    static fields = [];
    static tests = [];
    static setFields(f){
        FieldValidation.fields = f;
        let tests = [];
        for(let i = 0; i < f.length; i++){
            tests[f[i].name] = f[i].validation
        }
        FieldValidation.tests = tests;
    }
    static validate(value, field){
        const test = FieldValidation.tests[field];
        const fieldVal = value;
        if(test !== null && test !== undefined){
           return test.test(fieldVal);
        }
        return true;
    }
    static validateAll(activists){
        for(let i=0; i<activists.length; i++){
            for(let j=0; j<this.fields.length; j++){
                //if the field is outright invalid - return false
                if(activists[i][this.fields[j].name+"Valid"] === false){
                    return false;
                }
                //if the field wasn't checked yet - check it, and return false if it turns out to be invalid
                if(!activists[i][this.fields[j].name+"Valid"]){
                    const test = this.fields[j].validation;
                    const required = this.fields[j].required;
                    const fieldVal = activists[i][this.fields[j].name] || null;
                    if(test !== null && test !== undefined){
                        const valid = test.test(fieldVal) && (fieldVal || !required);
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