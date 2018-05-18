function isValidEmail( email ){
  if( !email.length )
    return true;

  let emailP = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
  let resultEmail = emailP.exec( email );
  if( !resultEmail )
    return false;

  return resultEmail[0];
}

function isValidPhone( phone ){
  if( !phone.length )
    return false;

  phone = phone.replace(/\-/gi, '');
  phone = phone.replace(/\ /gi, '');
  phone = phone.replace(/\)/gi, '');
  phone = phone.replace(/\(/gi, '');

  let phoneP = /((\+7|8)[\-\ \(]?)[\d\ \-]+/;
  let resultPhone = phoneP.exec( phone );
  if( !resultPhone || resultPhone[0].length != 12 )
    return false;

  return resultPhone[0];
}

function isValidName( name ){
  if( !name.length )
    return true;

  if( name.length && name.length < 3 )
    return false;

  return name;
}



/* TEMPLATE */

// function isValidEmail( email ){
//   if( !email.length )
//     return false;

//   let emailP = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
//   let resultEmail = emailP.exec( email );
//   if( !resultEmail )
//     return false;

//   return resultEmail[0];
// }

// function isValidPhone( phone ){
//   if( !phone.length )
//     return false;

//   phone = phone.replace(/\-/gi, '');
//   phone = phone.replace(/\ /gi, '');
//   phone = phone.replace(/\)/gi, '');
//   phone = phone.replace(/\(/gi, '');

//   let phoneP = /((\+7|8)[\-\ \(]?)[\d\ \-]+/;
//   let resultPhone = phoneP.exec( phone );
//   if( !resultPhone || resultPhone[0].length != 12 )
//     return false;

//   return resultPhone[0];
// }

// function isValidName( name ){
//   if( !name.length || name.length < 3 )
//     return false;

//   return name;
// }


/* END TEMPLATE */