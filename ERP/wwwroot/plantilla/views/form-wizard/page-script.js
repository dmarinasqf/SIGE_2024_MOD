jQuery(function($) {
  // Smart Wizard v4.4.1 example

  // show/hide form validation
  $('#id-validate')
  .prop('checked', false)
  .on('change', function() {
    if( this.checked ) {
      $('form[novalidate]').addClass('d-none')
      $('#validation-form').removeClass('d-none')
    }
    else {
      $('form[novalidate]').removeClass('d-none')
      $('#validation-form').addClass('d-none')    
    }
  })


  var stepCount = $('#smartwizard-1').find('li > a').length
  var left = (100 / (stepCount * 2))
  // for example if we have **4** steps, `left` and `right` of progressbar should be **12.5%**
  // so that before first step and after last step we don't have any lines
  $('#smartwizard-1').find('.wizard-progressbar').css( {left: left+'%', right: left+'%'} )

  // enable wizard
  var selectedStep = 0
  $('#smartwizard-1').smartWizard({
    theme: 'circles',
    useURLhash: false,
    showStepURLhash: false,
    autoAdjustHeight: true,
    transitionSpeed: 150,

    //errorSteps: [0,1],
    //disabledSteps: [2,3],

    selected: selectedStep,

    toolbarSettings: {
      toolbarPosition: 'bottom', // none, top, bottom, both
      toolbarButtonPosition: 'right', // left, right
      showNextButton: false, // show/hide a Next button
      showPreviousButton: false, // show/hide a Previous button
      toolbarExtraButtons: [
          $('<button class="btn btn-outline-secondary sw-btn-prev radius-l-1 mr-2px"><i class="fa fa-arrow-left mr-15"></i> Anterior</button>'),

          $('<button class="btn btn-outline-primary sw-btn-next sw-btn-hide radius-r-1" id="btnsiguiente2wizard">Siguiente <i class="fa fa-arrow-right mr-15"></i></button>'),

          $('<button class="btn btn-green sw-btn-finish radius-r-1" id="btnfinalizar2wizard">Finalizar <i class="fa fa-check mr-15"></i></button>')
          .on('click', function(){
              //Finish Action
          }),
      ]
    }
  })

  .removeClass('d-none')// initially it is hidden, and we show it after it is properly rendered

  .on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
    // move the progress bar by increasing its size (width)
    var progress = parseInt((stepNumber + 1) * 100 / stepCount)
    var halfStepWidth = parseInt(100 / stepCount) / 2
    progress -= halfStepWidth //because for example for the first step, we don't want progressbar to move all the way to next step

    $('#smartwizard-1').find('.wizard-progressbar').css('max-width', progress+'%')

    // hide/show card toolbar buttons
    // if we are not in the first step, previous button should be enabled, otherwise disabled
    if (stepNumber > 0) {
      $('#wizard-1-prev').removeAttr('disabled')  
    }
    else {
      $('#wizard-1-prev').attr('disabled', '')     
    }

    // if we are in the last step, next button should be hidden, and finish button shown instead
    if (stepNumber == stepCount - 1) {
      $('#wizard-1-next').addClass('d-none')
      $('#wizard-1-finish').removeClass('d-none')
    }
    else {
      $('#wizard-1-next').removeClass('d-none')
      $('#wizard-1-finish').addClass('d-none')
    }
 })
 .on("leaveStep", function(e, anchorObject, stepNumber, stepDirection) {
  if(stepNumber == 0 && stepDirection == 'forward')  {
    
    // use jQuery plugin to validate
      //COMENTED BY GUSTAVO--------------------
   // if( document.getElementById('id-validate').checked && !$('#validation-form').valid() ) return false;

    // or use HTML & Bootstrap validation
    /**
    var form = document.getElementById('validation-form');
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

      form.classList.add('was-validated');
      return false;
    }
    */
  }
})
.triggerHandler('showStep', [null, selectedStep, null, null]) // move progressbar to step 1 (0 index)


 // handle `click` event of card toolbar buttons
  $('#wizard-1-prev').on('click', function() {
    $('#smartwizard-1').smartWizard('prev')
  })

  $('#wizard-1-next').on('click', function() {
    $('#smartwizard-1').smartWizard('next')
  })

  $('#wizard-1-finish').on('click', function() {
    //
  })





})