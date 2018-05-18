
var testResult = []; //Результаты теста хранятся тут


$(document).ready(function(){

  $('input[name=phone]').inputmask("+7(999)999-99-99");


  /*===================START TEST SECTION===================*/

  var questNumber = 1;
  var questIterator = 1;
  var questCount = testData.length;


  /*FUNCTIONS*/

  //Расчет количесва ответов на вопрос
  function answersCount(questIterator) {
    return testData[questIterator].answers.length;
  };

   //Функция построения DOM-разметки для вопроса теста
  function testStep(questIterator){

    let value = testData[questIterator - 1].question;

    return (
      '<div class="test-step test-step'+questIterator+'"><div class="test-question">'+ questIterator +'. '+ value +'</div><ul class="test-answers"></ul></div>'
    );
  };

  //Функция построения DOM-разметки для ответов на вопрос теста
  function testAnswer(answerIterator){

    let value = testData[questIterator - 1].answers[answerIterator];
    let valueT = value.replace(/<[^>]+>/g,'');
    let choiseType = testData[questIterator - 1].choiseType;

    if (choiseType == 'single') {
      return (
      '<li><label class="test-answer"><input type="radio" id="'+ questIterator +'" name="q-'+ questIterator +'" value="'+ valueT +'"><span></span><span>'+ value +'</span></label></li>'
    );
    } else if (choiseType == 'multiple') {
      return (
      '<li><label class="test-answer"><input type="checkbox" id="'+ questIterator +'" name="q-'+ questIterator +'" value="'+ valueT +'"><span></span><span>'+ value +'</span></label></li>'
      );
    }


  };

  //Функция расчета скидки
  function calculateDiscount(questNumber) {

    let container = $('.discount');
    let discountStep = 3000; //шаг скидки
    let discountMax = 21000 ; //максимальная скидка

    let discount = discountStep * questNumber + '';
    let discountResult;

    discount >= discountMax ? discount = (discountMax + '') : false;
    discount >= 10000 ? discountResult = discount.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') : discountResult = discount;


    container.html(discountResult + ' руб.');

  };

  /*END FUNCTIONS*/


  /* START TEST TEMPLATE BUILD */

  $('.quiz-steps').html('');

  for (let i = 0; i < (questCount + 1); i++) {

    let index = i + 1;

    $('.quiz-steps').append('<li>'+ index +'</li>');

  };

  $('.quiz-steps > li:eq(0)').addClass('active');

  $('.test-body').html('');

  for (let i = 0; i < questCount; i++) {

    $('.test-body').append(testStep(questIterator));

    var answerIterator = 0;

    for (let i = 0; i < answersCount(questIterator - 1); i++) {

      $('.test-answers:eq(-1)').append(testAnswer(answerIterator));
      answerIterator++;
    };

    questIterator++;
  };

  /* END TEST TEMPLATE BUILD */



  /* START TEST RESULT CALCULATION */


  $('.test-answer').find('input[type=radio]').click(function(){
    let name = $(this).closest('.test-answers').prev().text();
    let ans = $(this).val();

    let id = parseInt($(this).attr('id')) -1;
    let answ = [name, ans];
    testResult[id] = answ;

    if( $(this).parent().find('.text_inp').length )
      $(this).parent().find('.text_inp').prop('disabled', false).focus();
  });


  $('.test-answer').find('.text_inp').keyup(function(){

    let name = $(this).parent().closest('.test-answers').prev().text();
    let ans = $(this).val();

    let answ = [name, ans];

    testResult[testResult.length-1] = answ;
  });

  /* START TEST RESULT CALCULATION */


  /* TEST RUN */

  $('input[name=start]').click(function(){

    $('.header-title').removeClass('header-title-lg').parent().addClass('col-md-6 order-md-0');

    $('.test-step:eq(0)').addClass('test-step-active');
    $('.index').hide();
    $('.test-btn').hide();
    $('.quiz').fadeIn(500);
  });

  $('.test-answer').click(function(){

    $('.test-btn').show();
    calculateDiscount(questNumber);

  });

  $('input[name=next]').click(function(){
    $(this).closest('.test').find('.test-step:eq('+ (questNumber - 1) +')').removeClass('test-step-active').hide();
    $(this).closest('.test').find('.test-step:eq('+ questNumber +')').addClass('test-step-active');
    $('.quiz-steps > li:eq('+ questNumber +')').addClass('active');


    // TODO

    if( $(this).parent().prev().find('.test-step'+ questNumber).find('input[type=checkbox]:checked').length )
    {
      let name = $(this).parent().prev().find('.test-step'+questNumber).find('.test-question').text();
      let ans = "";

      let index = 1;
      $(this).parent().prev().find('.test-step'+questNumber).find('input[type=checkbox]:checked').each(function(){
        ans += index + ". " + $(this).next().next().text() + "." + '\n';
        index++;
      });

      let answ = [name, ans];
      testResult[questNumber-1] = answ;
    }

    // TODO END

    questNumber++;

    $(this).parent().hide();

    if (questNumber >= (questCount + 1)) {

      calculateDiscount(questNumber);

      $(this).hide();

      // Анимация расчета результатов теста

      let delay = 6000; // Общая продолжительность анимации

      $('.loader').fadeIn(500).css('display', 'flex');

      let i = 0;

      let loadingMessage = [
        'Обработка результатов',
        'Подбор решения по параметрам',
        'Решение подобрано!'
      ];

      function loadingTextAnimate() {

        $('.loader-text').hide().text(loadingMessage[i]).fadeIn(500);
        i++;
        if (i == loadingMessage.length) clearInterval(interval);
      };

      var interval = setInterval(loadingTextAnimate, (delay / loadingMessage.length));
      loadingTextAnimate();

      setTimeout(function(){

        $('.quiz').hide();
        $('.loader').hide();
        $('.finish').fadeIn(500).css('display', 'block');

      }, delay);
    }
  });

  /* TEST FINISH */

/*===================END TEST SECTION===================*/

});


