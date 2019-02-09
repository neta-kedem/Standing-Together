export default class Typer {
    static fields = ['firstName', 'lastName', 'phone', 'residency', 'email'];
    static fieldValidation = {
        firstName:/^null|^.{2,}$/,
        lastName:/^null|^.{2,}$/,
        phone:/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,}$/,
        residency:/^null|^.{2,}$/,
        email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
    static validate(activists, index, field){
        const test = this.fieldValidation[field];
        const fieldVal = activists[index][field];
        if(test!==null){
            activists[index][field+"Valid"] = test.test(fieldVal);
        }
    }
    static validateAll(activists){
        for(let i=0; i<activists.length; i++){
            for(let j=0; j<this.fields.length; j++){
                if(!activists[i][this.fields[j]+"Valid"]){
                    return false;
                }
            }
        }
        return true;
    }
}