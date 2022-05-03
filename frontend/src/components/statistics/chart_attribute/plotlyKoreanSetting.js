import $ from 'jquery';

export const plotlyKorSetting = {
  changePlotlyLang: () => {
    $('.modebar-btn').each(function (index) {
      /*console.log("t :  ",$(this).attr('data-title'))*/
      switch ($(this).attr('data-title')) {
        case 'Produced with Plotly.js (v2.9.0)':
        case 'Box Select':
        case 'Lasso Select':
          $(this).hide();
          break;
        case 'Toggle show closest data on hover':
          $(this).attr('data-title','데이터 값 표시&숨김');
          break;
        case 'Zoom':
          $(this).attr('data-title','확대');
          break;
        case 'Download plot as a png':
          $(this).attr('data-title','png 다운로드');
          break;
      }
    })
  }
}

export default plotlyKorSetting;
