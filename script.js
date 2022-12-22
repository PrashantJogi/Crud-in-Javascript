let count = 0;
let inputValues = document.querySelectorAll("input");
let fields = document.getElementsByClassName("inputFields");

function submit() {

  if (fields[0].id !== "") {
    let targetRow = document.getElementById(fields[0].id);
    let values = [];
    let arr = [];
    arr = [targetRow];

    arr.forEach((data) => {
      values = data.children;
    });

    for (i = 0; i < inputValues.length; i++) {
      values[i].innerHTML = inputValues[i].value;
    }
  }

  if (inputValues && fields[0].id === "") {
    let table = document.getElementById("tbody");
    document.getElementById("dataTable").style.display="block";
    let row = table.insertRow();
    row.setAttribute("id", count);
    count++;
    for (let i = 0; i < inputValues.length; i++) {
      row.insertCell().innerHTML = inputValues[i].value;
    }
    row.insertCell().innerHTML =
      "<button onclick='update(this)'>Update</button>" +
      "<button onclick='del(this)'>Delete</button>";
    // row.insertCell().innerHTML=updateBtn;
  }

  //calling clean function for cleaning input fields after data submission
  clean();
  
}

//for cleaning input fields after submitting data
function clean() {
  inputValues.forEach((element) => {
    element.value = "";
  });
  fields[0].id = "";
}

//for update entry
function update(element) {
  let id = element.parentElement.parentElement.id;
  let values = [];
  let target = document.getElementById(id);
  let arr = [];
  arr = [target];

  arr.forEach((data) => {
    values = data.children;
  });

  for (i = 0; i < values.length - 1; i++) {
    console.log(values[i].innerHTML);
    inputValues[i].value = values[i].innerHTML;
  }
  inputValues[0].parentElement.id = id;
}

//for delete entry
function del(element) {
  let id = element.parentElement.parentElement;
  let table = document.getElementById("tbody");
  if (confirm("This entry will be deleted !") === true) {
    confirmation = true;
    id.remove();
  }
  
  if (table.childNodes.length===1){
   document.getElementById("dataTable").style.display="none"
  } 
}

//validation code
function validateForm() {
  let allFields = document.querySelectorAll("input");
   let error = []
  let dataArr = [];

  allFields.forEach((field) => {
    checkValidation(field, dataArr, error);
  });
  
//   console.log(error.length>0 ? error : "empty", "error");
  if(error.length===0){
      submit();
  }
}

function checkValidation(field, dataArr, error) {
  if (field.dataset.validation) {
    let isInvalid = false;
    const validationRules = field.dataset.validation.split("|");
    validationRules.map((validation) => {
      // debugger;
      if (!isInvalid) {
        if (validation === "required") {
          let isValidMessage;
          if (field.type.includes("checkbox") || field.type.includes("radio")) {
            isValidMessage = validateCheckBox_And_RadioBtn(field.name);
          } else {
            isValidMessage = validateRequired(field.value, field.name);
          }
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
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
            error.push(field.name);
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
            error.push(field.name);
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
            error.push(field.name);
            isInvalid = true;
          } else {
            // debugger;

            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        }
      }
    });
    dataArr.push({ [field.name]: field.value });
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

  if (!value || parseInt(value) < parseInt(param)) {
    return `${fieldName} must at least ${param}.`;
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

function validateRegex(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");
  const regex = new RegExp(param);
  if (regex.test(value) === false) {
    return `Please enter a valid ${fieldName} `;
  }
  return undefined;
}

function validateCheckBox_And_RadioBtn(fieldName) {
  let field = document.getElementsByName(fieldName);
  let IsValid = false;

  field.forEach((element) => {
    if (element.checked === true) {
      IsValid = true;
    }
  });
  if (!IsValid) {
    return `${fieldName} is required.`;
  }
}
