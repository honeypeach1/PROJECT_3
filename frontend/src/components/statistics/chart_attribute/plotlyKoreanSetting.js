import $ from 'jquery';

export const plotlyKorSetting = {
  changePlotlyLang: () => {
    $(".modebar-btn").each(() => {
      const t = $(this);
      console.log("t : ",t)

      switch (t.data('title')) {
        case 'Box Select':
        case 'Lasso Select':
          t.hide();
          break;
        case 'Toggle show closest data on hover':
          t.attr('data-title','데이터 값 표시&숨김');
          break;
        case 'Zoom':
          t.attr('data-title','확대');
          break;
        case 'Download plot as a png':
          t.attr('data-title','png 다운로드')
          break;
      }
    })
  }
}

export default plotlyKorSetting;
