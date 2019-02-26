export default class FieldValidation {
    static fields = [];
    static tests = [];
    static setFields(f){
        FieldValidation.fields = f;
        let tests = []
        for(let i = 0; i < f.length; i++){
            tests[f[i].name] = f[i].validation
        }
        FieldValidation.tests = tests;
    }
    static validate(activists, index, field){
        const test = FieldValidation.tests[field];
        const fieldVal = activists[index][field];
        if(test!==null){
            activists[index][field+"Valid"] = test.test(fieldVal);
        }
    }
    static validateAll(activists){
        for(let i=0; i<activists.length; i++){
            for(let j=0; j<this.fields.length; j++){
                if(!activists[i][this.fields[j].name+"Valid"]){
                    return false;
                }
            }
        }
        return true;
    }
}