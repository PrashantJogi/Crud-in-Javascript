 function validateForm() {
  
   let allFields = document.querySelectorAll("input");
   
   let dataArr = []

   allFields.forEach((field) => {
       
    checkValidation(field,dataArr)
   })
   
  }

function checkValidation (field,dataArr){
 
    
    if (field.dataset.validation) {
        let isInvalid = false
        const validationRules = field.dataset.validation.split("|");
        validationRules.map((validation) => {
          // debugger;
          if (!isInvalid) {
            if (validation === "required") {
               let isValidMessage
                if(field.type.includes("checkbox")||field.type.includes("radio")){
                        
                     isValidMessage = validateCheckBox_And_RadioBtn( field.name);      
                }else{

                    isValidMessage = validateRequired(field.value, field.name);
                }
              if (isValidMessage) {
                document.getElementById(`${field.name}Err`).innerHTML =
                  isValidMessage;
                isInvalid = true;
              } else {
                document.getElementById(`${field.name}Err`).innerHTML = "";
                // showData({[field.name]:field.value})
                
              }
            } else if (validation.includes("min:")) {
              const isValidMessage = validateMin(
                field.value,
                validation,
                field.name
              );
              if (isValidMessage) {
                document.getElementById(`${field.name}Err`).innerHTML =
                  isValidMessage;
                isInvalid = true;
              } else {
                document.getElementById(`${field.name}Err`).innerHTML = "";
              }
            } else if (validation.includes("max:")) {
                const isValidMessage = validateMax(
                  field.value,
                  validation,
                  field.name
                );
                if (isValidMessage) {
                  document.getElementById(`${field.name}Err`).innerHTML =
                    isValidMessage;
                  isInvalid = true;
                } else {
                  document.getElementById(`${field.name}Err`).innerHTML = "";
                }
              // logic for max validation
            } else if (validation.includes("regex:")) {
              // logic for regex validation
              const isValidMessage = validateRegex(
                field.value,
                validation,
                field.name
              );
              if (isValidMessage) {
                document.getElementById(`${field.name}Err`).innerHTML =
                  isValidMessage;
                isInvalid = true;
              } else {
                // debugger;
               
                document.getElementById(`${field.name}Err`).innerHTML = "";
                
              }
            }
          }
          
        });
        dataArr.push({[field.name]:field.value})
      }

    
}

 

  function validateRequired(value, fieldName) {

    
    if (!value || value === "" || value.trim() === "") {
      return `${fieldName} is required.`;
    }
    return undefined;
  }
  
  function validateMin(value, validationRule, fieldName) {
    const [rule, param] = validationRule.split(":");
    
    if (!value || parseInt(value.length) < parseInt(param)) {
      return `${fieldName} must contain at least ${param} characters.`;
    }
    return undefined;
  }
  
  function validateMax(value, validationRule, fieldName) {
    const [rule, param] = validationRule.split(":");
    if (!value || parseInt(value.length) > parseInt(param)) {
        
        
      return `${fieldName} must not contain more than ${param} characters.`;
    }
    return undefined;
  }
  
  function validateRegex(value, validationRule, fieldName){
    const [rule, param] = validationRule.split(":");
    const regex = new RegExp(param)
    if (regex.test(value) === false) {
      return `Please enter a valid ${fieldName} `;
    }
    return undefined;
  }

  function validateCheckBox_And_RadioBtn (fieldName){
    let field = document.getElementsByName(fieldName)
    let IsValid = false
    
    field.forEach((element)=>{
            if(element.checked===true){
                IsValid = true   
            }    
            
    })
    if (!IsValid) {
        return `${fieldName} is required.`;
      }
  }