/*===================FORM SEND BEGIN===================*/

$("input[type=submit]").on('click', function(e){

  e.preventDefault();

  var sendData = {
    name: '',
    phone: '',
    email: '',
    answer: []
  };

  let form = $(this).closest('form');


  /* FORM VALIDATION START */

  form.find('input[type=text]').each(function(){

    let inputType = $(this).attr('name');
    let value = $(this).val();

    let data;

    if (inputType == 'name') {
      data = isValidName(value);
      sendData.name = data;
    }
    else if (inputType == 'email') {
      data = isValidEmail(value);
      sendData.email = data;
    }
    else if (inputType == 'phone') {
      data = isValidPhone(value);
      sendData.phone = data;
    }

    if ( data === false )
    {
      $(this).focus().addClass("error");

      let errorMessage = "Поле заполнено некорректно";
      if ( !value.length ) {
        errorMessage = "Поле обязательно для заполнения";
      }

      $(this).parent().find('.form-control-message').remove();
      $(this).after('<div class="form-control-message" style="display: block;">'+ errorMessage +'</div>');
    }
    else
    {
      $(this).removeClass("error").parent().find('.form-control-message').remove();
    }
  });

  if( form.find('.error').length )
    return;

  /* FORM VALIDATION END */

  testResult = JSON.stringify(testResult);

  sendData.answer = testResult;

  // console.log(sendData); // Для отладки

  $.post('module/function.php?testAnswer', sendData, function(e){
	 console.log(e);
  });

  $('.loader').show().find('.loader-text').text('Пожалуйста подождите...');

  setTimeout(function(){

    $('.quiz, .finish, .loader').hide();
    $('.thank').fadeIn(500).css('display', 'block');

  }, 1500);

  setTimeout(function(){

     location.replace("/thank");

  }, 2000);

});

/*===================FORM SEND END===================*/
